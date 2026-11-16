import Trip from "../models/Trip.model.js";
import { BusModel } from "../models/BusModel.model.js";
import { Booking } from "../models/Booking.model.js";
import { TripScheduleChange } from "../models/TripScheduleChange.model.js";
import mongoose from "mongoose";

export const validateTripInput = async (data, isUpdate = false) => {
  const errors = [];
  const {
    source,
    destination,
    busModelId,
    price,
    tripDate,
    tripTime,
    scheduleType,
    status,
  } = data;

  if (!isUpdate || source !== undefined) {
    if (!source || typeof source !== "string" || !source.trim()) {
      errors.push("Source is required and must be a non-empty string");
    }
  }

  if (!isUpdate || destination !== undefined) {
    if (
      !destination ||
      typeof destination !== "string" ||
      !destination.trim()
    ) {
      errors.push("Destination is required and must be a non-empty string");
    }
  }

  if (!isUpdate || busModelId !== undefined) {
    if (!busModelId || !mongoose.Types.ObjectId.isValid(busModelId)) {
      errors.push("Valid busModelId is required");
    } else {
      const busModel = await BusModel.findById(busModelId);
      if (!busModel) {
        errors.push("BusModel referenced does not exist");
      }
    }
  }

  if (!isUpdate || price !== undefined) {
    if (
      price === undefined ||
      typeof price !== "number" ||
      price < 0 ||
      Number.isNaN(price)
    ) {
      errors.push("Price is required and must be a non-negative number");
    }
  }

  if (!isUpdate || tripDate !== undefined) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (
      !tripDate ||
      typeof tripDate !== "string" ||
      !dateRegex.test(tripDate)
    ) {
      errors.push("Trip date is required and must be in YYYY-MM-DD format");
    }
  }

  if (!isUpdate || tripTime !== undefined) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3])(:[0-5][0-9])?$/; // accepts HH or HH:mm
    if (
      !tripTime ||
      typeof tripTime !== "string" ||
      !timeRegex.test(tripTime)
    ) {
      errors.push(
        "Trip time is required and must be in valid HH or HH:mm format",
      );
    }
  }

  if (scheduleType !== undefined) {
    if (!["manual", "daily", "weekly", "monthly"].includes(scheduleType)) {
      errors.push(
        "Invalid scheduleType. Must be manual, daily, weekly, or monthly",
      );
    }
  }

  if (status !== undefined) {
    if (!["scheduled", "active", "completed"].includes(status)) {
      errors.push("Invalid status. Must be scheduled, active, or completed");
    }
  }

  return errors;
};

export const TripService = {
  async getAllTrips(filters = {}) {
    const query = {};
    if (filters.source) {
      query.source = { $regex: new RegExp(filters.source, "i") };
    }
    if (filters.destination) {
      query.destination = { $regex: new RegExp(filters.destination, "i") };
    }
    if (filters.tripDate) {
      query.tripDate = filters.tripDate;
    }
    if (filters.busModelId) {
      query.busModelId = filters.busModelId;
    }
    if (filters.status) {
      query.status = filters.status;
    }
    return await Trip.find(query)
      .populate("busModelId")
      .sort({ tripDate: 1, tripTime: 1 });
  },

  async getAvailableTrips(filters = {}) {
    const query = { status: { $in: ["scheduled", "active"] } };
    if (filters.source)
      query.source = { $regex: new RegExp(filters.source, "i") };
    if (filters.destination)
      query.destination = { $regex: new RegExp(filters.destination, "i") };
    if (filters.tripDate) query.tripDate = filters.tripDate;
    if (filters.busModelId) query.busModelId = filters.busModelId;
    return await Trip.find(query)
      .populate("busModelId")
      .sort({ tripDate: 1, tripTime: 1 });
  },

  async getTripById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error("Invalid trip ID");
      err.statusCode = 400;
      throw err;
    }
    const trip = await Trip.findById(id).populate("busModelId").lean();
    if (!trip) {
      const err = new Error("Trip not found");
      err.statusCode = 404;
      throw err;
    }
    const tripBooking = await Booking.find({
      tripId: id,
      status: { $in: ["reserved", "confirmed"] },
    }).lean();
    return { ...trip, tripBooking };
  },

  async createTrip(data) {
    const errors = await validateTripInput(data, false);
    if (errors.length > 0) {
      const err = new Error("Validation failed");
      err.statusCode = 400;
      err.errors = errors;
      throw err;
    }

    const existing = await Trip.findOne({
      source: data.source.trim(),
      destination: data.destination.trim(),
      tripDate: data.tripDate,
      tripTime: data.tripTime,
    });
    if (existing) {
      const err = new Error(
        "A trip with the same source, destination, date, and time already exists.",
      );
      err.statusCode = 409;
      throw err;
    }

    const trip = new Trip(data);
    await trip.save();
    return await Trip.findById(trip._id).populate("busModelId");
  },

  async updateTrip(id, data, userId) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error("Invalid trip ID");
      err.statusCode = 400;
      throw err;
    }

    const errors = await validateTripInput(data, true);
    if (errors.length > 0) {
      const err = new Error("Validation failed");
      err.statusCode = 400;
      err.errors = errors;
      throw err;
    }

    const trip = await Trip.findById(id);
    if (!trip) {
      const err = new Error("Trip not found");
      err.statusCode = 404;
      throw err;
    }

    if (data.price !== undefined && Number(data.price) !== trip.price) {
      const hasBooking = await Booking.exists({ tripId: id });
      if (hasBooking) {
        const err = new Error(
          "Cannot update price because bookings exist for this trip.",
        );
        err.statusCode = 400;
        throw err;
      }
    }

    const isRescheduling =
      (data.tripDate && data.tripDate !== trip.tripDate) ||
      (data.tripTime && data.tripTime !== trip.tripTime);

    const oldTripDate = trip.tripDate;
    const oldTripTime = trip.tripTime;

    let transactionSucceeded = false;
    let session = null;

    try {
      session = await mongoose.startSession();
      session.startTransaction();

      Object.assign(trip, data);
      await trip.save({ session });

      if (isRescheduling) {
        const scheduleChange = new TripScheduleChange({
          tripId: trip._id,
          changedBy: userId,
          oldTripDate,
          oldTripTime,
          newTripDate: trip.tripDate,
          newTripTime: trip.tripTime,
        });
        await scheduleChange.save({ session });
      }

      await session.commitTransaction();
      session.endSession();
      transactionSucceeded = true;
    } catch (txError) {
      if (session) {
        try {
          await session.abortTransaction();
        } catch (e) {}
        session.endSession();
      }

      // If error is because replica set/mongos is not active, fallback to non-transaction operations safely
      const isNotReplicaSet =
        txError.message && txError.message.includes("replica set");
      if (!isNotReplicaSet && txError.statusCode) {
        throw txError;
      }
    }

    if (!transactionSucceeded) {
      // Re-fetch fresh trip document if transaction was aborted
      const freshTrip = await Trip.findById(id);
      Object.assign(freshTrip, data);
      await freshTrip.save();

      if (isRescheduling) {
        const scheduleChange = new TripScheduleChange({
          tripId: freshTrip._id,
          changedBy: userId,
          oldTripDate,
          oldTripTime,
          newTripDate: freshTrip.tripDate,
          newTripTime: freshTrip.tripTime,
        });
        await scheduleChange.save();
      }
    }

    return await Trip.findById(id).populate("busModelId");
  },

  async deleteTrip(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error("Invalid trip ID");
      err.statusCode = 400;
      throw err;
    }

    const trip = await Trip.findById(id);
    if (!trip) {
      const err = new Error("Trip not found");
      err.statusCode = 404;
      throw err;
    }

    const hasBooking = await Booking.exists({ tripId: id });
    if (hasBooking) {
      const err = new Error(
        "Cannot delete trip because bookings are associated with it.",
      );
      err.statusCode = 400;
      throw err;
    }

    await Trip.findByIdAndDelete(id);
    return { message: "Trip deleted successfully" };
  },
};
