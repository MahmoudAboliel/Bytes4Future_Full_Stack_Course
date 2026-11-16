import { TripService } from '../services/trip.service.js';

export const tripController = {
  async getAllTrips(req, res) {
    try {
      const { source, destination, tripDate, busModelId, status, available } = req.query;
      const filters = { source, destination, tripDate, busModelId, status };
      
      let trips;
      if (available === 'true') {
        trips = await TripService.getAvailableTrips(filters);
      } else {
        trips = await TripService.getAllTrips(filters);
      }

      return res.status(200).json({
        success: true,
        count: trips.length,
        data: trips,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        ...(error.errors ? { errors: error.errors } : {}),
      });
    }
  },

  async getTripById(req, res) {
    try {
      const trip = await TripService.getTripById(req.params.id);
      return res.status(200).json({
        success: true,
        data: trip,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal server error',
      });
    }
  },

  async createTrip(req, res) {
    try {
      const trip = await TripService.createTrip(req.body);
      return res.status(201).json({
        success: true,
        message: 'Trip created successfully',
        data: trip,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        ...(error.errors ? { errors: error.errors } : {}),
      });
    }
  },

  async updateTrip(req, res) {
    try {
      const userId = req.user ? (req.user._id || req.user.id) : null;
      const trip = await TripService.updateTrip(req.params.id, req.body, userId);
      return res.status(200).json({
        success: true,
        message: 'Trip updated successfully',
        data: trip,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        ...(error.errors ? { errors: error.errors } : {}),
      });
    }
  },

  async deleteTrip(req, res) {
    try {
      const result = await TripService.deleteTrip(req.params.id);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal server error',
      });
    }
  },
};
