import { NextRequest } from "next/server";
import { verifyToken, JWTPayload } from "./auth";

export const getUserFromRequest = (request: NextRequest): JWTPayload | null => {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
};

export const requireAuth = (
  request: NextRequest,
  requiredRole?: "user" | "admin" | "superadmin",
) => {
  const user = getUserFromRequest(request);

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (requiredRole && user.role !== requiredRole) {
    throw new Error("Forbidden");
  }

  return user;
};
