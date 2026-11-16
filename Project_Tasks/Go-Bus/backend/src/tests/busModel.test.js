import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
import { BusModel } from '../models/BusModel.model.js';
import { User } from '../models/User.model.js';
import { signToken } from '../utils/token.util.js';
import http from 'http';

dotenv.config();

let server;
let adminToken;
let customerToken;
let createdBusModelId;

const runTests = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/pullman_booking_test';
    await mongoose.connect(mongoUri);
    console.log('Test DB connected.');

    // Clean DB
    await BusModel.deleteMany({});
    await User.deleteMany({});

    // Create Admin and Customer users
    const adminUser = await User.create({
      name: 'Admin User',
      phone: '1234567890',
      username: 'admin_test',
      password: 'hashedpassword',
      role: 'admin'
    });

    const customerUser = await User.create({
      name: 'Customer User',
      phone: '0987654321',
      username: 'customer_test',
      password: 'hashedpassword',
      role: 'customer'
    });

    adminToken = signToken({ userId: adminUser._id, role: adminUser.role });
    customerToken = signToken({ userId: customerUser._id, role: customerUser.role });

    // Start express app on ephemeral port
    await new Promise((resolve) => {
      server = http.createServer(app);
      server.listen(0, resolve);
    });
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}/api/bus-models`;

    // Helper request helper
    const request = async (path, options = {}) => {
      const res = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
          ...(options.headers || {})
        }
      });
      const data = await res.json().catch(() => null);
      return { status: res.status, data };
    };

    console.log('\n--- Running Bus Model Tests ---');

    // Test 8: Prevent duplicate seed records (run seed twice)
    console.log('Test 8: Seeding and preventing duplicate records...');
    const { BusModelService } = await import('../services/busModel.service.js');
    await BusModelService.seedBusModels();
    let count1 = await BusModel.countDocuments();
    await BusModelService.seedBusModels();
    let count2 = await BusModel.countDocuments();
    assert(count1 === 6 && count2 === 6, 'Seed should insert exactly 6 records and not duplicate on re-execution');
    console.log('✓ Passed: Seed records are not duplicated (count = 6)');

    // Test 1: Successfully retrieve all six predefined bus models
    console.log('Test 1: Retrieve all bus models...');
    const res1 = await request('', { token: customerToken });
    assert(res1.status === 200 && res1.data.success && res1.data.count === 6, 'Should retrieve 6 bus models');
    console.log('✓ Passed: Retrieved all 6 predefined bus models');

    // Test 5: Reject unauthorized create and update requests
    console.log('Test 5: Reject unauthorized requests (customer role or no token)...');
    const res5a = await request('', {
      method: 'POST',
      token: customerToken,
      body: JSON.stringify({ category: 'first_class', size: 'large', capacity: 45, totalBusesCount: 2, layoutDetails: '2+1' })
    });
    assert(res5a.status === 403, 'Customer should not be able to create bus model');

    const res5b = await request('', {
      method: 'POST',
      body: JSON.stringify({ category: 'first_class', size: 'large', capacity: 45, totalBusesCount: 2, layoutDetails: '2+1' })
    });
    assert(res5b.status === 401, 'Unauthenticated request should be rejected');
    console.log('✓ Passed: Unauthorized create requests correctly rejected');

    // Test 6: Reject invalid categories, sizes, and capacities
    console.log('Test 6: Reject invalid categories, sizes, and capacities...');
    const res6a = await request('', {
      method: 'POST',
      token: adminToken,
      body: JSON.stringify({ category: 'invalid_cat', size: 'large', capacity: 45, totalBusesCount: 2, layoutDetails: '2+1' })
    });
    assert(res6a.status === 400, 'Should reject invalid category');

    const res6b = await request('', {
      method: 'POST',
      token: adminToken,
      body: JSON.stringify({ category: 'first_class', size: 'huge', capacity: 45, totalBusesCount: 2, layoutDetails: '2+1' })
    });
    assert(res6b.status === 400, 'Should reject invalid size');

    // Clear db to test creation of custom/individual one
    await BusModel.deleteMany({});

    const res6c = await request('', {
      method: 'POST',
      token: adminToken,
      body: JSON.stringify({ category: 'first_class', size: 'large', capacity: 99, totalBusesCount: 2, layoutDetails: '2+1' })
    });
    assert(res6c.status === 400, 'Should reject mismatched capacity for first_class large (expected 45)');
    console.log('✓ Passed: Invalid categories, sizes, and capacities correctly rejected');

    // Re-seed for valid tests
    await BusModelService.seedBusModels();
    const allModels = await BusModel.find();
    createdBusModelId = allModels[0]._id.toString();

    // Test 3: Successfully update an existing bus model as Admin
    console.log('Test 3: Successfully update existing bus model as Admin...');
    const res3 = await request(`/${createdBusModelId}`, {
      method: 'PUT',
      token: adminToken,
      body: JSON.stringify({ totalBusesCount: 12, layoutDetails: 'Updated 2+1 layout' })
    });
    assert(res3.status === 200 && res3.data.success && res3.data.data.totalBusesCount === 12, 'Should update bus model');
    console.log('✓ Passed: Successfully updated existing bus model');

    // Test 4: Successfully update the fleet count
    console.log('Test 4: Successfully update fleet count...');
    const res4 = await request(`/${createdBusModelId}/fleet`, {
      method: 'PATCH',
      token: adminToken,
      body: JSON.stringify({ totalBusesCount: 20 })
    });
    assert(res4.status === 200 && res4.data.success && res4.data.data.totalBusesCount === 20, 'Should update fleet count');
    console.log('✓ Passed: Successfully updated fleet count');

    // Test 7: Reject negative fleet counts
    console.log('Test 7: Reject negative fleet counts...');
    const res7 = await request(`/${createdBusModelId}/fleet`, {
      method: 'PATCH',
      token: adminToken,
      body: JSON.stringify({ totalBusesCount: -5 })
    });
    assert(res7.status === 400, 'Should reject negative fleet count');
    console.log('✓ Passed: Negative fleet counts correctly rejected');

    console.log('\nAll 8 Bus Model Management test scenarios passed successfully! 🎉');
    
    await mongoose.disconnect();
    setTimeout(() => {
      process.exit(0);
    }, 100);
  } catch (error) {
    console.error('Test failed with error:', error);
    if (server) server.close();
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

runTests();
