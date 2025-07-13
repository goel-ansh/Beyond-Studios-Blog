import Contact from '../models/Contact.js';
import Newsletter from '../models/Newsletter.js';
import transporter from '../configs/nodemailer.js';

export const contact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Save contact to database
        const newContact = await Contact.create({ name, email, message });

        // Send email to admin
        const mailOptionsAdmin = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Contact Form Submission',
            html: `<p>You have a new contact form submission:</p>
                   <p><strong>Name:</strong> ${name}</p>
                   <p><strong>Email:</strong> ${email}</p>
                   <p><strong>Message:</strong> ${message}</p>`
        };
        await transporter.sendMail(mailOptionsAdmin);

        // Send confirmation email to user
        const mailOptionsUser = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting us!',
            html: `<p>Hi ${name},</p>
                   <p>Thank you for reaching out to us. We have received your message and will get back to you shortly.</p>
                   <p>Best regards,<br>The Team</p>`
        };
        await transporter.sendMail(mailOptionsUser);

        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email already exists
        const existingSubscriber = await Newsletter.findOne({ email });
        if (existingSubscriber) {
            return res.json({ success: false, message: 'Email already subscribed' });
        }

        // Save subscriber to database
        await Newsletter.create({ email });

        // Send welcome email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to our Newsletter!',
            html: `<p>Thank you for subscribing to our newsletter. You'll be the first to know about our latest updates and news.</p>
                   <p>Best regards,<br>The Team</p>`
        };
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Subscribed successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Newsletter.find({}).sort({ createdAt: -1 });
        res.json({ success: true, subscribers });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}