import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export default transporter;