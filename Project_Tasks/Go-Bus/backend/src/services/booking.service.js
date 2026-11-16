import { BusModel } from "../models/BusModel.model.js";
import { Booking } from "../models/Booking.model.js";
import Trip from "../models/Trip.model.js";
import mongoose from "mongoose";

/**
 * Reconcile a trip's bookedSeatsCount with actual active bookings in the DB.
 */
export const reconcileTripBookedSeats = async (tripId) => {
  const activeBookings = await Booking.find({
    tripId,
    status: { $in: ["reserved", "confirmed"] },
  });
  const totalBooked = activeBookings.reduce((sum, b) => sum + b.seatNumbers.length, 0);
  await Trip.findByIdAndUpdate(tripId, { bookedSeatsCount: totalBooked });
  return totalBooked;
};

export const createBooking = async (customerId, tripId, seatNumbers) => {

  if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
    throw new Error("At least one seat is required");
  }

  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw new Error("Trip not found");
  }

  if (!["scheduled", "active"].includes(trip.status)) {
    throw new Error("This trip is not available for booking");
  }

  const busModel = await BusModel.findById(trip.busModelId);
  if (!busModel) {
    throw new Error("Bus model not found");
  }

  const uniqueSeats = new Set(seatNumbers);
  if (
    seatNumbers.some(
      (seat) => !Number.isInteger(seat) || seat < 1 || seat > busModel.capacity,
    ) ||
    uniqueSeats.size !== seatNumbers.length
  ) {
    throw new Error("Invalid seat numbers");
  }

  // Check seat conflicts with active bookings
  const existingBookings = await Booking.find({
    tripId,
    status: { $in: ["reserved", "confirmed"] },
  });

  const bookedSeats = existingBookings.flatMap((booking) => booking.seatNumbers);
  const isSeatBooked = seatNumbers.some((seat) => bookedSeats.includes(seat));
  if (isSeatBooked) {
    throw new Error("One or more seats are already booked");
  }

  // Atomically increment bookedSeatsCount with capacity check
  const updatedTrip = await Trip.findOneAndUpdate(
    {
      _id: tripId,
      $expr: {
        $lte: [{ $add: ["$bookedSeatsCount", seatNumbers.length] }, busModel.capacity],
      },
    },
    { $inc: { bookedSeatsCount: seatNumbers.length } },
    { new: true }
  );

  if (!updatedTrip) {
    throw new Error("Not enough available seats or capacity exceeded");
  }

  try {
    const booking = await Booking.create({
      tripId,
      customerId,
      seatNumbers,
      status: "reserved",
    });
    return booking;
  } catch (error) {
    // Rollback trip counter if booking creation fails
    await Trip.findByIdAndUpdate(tripId, {
      $inc: { bookedSeatsCount: -seatNumbers.length },
    });
    throw error;
  }
};

export const getAllBookings = async () => {
  const bookings = await Booking.find()
    .populate("customerId", "name phone username")
    .populate("tripId");
  return bookings;
};

export const getBookingById = async (bookingId) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new Error("Invalid booking ID");
  }
  const booking = await Booking.findById(bookingId)
    .populate("customerId", "name phone username")
    .populate("tripId");

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
};

export const getCustomerBookings = async (customerId) => {
  const bookings = await Booking.find({ customerId }).populate("tripId");
  return bookings;
};

export const updateBooking = async (bookingId, customerId, newSeatNumbers) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.customerId.toString() !== customerId.toString()) {
    throw new Error("You cannot update this booking");
  }

  if (booking.status === "cancelled") {
    throw new Error("Cancelled bookings cannot be updated");
  }

  if (!Array.isArray(newSeatNumbers) || newSeatNumbers.length === 0) {
    throw new Error("At least one seat is required");
  }

  const trip = await Trip.findById(booking.tripId);
  if (!trip) {
    throw new Error("Trip not found");
  }

  const busModel = await BusModel.findById(trip.busModelId);
  if (!busModel) {
    throw new Error("Bus model not found");
  }

  if (
    newSeatNumbers.some(
      (seat) => !Number.isInteger(seat) || seat < 1 || seat > busModel.capacity,
    ) ||
    new Set(newSeatNumbers).size !== newSeatNumbers.length
  ) {
    throw new Error("Invalid seat numbers");
  }

  const otherBookings = await Booking.find({
    tripId: booking.tripId,
    _id: { $ne: bookingId },
    status: { $in: ["reserved", "confirmed"] },
  });

  const otherBookedSeats = otherBookings.flatMap((item) => item.seatNumbers);
  const hasConflict = newSeatNumbers.some((seat) => otherBookedSeats.includes(seat));
  if (hasConflict) {
    throw new Error("One or more seats are already booked");
  }

  const oldSeatCount = booking.seatNumbers.length;
  const newSeatCount = newSeatNumbers.length;
  const difference = newSeatCount - oldSeatCount;

  if (difference > 0) {
    const updatedTrip = await Trip.findOneAndUpdate(
      {
        _id: booking.tripId,
        $expr: {
          $lte: [{ $add: ["$bookedSeatsCount", difference] }, busModel.capacity],
        },
      },
      { $inc: { bookedSeatsCount: difference } },
      { new: true }
    );

    if (!updatedTrip) {
      throw new Error("Not enough available seats");
    }
  } else if (difference < 0) {
    await Trip.findByIdAndUpdate(booking.tripId, {
      $inc: { bookedSeatsCount: difference },
    });
  }

  booking.seatNumbers = newSeatNumbers;
  await booking.save();

  return booking;
};

export const cancelBooking = async (bookingId, userId, userRole = "customer") => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }

  if (userRole === "customer" && booking.customerId.toString() !== userId.toString()) {
    throw new Error("You cannot cancel this booking");
  }

  if (booking.status === "cancelled") {
    throw new Error("Booking is already cancelled");
  }

  const trip = await Trip.findById(booking.tripId);
  if (!trip) {
    throw new Error("Trip not found");
  }

  const numberOfSeats = booking.seatNumbers.length;

  booking.status = "cancelled";
  await booking.save();

  await Trip.findByIdAndUpdate(booking.tripId, {
    $inc: { bookedSeatsCount: -numberOfSeats },
  });

  // Ensure bookedSeatsCount never drops below 0
  await Trip.updateOne(
    { _id: booking.tripId, bookedSeatsCount: { $lt: 0 } },
    { $set: { bookedSeatsCount: 0 } }
  );

  return booking;
};

export const confirmBooking = async (bookingId, userId, userRole = "customer") => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }

  if (userRole === "customer" && booking.customerId.toString() !== userId.toString()) {
    throw new Error("You cannot confirm this booking");
  }

  if (booking.status === "cancelled") {
    throw new Error("Cancelled bookings cannot be confirmed");
  }

  if (booking.status === "confirmed") {
    return booking;
  }

  booking.status = "confirmed";
  await booking.save();

  return booking;
};
