import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
import Trip from '../models/Trip.model.js';
import { BusModel } from '../models/BusModel.model.js';
import { User } from '../models/User.model.js';
import { Booking } from '../models/Booking.model.js';
import { signToken } from '../utils/token.util.js';
import http from 'http';

dotenv.config();

let server;
let adminToken;
let customerToken1;
let customerToken2;
let tripId;
let busModelId;

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
};

const runBookingTests = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/pullman_booking_test';
    await mongoose.connect(mongoUri);
    console.log('Test DB connected for Bookings & bookedSeatsCount.');

    // Clean DB
    await Trip.deleteMany({});
    await BusModel.deleteMany({});
    await User.deleteMany({});
    await Booking.deleteMany({});

    // Create users
    const adminUser = await User.create({
      name: 'Admin',
      phone: '1112223330',
      username: 'admin_booking',
      password: 'password',
      role: 'admin'
    });

    const customer1 = await User.create({
      name: 'Customer One',
      phone: '1112223331',
      username: 'customer1',
      password: 'password',
      role: 'customer'
    });

    const customer2 = await User.create({
      name: 'Customer Two',
      phone: '1112223332',
      username: 'customer2',
      password: 'password',
      role: 'customer'
    });

    adminToken = signToken({ userId: adminUser._id, role: adminUser.role });
    customerToken1 = signToken({ userId: customer1._id, role: customer1.role });
    customerToken2 = signToken({ userId: customer2._id, role: customer2.role });

    // Create BusModel with capacity 10
    const busModel = await BusModel.create({
      category: 'economy_class',
      size: 'medium',
      capacity: 10,
      layoutDetails: 'Economy',
      totalBusesCount: 2
    });
    busModelId = busModel._id;

    // Create Trip
    const trip = await Trip.create({
      source: 'City A',
      destination: 'City B',
      busModelId,
      price: 25.0,
      tripDate: '2025-07-01',
      tripTime: '10:00',
      scheduleType: 'manual',
      status: 'scheduled'
    });
    tripId = trip._id;

    // Start server
    await new Promise((resolve) => {
      server = http.createServer(app);
      server.listen(0, resolve);
    });
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}/api/bookings`;

    const request = async (path, options = {}) => {
      const res = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
          ...(options.headers || {})
        }
      });
      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.log('NON-JSON RESPONSE:', text);
      }
      return { status: res.status, data };
    };

    console.log('\n--- Running Booking & bookedSeatsCount Tests ---');

    // 1. Initial bookedSeatsCount should be 0
    let tripCheck = await Trip.findById(tripId);
    assert(tripCheck.bookedSeatsCount === 0, 'Initial bookedSeatsCount should be 0');
    console.log('✓ Passed: Initial bookedSeatsCount is 0');

    // 2. Customer 1 makes a booking for seats [1, 2, 3]
    console.log('Test 2: New booking increases bookedSeatsCount correctly...');
    const res2 = await request('', {
      method: 'POST',
      token: customerToken1,
      body: JSON.stringify({ tripId, seatNumbers: [1, 2, 3] })
    });
    if (!res2.data.success) {
      console.log('RES2 ERROR:', res2);
    }
    assert(res2.status === 201 && res2.data.success, 'Should create booking successfully');
    const bookingId1 = res2.data.data._id;

    tripCheck = await Trip.findById(tripId);
    assert(tripCheck.bookedSeatsCount === 3, `bookedSeatsCount should be 3, got ${tripCheck.bookedSeatsCount}`);
    console.log('✓ Passed: Booking increases bookedSeatsCount to 3');

    // 3. Reject duplicate seat reservations (Customer 2 tries booking seat [3])
    console.log('Test 3: Reject duplicate seat reservations...');
    const res3 = await request('', {
      method: 'POST',
      token: customerToken2,
      body: JSON.stringify({ tripId, seatNumbers: [3, 4] })
    });
    assert(res3.status === 400, 'Should reject already booked seat [3]');
    tripCheck = await Trip.findById(tripId);
    assert(tripCheck.bookedSeatsCount === 3, 'bookedSeatsCount should remain 3 after failed booking');
    console.log('✓ Passed: Duplicate seat reservations rejected and counter unchanged');

    // 4. Over-capacity booking rejection
    console.log('Test 4: Over-capacity booking rejection...');
    const res4 = await request('', {
      method: 'POST',
      token: customerToken2,
      body: JSON.stringify({ tripId, seatNumbers: [5, 6, 7, 8, 9, 10, 11, 12] }) // 8 seats when only 7 available
    });
    assert(res4.status === 400, 'Should reject over-capacity booking');
    console.log('✓ Passed: Over-capacity booking rejected');

    // 5. Customer 2 successfully books available seats [4, 5]
    console.log('Test 5: Customer 2 books seats [4, 5]...');
    const res5 = await request('', {
      method: 'POST',
      token: customerToken2,
      body: JSON.stringify({ tripId, seatNumbers: [4, 5] })
    });
    assert(res5.status === 201 && res5.data.success, 'Customer 2 should book [4, 5]');
    tripCheck = await Trip.findById(tripId);
    assert(tripCheck.bookedSeatsCount === 5, `bookedSeatsCount should be 5, got ${tripCheck.bookedSeatsCount}`);
    console.log('✓ Passed: bookedSeatsCount updated to 5');

    // 6. Cancellation decreases bookedSeatsCount correctly
    console.log('Test 6: Cancellation decreases bookedSeatsCount...');
    const res6 = await request(`/${bookingId1}/cancel`, {
      method: 'PATCH',
      token: customerToken1
    });
    assert(res6.status === 200 && res6.data.success, 'Should cancel booking 1');
    tripCheck = await Trip.findById(tripId);
    assert(tripCheck.bookedSeatsCount === 2, `bookedSeatsCount should decrease to 2, got ${tripCheck.bookedSeatsCount}`);
    console.log('✓ Passed: Cancellation correctly decreased bookedSeatsCount to 2');

    // 7. Repeated cancellation does not decrease twice
    console.log('Test 7: Repeated cancellation rejected...');
    const res7 = await request(`/${bookingId1}/cancel`, {
      method: 'PATCH',
      token: customerToken1
    });
    assert(res7.status === 400, 'Should reject cancelling already cancelled booking');
    tripCheck = await Trip.findById(tripId);
    assert(tripCheck.bookedSeatsCount === 2, 'bookedSeatsCount should remain 2');
    console.log('✓ Passed: Repeated cancellation rejected and count preserved');

    // 8. Reconciliation service test
    console.log('Test 8: Reconciliation service correctness...');
    const { reconcileTripBookedSeats } = await import('../services/booking.service.js');
    await Trip.findByIdAndUpdate(tripId, { bookedSeatsCount: 999 }); // corrupt it manually
    await reconcileTripBookedSeats(tripId);
    tripCheck = await Trip.findById(tripId);
    assert(tripCheck.bookedSeatsCount === 2, `Reconciliation should set count to 2, got ${tripCheck.bookedSeatsCount}`);
    console.log('✓ Passed: Reconciliation successfully restored bookedSeatsCount to 2');

    console.log('\nAll Booking & bookedSeatsCount Tests Passed Successfully! 🎉');
  } catch (error) {
    console.error('Test failed with error:', error);
    process.exit(1);
  } finally {
    if (server) server.close();
    await mongoose.connection.close();
  }
};

runBookingTests();
