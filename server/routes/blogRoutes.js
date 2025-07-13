import express from "express";
import { addBlog, addComment, deleteBlogById, generateContent, getAllBlogs, getBlogById, getBlogBySlug, getBlogComments, togglePublish, toggleLikeBlog, getBlogLikeStatus, editBlog, incrementShare, incrementView, getDashboardStats } from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth, { requireRole } from "../middleware/auth.js";
import Blog from "../models/Blog.js";

const blogRouter = express.Router();

// Static routes first (before parameterized routes)
blogRouter.post("/add", upload.single('image'), auth, requireRole('admin', 'editor'), addBlog);
blogRouter.get('/all', getAllBlogs);
blogRouter.get('/dashboard/stats', auth, requireRole('admin', 'editor'), getDashboardStats);
blogRouter.post('/delete', auth, requireRole('admin'), deleteBlogById);
blogRouter.post('/toggle-publish', auth, requireRole('admin', 'editor'), togglePublish);
blogRouter.post('/add-comment', addComment);
blogRouter.post('/comments', getBlogComments);
blogRouter.post('/generate', auth, requireRole('admin', 'editor'), generateContent);
blogRouter.post('/share-test', (req, res) => res.json({ success: true, message: "Share test route works" }));

// Test route to debug TOC issue
blogRouter.get('/test-toc/:blogId', async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }
        res.json({ 
            success: true, 
            title: blog.title,
            hasTOC: !!blog.tableOfContents,
            tocLength: blog.tableOfContents?.length || 0,
            tocData: blog.tableOfContents 
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Parameterized routes last
blogRouter.get('/slug/:slug', getBlogBySlug);
blogRouter.get('/:blogId', getBlogById);
blogRouter.post('/like/:blogId', auth, toggleLikeBlog);
blogRouter.get('/like-status/:blogId', (req, res, next) => {
    // Optional auth - continue even if no token provided
    const authHeader = req.headers.authorization;
    if (authHeader) {
        auth(req, res, next);
    } else {
        req.user = null;
        next();
    }
}, getBlogLikeStatus);
blogRouter.put('/edit/:blogId', upload.single('image'), auth, requireRole('admin', 'editor'), editBlog);
blogRouter.post('/share/:blogId', incrementShare);
blogRouter.post('/view/:blogId', incrementView);

export default blogRouter;