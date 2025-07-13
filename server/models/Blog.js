import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    subTitle: {type: String},
    description: {type: String, required: true},
    content: {type: String, required: true},
    category: {type: String, required: true},
    image: {type: String, required: true},
    isPublished: {type: Boolean, required: true},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    readingTime: {type: Number, default: 5},
    tags: [{type: String}],
    metaTitle: {type: String},
    metaDescription: {type: String},
    slug: {type: String, unique: true},
    tableOfContents: [{
        title: {type: String, required: true},
        anchor: {type: String, required: true},
        level: {type: Number, default: 1, min: 1, max: 6}
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    likesCount: {type: Number, default: 0},
    views: {type: Number, default: 0},
    shares: {type: Number, default: 0}
},{timestamps: true});

const Blog = mongoose.model('blog', blogSchema);

export default Blog;