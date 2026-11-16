// booking.controller.js placeholder
import {
  createBooking,
  getAllBookings,
  getBookingById,
  getCustomerBookings,
  updateBooking,
  cancelBooking,
  confirmBooking,
} from "../services/booking.service.js";

// Create Booking
export const createBookingController = async (req, res, next) => {
  try {
    const customerId = req.user._id;
    const { tripId, seatNumbers } = req.body;
    
    const booking = await createBooking(customerId, tripId, seatNumbers);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Bookings (Secretary / Admin)
export const getAllBookingsController = async (req, res, next) => {
  try {
    const bookings = await getAllBookings();

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// Get Booking By ID (Secretary / Admin)
export const getBookingByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await getBookingById(id);

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// Get Customer Bookings
export const getCustomerBookingsController = async (req, res, next) => {
  try {
    const customerId = req.user._id;

    const bookings = await getCustomerBookings(customerId);

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// Update Booking
export const updateBookingController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customerId = req.user._id;
    const { seatNumbers } = req.body;

    const booking = await updateBooking(id, customerId, seatNumbers);

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel Booking
export const cancelBookingController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const booking = await cancelBooking(id, userId, userRole);

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// Confirm Booking
export const confirmBookingController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const booking = await confirmBooking(id, userId, userRole);

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
