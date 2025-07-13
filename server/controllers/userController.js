import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js';
import transporter from '../configs/nodemailer.js';

export const register = async (req, res) => {
    try {
        const {name, email, password, role = 'reader'} = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.json({success: false, message: "User already exists"});
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET);
        // Send welcome email
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Welcome to the Blog!',
                html: `<p>Hi ${name},</p>
                       <p>Thank you for registering. We're excited to have you.</p>
                       <p>Best regards,<br>The Team</p>`
            };
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
            // Don't block registration if email fails. The user is already created.
        }

        res.json({success: true, token, user: {id: user._id, name: user.name, email: user.email, role: user.role}});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Check for admin credentials first (legacy support)
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Find existing admin user or create one
            let adminUser = await User.findOne({email: process.env.ADMIN_EMAIL, role: 'admin'});
            
            if (!adminUser) {
                // Create admin user if doesn't exist
                const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
                adminUser = await User.create({
                    name: 'Admin',
                    email: process.env.ADMIN_EMAIL,
                    password: hashedPassword,
                    role: 'admin',
                    isActive: true
                });
                console.log('Created admin user:', adminUser._id);
            }
            
            const token = jwt.sign({id: adminUser._id, email: adminUser.email, role: adminUser.role}, process.env.JWT_SECRET);
            return res.json({
                success: true, 
                token, 
                user: {
                    id: adminUser._id, 
                    email: adminUser.email, 
                    role: adminUser.role, 
                    name: adminUser.name
                }
            });
        }

        // Check for regular user
        const user = await User.findOne({email});
        if(!user) {
            return res.json({success: false, message: "User not found"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.json({success: false, message: "Invalid credentials"});
        }

        if(!user.isActive) {
            return res.json({success: false, message: "Account is deactivated"});
        }

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET);
        // Send login notification email
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Successful Login',
                html: `<p>Hi ${user.name},</p>
                       <p>We detected a new login to your account. If this was not you, please contact us immediately.</p>
                       <p>Best regards,<br>The Team</p>`
            };
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error("Failed to send login email:", emailError);
        }
        
        res.json({success: true, token, user: {id: user._id, name: user.name, email: user.email, role: user.role}});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({createdAt: -1});
        res.json({success: true, users});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const updateUserRole = async (req, res) => {
    try {
        const {userId, role} = req.body;
        await User.findByIdAndUpdate(userId, {role});
        res.json({success: true, message: "User role updated successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const toggleUserStatus = async (req, res) => {
    try {
        const {userId} = req.body;
        const user = await User.findById(userId);
        user.isActive = !user.isActive;
        await user.save();
        res.json({success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const adminUsers = await User.countDocuments({ role: 'admin' });
        const editorUsers = await User.countDocuments({ role: 'editor' });
        const readerUsers = await User.countDocuments({ role: 'reader' });
        
        // Get recent users (last 10)
        const recentUsers = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(10);

        const stats = {
            totalUsers,
            activeUsers,
            adminUsers,
            editorUsers,
            readerUsers,
            recentUsers
        };

        res.json({ success: true, stats });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
