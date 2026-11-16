import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { BusModelService } from '../services/busModel.service.js';

dotenv.config();

const seed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/pullman_booking';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    console.log('Seeding predefined bus models...');
    const results = await BusModelService.seedBusModels();
    
    results.forEach(res => {
      console.log(`- [${res.action.toUpperCase()}] ${res.model.title} (Category: ${res.model.category}, Size: ${res.model.size}, Capacity: ${res.model.capacity}, Fleet: ${res.model.totalBusesCount})`);
    });

    console.log('Bus model seeding completed successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding bus models:', error);
    try {
      await mongoose.disconnect();
    } catch (e) {}
    process.exit(1);
  }
};

seed();
