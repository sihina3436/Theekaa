import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/authRequest";

export const allowRoles =
  (...roles: ("user" | "admin")[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role) ) {
      return res.status(403).json({ message: "Forbidden", requiredRoles: roles, userRole: req.user?.role });
    }

    next();
  };