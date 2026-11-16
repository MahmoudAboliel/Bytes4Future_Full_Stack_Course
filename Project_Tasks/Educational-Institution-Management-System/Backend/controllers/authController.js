import * as authService from "../services/authService.js";
import {
  createUserSchema,
  loginUserSchema,
} from "../validators/userValidator.js";
import { handleError } from "../utils/lib.js";

export const register = async (req, res) => {
  try {
    const validation = createUserSchema.safeParse(req.body);
    if (!validation.success) {
      throw Object.assign(
        new Error(
          validation.error.issues
            .map((i) => `${i.path}: ${i.message.split(":")[0]}`)
            .join(", "),
        ),
        {
          status: 400,
        },
      );
    }

    const result = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const login = async (req, res) => {
  try {
    const validation = loginUserSchema.safeParse(req.body);
    if (!validation.success) {
      throw Object.assign(
        new Error(
          validation.error.issues
            .map((i) => `${i.path}: ${i.message.split(":")[0]}`)
            .join(", "),
        ),
        {
          status: 400,
        },
      );
    }
    const result = await authService.loginUser(req.body);
    console.log(result)

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export async function me(req, res) {
  try {
    const user = await getAuthenticatedUser(req);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

const getAuthenticatedUser = async (req) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw Object.assign(new Error("authorization token required"), {
      status: 401,
    });
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    throw Object.assign(new Error("authorization token required"), {
      status: 401,
    });
  }

  return authService.authenticateToken(token);
};

export async function logout(req, res) {
  try {
    const user = await getAuthenticatedUser(req);

    await authService.logoutUser(user._id);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return handleError(res, error);
  }
}
