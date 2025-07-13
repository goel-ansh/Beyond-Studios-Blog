import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

export const adminLogin = async (req, res)=>{
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.json({success: false, message: "Email and password are required"});
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({success: false, message: "Invalid Credentials"})
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({success: false, message: "Invalid Credentials"})
        }

        // Check if user has admin or editor role
        if (user.role !== 'admin' && user.role !== 'editor') {
            return res.json({success: false, message: "Access denied. Admin or Editor role required."})
        }

        // Generate token with user data
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email, 
                role: user.role 
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true, 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.error('Admin login error:', error);
        res.json({success: false, message: error.message})
    }
}

export const getAllBlogsAdmin = async (req, res) =>{
    try {
        const blogs = await Blog.find({}).sort({createdAt: -1});
        res.json({success: true, blogs})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getAllComments = async (req, res) =>{
    try {
        const comments = await Comment.find({}).populate("blog").sort({createdAt: -1})
        res.json({success: true, comments})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getDashboard = async (req, res) =>{
    try {
        const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
        const blogs = await Blog.countDocuments();
        const comments = await Comment.countDocuments()
        const drafts = await Blog.countDocuments({isPublished: false})

        const dashboardData = {
            blogs, comments, drafts, recentBlogs
        }
        res.json({success: true, dashboardData})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const deleteCommentById = async (req, res) =>{
    try {
        const {id} = req.body;
        await Comment.findByIdAndDelete(id);
        res.json({success: true, message:"Comment deleted successfully" })
    } catch (error) {
       res.json({success: false, message: error.message}) 
    }
}

export const approveCommentById = async (req, res) =>{
    try {
        const {id} = req.body;
        await Comment.findByIdAndUpdate(id, {isApproved: true});
        res.json({success: true, message:"Comment approved successfully" })
    } catch (error) {
       res.json({success: false, message: error.message}) 
    }
}