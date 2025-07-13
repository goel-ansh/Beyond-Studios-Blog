import express from "express";
import { adminLogin, approveCommentById, deleteCommentById, getAllBlogsAdmin, getAllComments, getDashboard } from "../controllers/adminController.js";
import auth, { requireRole } from "../middleware/auth.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/comments", auth, requireRole('admin', 'editor'), getAllComments);
adminRouter.get("/blogs", auth, requireRole('admin', 'editor'), getAllBlogsAdmin);
adminRouter.post("/delete-comment", auth, requireRole('admin', 'editor'), deleteCommentById);
adminRouter.post("/approve-comment", auth, requireRole('admin', 'editor'), approveCommentById);
adminRouter.get("/dashboard", auth, requireRole('admin', 'editor', 'reader'), getDashboard);

export default adminRouter;