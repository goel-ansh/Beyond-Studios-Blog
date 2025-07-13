import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {type: String, required: true},
    role: {
        type: String, 
        enum: ['admin', 'editor', 'reader'], 
        default: 'reader'
    },
    isActive: {type: Boolean, default: true}
},{timestamps: true});

const User = mongoose.model('user', userSchema);

export default User;
