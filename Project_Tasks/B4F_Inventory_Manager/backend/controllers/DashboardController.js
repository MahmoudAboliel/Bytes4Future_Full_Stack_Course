import * as dashboardService from "../services/dashboardService.js";

export const dashboardController = async (req, res) => {
  try {
    const data = await dashboardService.getFullDashboard();
    res
      .status(200)
      .json({ success: true, message: "fetch data successfully", data });
  } catch (e) {
    console.error("dashboard error: ", e);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch data", data: null });
  }
};
