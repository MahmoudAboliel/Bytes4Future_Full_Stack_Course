import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.model.js';
import { BusModel } from '../models/BusModel.model.js';
import Trip from '../models/Trip.model.js';
import { Booking } from '../models/Booking.model.js';

dotenv.config();

const TRIP_COUNT = 20;
const SCHEDULE_TYPES = ['manual', 'daily', 'weekly', 'monthly'];
const ROUTES = [
  ['دمشق', 'حلب'],
  ['دمشق', 'حمص'],
  ['دمشق', 'اللاذقية'],
  ['دمشق', 'طرطوس'],
  ['حلب', 'حماة'],
  ['حمص', 'اللاذقية'],
  ['حماة', 'دمشق'],
  ['طرطوس', 'حلب'],
  ['اللاذقية', 'حمص'],
  ['حلب', 'دمشق'],
];

const formatDate = (date) => date.toISOString().slice(0, 10);

const clearCollectionsExceptUsersAndBuses = async () => {
  const preservedCollections = new Set([
    User.collection.collectionName,
    BusModel.collection.collectionName,
  ]);
  const collections = await mongoose.connection.db
    .listCollections({}, { nameOnly: true })
    .toArray();
  const collectionsToClear = collections.filter(
    ({ name, type }) =>
      type === 'collection' &&
      !name.startsWith('system.') &&
      !preservedCollections.has(name),
  );

  for (const { name } of collectionsToClear) {
    await mongoose.connection.db.collection(name).deleteMany({});
    console.log(`Cleared collection: ${name}`);
  }
};

const createDemoTripsAndBookings = async (busModels, customers) => {
  const baseDate = new Date();
  baseDate.setUTCHours(0, 0, 0, 0);

  const trips = Array.from({ length: TRIP_COUNT }, (_, index) => {
    const [source, destination] = ROUTES[index % ROUTES.length];
    const tripDate = new Date(baseDate);
    tripDate.setUTCDate(tripDate.getUTCDate() + index + 1);

    return {
      source,
      destination,
      busModelId: busModels[index % busModels.length]._id,
      price: 15 + (index % 8) * 5,
      tripDate: formatDate(tripDate),
      tripTime: `${String(6 + (index % 12)).padStart(2, '0')}:00`,
      scheduleType: SCHEDULE_TYPES[index % SCHEDULE_TYPES.length],
      status: 'scheduled',
      bookedSeatsCount: 4,
    };
  });

  const createdTrips = await Trip.insertMany(trips);
  const bookings = createdTrips.flatMap((trip, index) => [
    {
      tripId: trip._id,
      customerId: customers[index % customers.length]._id,
      seatNumbers: [1, 2],
      status: 'confirmed',
    },
    {
      tripId: trip._id,
      customerId: customers[(index + 1) % customers.length]._id,
      seatNumbers: [3, 4],
      status: 'reserved',
    },
  ]);

  await Booking.insertMany(bookings);
  return { trips: createdTrips.length, bookings: bookings.length };
};

const seedDemoData = async () => {
  const mongoUri =
    process.env.MONGO_URI || 'mongodb://localhost:27017/pullman_booking';
  await mongoose.connect(mongoUri);
  console.log(
    `Connected to MongoDB at ${mongoose.connection.host}/${mongoose.connection.name}.`,
  );

  const [customers, busModels] = await Promise.all([
    User.find({ role: 'customer' }).select('_id').lean(),
    BusModel.find({ capacity: { $gte: 4 } }).select('_id capacity').lean(),
  ]);

  if (customers.length === 0) {
    throw new Error(
      'No customer users found. Add at least one customer before seeding.',
    );
  }

  if (busModels.length === 0) {
    throw new Error(
      'No bus models with capacity for at least 4 seats found. Add a bus model before seeding.',
    );
  }

  console.log('Clearing all collections except users and bus models...');
  await clearCollectionsExceptUsersAndBuses();

  const result = await createDemoTripsAndBookings(busModels, customers);
  console.log(
    `Seeded ${result.trips} trips and ${result.bookings} bookings. ` +
      `Each schedule type has ${TRIP_COUNT / SCHEDULE_TYPES.length} trips.`,
  );
};

seedDemoData()
  .catch((error) => {
    console.error('Demo data seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
