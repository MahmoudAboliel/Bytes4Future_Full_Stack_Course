import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seatNumbers: {
      type: [Number],
      required: true,
      validate: {
        validator: (seats) =>
          seats.length > 0 &&
          seats.every((seat) => Number.isInteger(seat) && seat > 0) &&
          new Set(seats).size === seats.length,
        message: "Seats must be positive unique integers",
      },
    },

    status: {
      type: String,
      enum: ["reserved", "confirmed", "cancelled"],
      default: "reserved",
      required: true,
    },

    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const Booking = mongoose.model("Booking", bookingSchema);
