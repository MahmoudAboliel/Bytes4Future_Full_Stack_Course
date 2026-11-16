import mongoose from 'mongoose';

const tripScheduleChangeSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  oldTripDate: { type: String, required: true },
  oldTripTime: { type: String, required: true },
  newTripDate: { type: String, required: true },
  newTripTime: { type: String, required: true }
}, { timestamps: true });

export const TripScheduleChange = mongoose.model('TripScheduleChange', tripScheduleChangeSchema, 'TripScheduleChanges');
