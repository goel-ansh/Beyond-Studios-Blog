import express from "express";
import { register, login, getAllUsers, updateUserRole, toggleUserStatus, getUserStats } from "../controllers/userController.js";
import auth, { requireRole } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/all", auth, requireRole('admin'), getAllUsers);
userRouter.get("/stats", auth, requireRole('admin'), getUserStats);
userRouter.post("/update-role", auth, requireRole('admin'), updateUserRole);
userRouter.post("/toggle-status", auth, requireRole('admin'), toggleUserStatus);

export default userRouter;
