import { BusModelService } from '../services/busModel.service.js';

export const busModelController = {
  async getAllBusModels(req, res) {
    try {
      const busModels = await BusModelService.getAllBusModels();
      return res.status(200).json({
        success: true,
        count: busModels.length,
        data: busModels
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to retrieve bus models'
      });
    }
  },

  async createBusModel(req, res) {
    try {
      const busModel = await BusModelService.createBusModel(req.body);
      return res.status(201).json({
        success: true,
        message: 'Bus model created successfully',
        data: busModel
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to create bus model',
        ...(error.errors && { errors: error.errors })
      });
    }
  },

  async updateBusModel(req, res) {
    try {
      const { id } = req.params;
      const busModel = await BusModelService.updateBusModel(id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Bus model updated successfully',
        data: busModel
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update bus model',
        ...(error.errors && { errors: error.errors })
      });
    }
  },

  async updateFleetCount(req, res) {
    try {
      const { id } = req.params;
      const { totalBusesCount } = req.body;
      const busModel = await BusModelService.updateFleetCount(id, totalBusesCount);
      return res.status(200).json({
        success: true,
        message: 'Fleet count updated successfully',
        data: busModel
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update fleet count'
      });
    }
  }
};
