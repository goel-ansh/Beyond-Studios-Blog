import React from 'react'
import { useNavigate } from 'react-router-dom';
import Moment from 'moment';

const BlogCard = ({blog}) => {

    const {title, description, category, image, _id, createdAt, author} = blog;
    const navigate = useNavigate()

    // Function to extract plain text from HTML
    const getPlainText = (html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || "";
    }

    // Calculate reading time (average 200 words per minute)
    const calculateReadingTime = (text) => {
      const words = text.split(' ').length;
      const minutes = Math.ceil(words / 200);
      return minutes;
    }

    const plainText = getPlainText(description);
    const readingTime = calculateReadingTime(plainText);

  return (
    <article 
      onClick={()=> navigate(`/blog/${_id}`)} 
      className='group bg-white rounded-lg overflow-hidden border border-gray-300 hover:border-gray-400 hover:shadow-xl hover:shadow-gray-400/15 transition-all duration-500 cursor-pointer hover:-translate-y-1 transform shadow-md'
    >
      {/* Image - More rectangular aspect ratio */}
      <div className='aspect-[5/3] overflow-hidden bg-gray-100 relative'>
        <img 
          src={image} 
          alt={title}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
        
        {/* Category badge */}
        <div className='absolute top-4 left-4'>
          <span className='px-3 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 rounded-full border border-gray-200/50 shadow-sm'>
            {category}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className='p-6'>
        {/* Title */}
        <h3 className='text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight'>
          {title}
        </h3>
        
        {/* Description */}
        <p className='text-gray-600 text-sm line-clamp-3 leading-relaxed mb-6'>
          {plainText.slice(0, 180)}...
        </p>
        
        {/* Author and Meta Information */}
        <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
          {/* Author Info */}
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0'>
              <span className='text-white font-medium text-sm'>
                {author?.name ? author.name.charAt(0).toUpperCase() : 'BS'}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-900'>
                {author?.name || 'Beyond Studios'}
              </span>
              <div className='flex items-center gap-2 text-xs text-gray-500'>
                <span>{Moment(createdAt).format('MMM DD, YYYY')}</span>
                <span>•</span>
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className='flex items-center gap-4 text-xs text-gray-400'>
            {/* Views */}
            <div className='flex items-center gap-1 hover:text-blue-500 transition-colors'>
              <svg className='w-3 h-3' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{blog.views || 0}</span>
            </div>
            
            {/* Likes */}
            <div className='flex items-center gap-1 hover:text-red-500 transition-colors'>
              <svg className='w-3 h-3' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{blog.likesCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogCard
