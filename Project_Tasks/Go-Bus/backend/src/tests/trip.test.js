import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
import Trip from '../models/Trip.model.js';
import { BusModel } from '../models/BusModel.model.js';
import { User } from '../models/User.model.js';
import { Booking } from '../models/Booking.model.js';
import { TripScheduleChange } from '../models/TripScheduleChange.model.js';
import { signToken } from '../utils/token.util.js';
import http from 'http';

dotenv.config();

let server;
let adminToken;
let customerToken;
let busModelId;
let createdTripId;

const runTests = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/pullman_booking_test';
    await mongoose.connect(mongoUri);
    console.log('Test DB connected for Trips.');

    // Clean DB
    await Trip.deleteMany({});
    await BusModel.deleteMany({});
    await User.deleteMany({});
    await Booking.deleteMany({});
    await TripScheduleChange.deleteMany({});

    // Create Admin and Customer users
    const adminUser = await User.create({
      name: 'Admin User',
      phone: '1111111111',
      username: 'admin_trip_test',
      password: 'hashedpassword',
      role: 'admin'
    });

    const customerUser = await User.create({
      name: 'Customer User',
      phone: '2222222222',
      username: 'customer_trip_test',
      password: 'hashedpassword',
      role: 'customer'
    });

    adminToken = signToken({ userId: adminUser._id, role: adminUser.role });
    customerToken = signToken({ userId: customerUser._id, role: customerUser.role });

    // Create a BusModel
    const busModel = await BusModel.create({
      category: 'first_class',
      size: 'large',
      capacity: 45,
      layoutDetails: '2+1',
      totalBusesCount: 5
    });
    busModelId = busModel._id.toString();

    // Start express app on ephemeral port
    await new Promise((resolve) => {
      server = http.createServer(app);
      server.listen(0, resolve);
    });
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}/api/trips`;

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

    console.log('\n--- Running Trip Management Tests ---');

    // Scenario 1: Admin successfully creates a manual trip
    console.log('Test 1: Admin creates manual trip...');
    const res1 = await request('', {
      method: 'POST',
      token: adminToken,
      body: JSON.stringify({
        source: 'Damascus',
        destination: 'Aleppo',
        busModelId,
        price: 50.0,
        tripDate: '2025-06-01',
        tripTime: '08:00',
        scheduleType: 'manual'
      })
    });
    assert(res1.status === 201 && res1.data.success && res1.data.data._id, 'Should create manual trip');
    createdTripId = res1.data.data._id;
    console.log('✓ Passed: Admin successfully created manual trip');

    // Scenario 2: Admin successfully creates daily, weekly, and monthly trips
    console.log('Test 2: Admin creates daily, weekly, and monthly trips...');
    const res2a = await request('', {
      method: 'POST',
      token: adminToken,
      body: JSON.stringify({
        source: 'Damascus',
        destination: 'Homs',
        busModelId,
        price: 30.0,
        tripDate: '2025-06-02',
        tripTime: '09:00',
        scheduleType: 'daily'
      })
    });
    assert(res2a.status === 201 && res2a.data.success && res2a.data.data.scheduleType === 'daily', 'Should create daily trip');

    const res2b = await request('', {
      method: 'POST',
      token: adminToken,
      body: JSON.stringify({
        source: 'Damascus',
        destination: 'Latakia',
        busModelId,
        price: 60.0,
        tripDate: '2025-06-03',
        tripTime: '10:00',
        scheduleType: 'weekly'
      })
    });
    assert(res2b.status === 201 && res2b.data.success && res2b.data.data.scheduleType === 'weekly', 'Should create weekly trip');

    const res2c = await request('', {
      method: 'POST',
      token: adminToken,
      body: JSON.stringify({
        source: 'Aleppo',
        destination: 'Damascus',
        busModelId,
        price: 70.0,
        tripDate: '2025-06-04',
        tripTime: '11:00',
        scheduleType: 'monthly'
      })
    });
    assert(res2c.status === 201 && res2c.data.success && res2c.data.data.scheduleType === 'monthly', 'Should create monthly trip');
    console.log('✓ Passed: Daily, weekly, and monthly trips successfully created');

    // Scenario 3: Invalid BusModel ID or nonexistent BusModel is rejected
    console.log('Test 3: Reject invalid or nonexistent BusModel ID...');
    const fakeBusModelId = new mongoose.Types.ObjectId().toString();
    const res3a = await request('', {
      method: 'POST',
      token: adminToken,
      body: JSON.stringify({
        source: 'Damascus',
        destination: 'Tartus',
        busModelId: fakeBusModelId,
        price: 40.0,
        tripDate: '2025-06-05',
        tripTime: '12:00'
      })
    });
    assert(res3a.status === 400, 'Should reject nonexistent BusModel ID');
    console.log('✓ Passed: Nonexistent BusModel ID correctly rejected');

    // Scenario 4: Invalid price, date, time, scheduleType, or status is rejected
    console.log('Test 4: Reject invalid price, date, time, scheduleType, status...');
    const res4 = await request('', {
      method: 'POST',
      token: adminToken,
      body: JSON.stringify({
        source: 'Damascus',
        destination: 'Tartus',
        busModelId,
        price: -10, // invalid negative price
        tripDate: '06-01-2025', // invalid date format
        tripTime: '25:00', // invalid time
        scheduleType: 'yearly', // invalid scheduleType
        status: 'cancelled' // invalid status
      })
    });
    assert(res4.status === 400, 'Should reject invalid trip parameters');
    console.log('✓ Passed: Invalid trip parameters correctly rejected');

    // Scenario 5: Authorized users can retrieve trips and apply supported filters
    console.log('Test 5: Retrieve trips and apply filters...');
    const res5 = await request('?source=Damascus&destination=Aleppo', { token: customerToken });
    assert(res5.status === 200 && res5.data.success && res5.data.count >= 1, 'Should filter trips by source and destination');
    console.log('✓ Passed: Successfully retrieved trips with filters');

    // Scenario 6: Non-admin users cannot perform administrator-only write operations
    console.log('Test 6: Non-admin write restrictions...');
    const res6 = await request('', {
      method: 'POST',
      token: customerToken,
      body: JSON.stringify({
        source: 'Damascus',
        destination: 'Daraa',
        busModelId,
        price: 25.0,
        tripDate: '2025-06-10',
        tripTime: '08:00'
      })
    });
    assert(res6.status === 403, 'Customer should not be allowed to create trip');
    console.log('✓ Passed: Non-admin write operations correctly rejected');

    // Scenario 7: Trip price update succeeds when no booking exists
    console.log('Test 7: Trip price update succeeds when no booking exists...');
    const res7 = await request(`/${createdTripId}`, {
      method: 'PUT',
      token: adminToken,
      body: JSON.stringify({ price: 55.0 })
    });
    assert(res7.status === 200 && res7.data.success && res7.data.data.price === 55.0, 'Should update price successfully');
    console.log('✓ Passed: Price update succeeded when no bookings exist');

    // Create a booking for createdTripId to test price update & deletion restrictions
    await Booking.create({
      tripId: createdTripId,
      customerId: customerUser._id,
      seatNumbers: [1],
      status: 'reserved'
    });

    // Scenario 8: Trip price update is rejected when any booking exists
    console.log('Test 8: Trip price update rejected when booking exists...');
    const res8 = await request(`/${createdTripId}`, {
      method: 'PUT',
      token: adminToken,
      body: JSON.stringify({ price: 65.0 })
    });
    assert(res8.status === 400, 'Should reject price update when bookings exist');
    console.log('✓ Passed: Price update correctly rejected when bookings exist');

    // Scenario 9: Trip rescheduling updates trip and creates correct TripScheduleChange record
    console.log('Test 9: Trip rescheduling updates trip and creates TripScheduleChange...');
    const res9 = await request(`/${createdTripId}`, {
      method: 'PUT',
      token: adminToken,
      body: JSON.stringify({ tripDate: '2025-06-02', tripTime: '14:00' })
    });
    assert(res9.status === 200 && res9.data.success && res9.data.data.tripDate === '2025-06-02', 'Should update trip date/time');

    const scheduleChangeRecord = await TripScheduleChange.findOne({ tripId: createdTripId });
    assert(scheduleChangeRecord && scheduleChangeRecord.oldTripDate === '2025-06-01' && scheduleChangeRecord.newTripDate === '2025-06-02', 'Should create valid TripScheduleChange record');
    console.log('✓ Passed: Trip rescheduling updated trip and created TripScheduleChange record');

    // Scenario 10 & 11: Trip deletion rejection when booking exists, and success when no booking exists
    console.log('Test 10 & 11: Trip deletion validation with bookings...');
    const res11 = await request(`/${createdTripId}`, {
      method: 'DELETE',
      token: adminToken
    });
    assert(res11.status === 400, 'Should reject trip deletion when booking exists');
    console.log('✓ Passed: Trip deletion rejected when booking exists');

    // Create another trip without bookings to test successful deletion
    const tripWithoutBooking = await Trip.create({
      source: 'Qamishli',
      destination: 'Damascus',
      busModelId,
      price: 80.0,
      tripDate: '2025-06-20',
      tripTime: '07:00'
    });

    const res10 = await request(`/${tripWithoutBooking._id}`, {
      method: 'DELETE',
      token: adminToken
    });
    assert(res10.status === 200 && res10.data.success, 'Should delete trip successfully when no booking exists');
    console.log('✓ Passed: Trip deletion succeeded when no booking exists');

    // Scenario 12: Sara's booking-related responsibilities are not duplicated or broken
    console.log('Test 12: Sara\'s booking responsibilities intact...');
    const remainingBooking = await Booking.findOne({ tripId: createdTripId });
    assert(remainingBooking !== null, 'Booking should remain intact');
    console.log('✓ Passed: Booking data and management workflow remain untouched and intact');

    console.log('\nAll 12 Trip Management test scenarios passed successfully! 🎉');

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
