import mongoose from "mongoose";

const bookingFollowUpSchema = new mongoose.Schema(
  {
    scheduleChangeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TripScheduleChange",
      required: true,
    },

    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    previousStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const BookingFollowUp = mongoose.model(
  "BookingFollowUp",
  bookingFollowUpSchema,
);
