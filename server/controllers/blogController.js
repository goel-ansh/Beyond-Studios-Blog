import fs from 'fs'
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import main from '../configs/gemini.js';

export const addBlog = async (req, res)=>{
    try {
        const {title, subTitle, description, content, category, isPublished, tags, metaTitle, metaDescription, tableOfContents} = JSON.parse(req.body.blog);
        const imageFile = req.file;

        // Debug logging
        console.log('User from token:', req.user);
        console.log('Blog data:', {title, content: content ? 'Content exists' : 'No content', category});

        // Get author from authenticated user FIRST
        let author = req.user?.id;
        
        // Handle legacy admin case - if no ID but has email, try to find or create admin user
        if (!author && req.user?.email && req.user?.role === 'admin') {
            console.log('Handling legacy admin case');
            // Try to find existing admin user
            const adminUser = await User.findOne({email: req.user.email, role: 'admin'});
            if (adminUser) {
                author = adminUser._id;
                console.log('Found existing admin user:', adminUser._id);
            } else {
                // Create admin user for legacy admin
                const newAdminUser = await User.create({
                    name: 'Admin',
                    email: req.user.email,
                    password: 'hashed-admin-password', // This won't be used for login
                    role: 'admin'
                });
                author = newAdminUser._id;
                console.log('Created new admin user:', newAdminUser._id);
            }
        }

        if (!author) {
            console.log('No author found - authentication error');
            return res.json({success: false, message: "Authentication error: Unable to identify user"});
        }

        console.log('Author resolved to:', author);

        // Check if all fields are present
        if(!title || !content || !category || !imageFile){
            const missingFields = [];
            if (!title) missingFields.push('title');
            if (!content) missingFields.push('content');
            if (!category) missingFields.push('category');
            if (!imageFile) missingFields.push('image');
            return res.json({success: false, message: `Missing required fields: ${missingFields.join(', ')}` })
        }

        const fileBuffer = fs.readFileSync(imageFile.path)

        // Upload Image to ImageKit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        })

        // optimization through imagekit URL transformation
        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                {quality: 'auto'}, // Auto compression
                {format: 'webp'},  // Convert to modern format
                {width: '1280'}    // Width resizing
            ]
        });

        const image = optimizedImageUrl;

        // Generate slug from title
        const slug = title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();

        // Parse tags if provided
        const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

        // Calculate reading time from content
        const readingTime = content ? Math.ceil(content.split(' ').length / 200) : 5;

        console.log('About to create blog with data:', {
            title,
            content: content ? content.substring(0, 100) + '...' : 'NO CONTENT',
            author,
            category
        });

        const blogData = {
            title, 
            subTitle, 
            description: description || subTitle || `${title} - ${category}`,
            content,
            category, 
            image, 
            isPublished,
            author,
            slug,
            readingTime,
            tags: tagsArray,
            metaTitle: metaTitle || title,
            metaDescription: metaDescription || subTitle || description?.substring(0, 160) || `${title} - ${category}`,
            tableOfContents: tableOfContents || []
        };

        console.log('Final blog data for database:', {
            ...blogData,
            content: blogData.content ? 'Content exists' : 'NO CONTENT',
            author: blogData.author || 'NO AUTHOR'
        });

        await Blog.create(blogData)

        res.json({success: true, message: "Blog added successfully"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getAllBlogs = async (req, res)=>{
    try {
        const blogs = await Blog.find({isPublished: true})
            .populate('author', 'name')
            .sort({createdAt: -1});
        res.json({success: true, blogs})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getBlogById = async (req, res) =>{
    try {
        const { blogId } = req.params;
        console.log(`Getting blog by ID: ${blogId}`);
        
        // Get blog without incrementing views (views are incremented via separate endpoint)
        const blog = await Blog.findById(blogId).populate('author', 'name email');
        
        if(!blog){
            console.log(`Blog not found: ${blogId}`);
            return res.json({ success: false, message: "Blog not found" });
        }
        
        console.log(`Blog found: ${blog.title}, Views: ${blog.views}, Shares: ${blog.shares}`);
        console.log(`TableOfContents exists: ${!!blog.tableOfContents}`);
        console.log(`TableOfContents length: ${blog.tableOfContents?.length || 0}`);
        console.log(`TableOfContents data:`, blog.tableOfContents);
        
        res.json({success: true, blog})
    } catch (error) {
        console.error(`Error in getBlogById: ${error.message}`);
        res.json({success: false, message: error.message})
    }
}

export const deleteBlogById = async (req, res) =>{
    try {
        const { id } = req.body;
        await Blog.findByIdAndDelete(id);

        // Delete all comments associated with the blog
        await Comment.deleteMany({blog: id});

        res.json({success: true, message: 'Blog deleted successfully'})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


export const togglePublish = async (req, res) =>{
    try {
        const { id } = req.body;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({success: true, message: 'Blog status updated'})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


export const addComment = async (req, res) =>{
    try {
        const {blog, name, content } = req.body;
        await Comment.create({blog, name, content});
        res.json({success: true, message: 'Comment added for review'})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getBlogComments = async (req, res) =>{
    try {
        const {blogId } = req.body;
        const comments = await Comment.find({blog: blogId, isApproved: true}).sort({createdAt: -1});
        res.json({success: true, comments})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const generateContent = async (req, res)=>{
    try {
        const {prompt} = req.body;
        const content = await main(prompt + ' Generate a blog content for this topic in simple text format')
        res.json({success: true, content})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getBlogBySlug = async (req, res) =>{
    try {
        const { slug } = req.params;
        const blog = await Blog.findOne({slug, isPublished: true})
            .populate('author', 'name email');
        if(!blog){
            return res.json({ success: false, message: "Blog not found" });
        }
        res.json({success: true, blog})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// Edit Blog
export const editBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const {title, subTitle, description, content, category, isPublished, tags, metaTitle, metaDescription, tableOfContents} = JSON.parse(req.body.blog);
        const imageFile = req.file;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.json({success: false, message: "Blog not found"});
        }

        // Check if user has permission to edit this blog
        if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.json({success: false, message: "Unauthorized to edit this blog"});
        }

        let image = blog.image; // Keep existing image if no new image uploaded

        if (imageFile) {
            const fileBuffer = fs.readFileSync(imageFile.path);
            
            // Upload new image to ImageKit
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: imageFile.originalname,
                folder: "/blogs"
            });

            // optimization through imagekit URL transformation
            const optimizedImageUrl = imagekit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'}, // Auto compression
                    {format: 'webp'},  // Convert to modern format
                    {width: '1280'}    // Width resizing
                ]
            });

            image = optimizedImageUrl;
        }

        // Generate slug from title if title changed
        let slug = blog.slug;
        if (title && title !== blog.title) {
            slug = title.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .trim();
        }

        // Parse tags if provided
        const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : blog.tags;

        // Calculate reading time
        const readingTime = content ? Math.ceil(content.split(' ').length / 200) : blog.readingTime;

        // Update blog
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                title: title || blog.title,
                subTitle: subTitle || blog.subTitle,
                description: description || blog.description,
                content: content || blog.content,
                category: category || blog.category,
                image,
                isPublished: isPublished !== undefined ? isPublished : blog.isPublished,
                tags: tagsArray,
                metaTitle: metaTitle || blog.metaTitle,
                metaDescription: metaDescription || blog.metaDescription,
                tableOfContents: tableOfContents || blog.tableOfContents,
                slug,
                readingTime
            },
            { new: true }
        );

        res.json({success: true, message: "Blog updated successfully", blog: updatedBlog});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Like/Unlike Blog
export const toggleLikeBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user.id;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.json({success: false, message: "Blog not found"});
        }

        const hasLiked = blog.likes.includes(userId);

        if (hasLiked) {
            // Unlike the blog
            blog.likes.pull(userId);
            blog.likesCount = Math.max(0, blog.likesCount - 1);
        } else {
            // Like the blog
            blog.likes.push(userId);
            blog.likesCount += 1;
        }

        await blog.save();

        res.json({
            success: true, 
            message: hasLiked ? "Blog unliked" : "Blog liked",
            isLiked: !hasLiked,
            likesCount: blog.likesCount
        });
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Get Blog Likes Status
export const getBlogLikeStatus = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user?.id;

        console.log('📊 Getting like status for blog:', blogId, 'user:', userId);

        const blog = await Blog.findById(blogId).select('likes likesCount');
        if (!blog) {
            console.log('❌ Blog not found:', blogId);
            return res.json({success: false, message: "Blog not found"});
        }

        const isLiked = userId ? blog.likes.includes(userId) : false;
        console.log('✅ Like status calculated:', {
            userId,
            isLiked,
            likesCount: blog.likesCount,
            totalLikes: blog.likes.length,
            likesArray: blog.likes
        });

        res.json({
            success: true,
            isLiked,
            likesCount: blog.likesCount
        });
    } catch (error) {
        console.error('❌ Error in getBlogLikeStatus:', error);
        res.json({success: false, message: error.message});
    }
}

// Increment Share Count
export const incrementShare = async (req, res) => {
    try {
        const { blogId } = req.params;
        console.log(`Incrementing share for blog: ${blogId}`);
        
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            { $inc: { shares: 1 } },
            { new: true }
        );
        
        if (!blog) {
            console.log(`Blog not found for share increment: ${blogId}`);
            return res.json({ success: false, message: "Blog not found" });
        }
        
        console.log(`Share incremented for blog: ${blog.title}, New share count: ${blog.shares}`);
        res.json({ success: true, message: "Share count updated", shares: blog.shares });
    } catch (error) {
        console.error(`Error in incrementShare: ${error.message}`);
        res.json({ success: false, message: error.message });
    }
};

// Increment View Count
export const incrementView = async (req, res) => {
    try {
        const { blogId } = req.params;
        console.log(`Incrementing view for blog: ${blogId}`);
        
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            { $inc: { views: 1 } },
            { new: true }
        );
        
        if (!blog) {
            console.log(`Blog not found for view increment: ${blogId}`);
            return res.json({ success: false, message: "Blog not found" });
        }
        
        console.log(`View incremented for blog: ${blog.title}, New view count: ${blog.views}`);
        res.json({ success: true, message: "View count updated", views: blog.views });
    } catch (error) {
        console.error(`Error in incrementView: ${error.message}`);
        res.json({ success: false, message: error.message });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const totalBlogs = await Blog.countDocuments();
        const publishedBlogs = await Blog.countDocuments({ isPublished: true });
        const unpublishedBlogs = await Blog.countDocuments({ isPublished: false });
        
        // Get total likes and views across all blogs
        const blogStats = await Blog.aggregate([
            {
                $group: {
                    _id: null,
                    totalLikes: { $sum: "$likesCount" },
                    totalViews: { $sum: "$views" },
                    totalShares: { $sum: "$shares" }
                }
            }
        ]);
        
        const stats = blogStats[0] || { totalLikes: 0, totalViews: 0, totalShares: 0 };
        
        // Get recent blogs with their stats
        const recentBlogs = await Blog.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title views likesCount shares createdAt')
            .populate('author', 'name');
        
        res.json({
            success: true,
            stats: {
                totalBlogs,
                publishedBlogs,
                unpublishedBlogs,
                totalLikes: stats.totalLikes,
                totalViews: stats.totalViews,
                totalShares: stats.totalShares,
                recentBlogs
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};