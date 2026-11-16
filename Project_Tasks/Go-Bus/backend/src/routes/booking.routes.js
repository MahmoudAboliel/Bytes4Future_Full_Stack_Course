import { Router } from "express";

import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

import {
  createBookingController,
  getAllBookingsController,
  getBookingByIdController,
  getCustomerBookingsController,
  updateBookingController,
  cancelBookingController,
  confirmBookingController,
} from "../controllers/booking.controller.js";

const router = Router();

router.post("/", authenticate, authorize("customer"), createBookingController);

router.get(
  "/my-bookings",
  authenticate,
  authorize("customer"),
  getCustomerBookingsController,
);

router.patch(
  "/:id",
  authenticate,
  authorize("customer"),
  updateBookingController,
);

router.patch(
  "/:id/cancel",
  authenticate,
  authorize("customer", "secretary", "admin"),
  cancelBookingController,
);

router.patch(
  "/:id/confirm",
  authenticate,
  authorize("customer", "secretary", "admin"),
  confirmBookingController,
);

router.get(
  "/",                                                                                                                                                                                                                                                                                                                                          
  authenticate,
  authorize("secretary", "admin"),
  getAllBookingsController,
);

router.get(
  "/:id",
  authenticate,
  authorize("secretary", "admin"),
  getBookingByIdController,
);

export default router;
