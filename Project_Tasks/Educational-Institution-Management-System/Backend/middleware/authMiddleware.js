import * as authService from "../services/authService.js";

export async function authenticateToken(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "authorization token required",
      });
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "authorization token required",
      });
    }

    const user = await authService.authenticateToken(token);

    req.user = user;

    next();
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.status === 401 ? error.message : "authorization failed",
    });
  }
}
