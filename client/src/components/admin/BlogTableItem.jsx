import React from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const BlogTableItem = ({blog, fetchBlogs, index}) => {

    const {title, createdAt, category, author} = blog;
    const BlogDate = new Date(createdAt)

    const { axios, navigate } = useAppContext();

    const deleteBlog = async ()=>{
      const confirm = window.confirm('Are you sure you want to delete this blog?')
      if(!confirm) return;
      try {
        const { data } = await axios.post('/api/blog/delete', {id: blog._id})
        if (data.success){
          toast.success(data.message)
          await fetchBlogs()
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

     const togglePublish = async () =>{
      try {
        const { data } = await axios.post('/api/blog/toggle-publish', {id: blog._id})
        if (data.success){
            toast.success(data.message)
            await fetchBlogs()
          }else{
            toast.error(data.message)
          }
      } catch (error) {
        toast.error(error.message)
      }
      
     }

  return (
    <tr className='hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all duration-200'>
      {/* Index */}
      <td className='px-4 py-4 whitespace-nowrap'>
        <div className='w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center'>
          <span className='text-sm font-semibold text-orange-700'>{index}</span>
        </div>
      </td>
      
      {/* Blog Details */}
      <td className='px-4 py-4'>
        <div className='space-y-2'>
          <div className='font-semibold text-gray-900 text-base leading-tight line-clamp-2'>{title}</div>
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{author?.name || 'Unknown'}</span>
          </div>
          {blog.tags && blog.tags.length > 0 && (
            <div className='flex flex-wrap gap-1'>
              {blog.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className='inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700'>
                  {tag}
                </span>
              ))}
              {blog.tags.length > 3 && (
                <span className='text-xs text-gray-500 px-2 py-1'>+{blog.tags.length - 3} more</span>
              )}
            </div>
          )}
        </div>
      </td>
      
      {/* Category */}
      <td className='px-4 py-4 whitespace-nowrap hidden md:table-cell'>
        <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'>
          {category}
        </span>
      </td>
      
      {/* Date */}
      <td className='px-4 py-4 whitespace-nowrap hidden lg:table-cell'>
        <div className='text-sm text-gray-600'>
          {BlogDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
      </td>
      
      {/* Performance Stats */}
      <td className='px-4 py-4 whitespace-nowrap hidden lg:table-cell'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-sm'>
            <svg className='w-4 h-4 text-blue-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className='text-gray-700 font-medium'>{blog.views || 0}</span>
          </div>
          <div className='flex items-center gap-4 text-xs text-gray-500'>
            <div className='flex items-center gap-1'>
              <svg className='w-3 h-3 text-red-400' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{blog.likesCount || 0}</span>
            </div>
            <div className='flex items-center gap-1'>
              <svg className='w-3 h-3 text-green-400' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span>{blog.shares || 0}</span>
            </div>
          </div>
        </div>
      </td>
      
      {/* Status */}
      <td className='px-4 py-4 whitespace-nowrap'>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          blog.isPublished 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            blog.isPublished ? 'bg-green-500' : 'bg-yellow-500'
          }`}></div>
          {blog.isPublished ? 'Published' : 'Draft'}
        </span>
      </td>
      
      {/* Actions */}
      <td className='px-4 py-4 whitespace-nowrap'>
        <div className='flex items-center gap-2'>
          <button 
            onClick={() => navigate(`/admin/edit-blog/${blog._id}`)}
            className='inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-orange-700 bg-orange-100 hover:bg-orange-200 transition-colors'
          >
            <svg className='w-3 h-3 mr-1' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button 
            onClick={togglePublish} 
            className={`inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              blog.isPublished 
                ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200' 
                : 'text-green-700 bg-green-100 hover:bg-green-200'
            }`}
          >
            {blog.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button 
            onClick={deleteBlog}
            className='inline-flex items-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'
            title="Delete blog"
          >
            <img src={assets.cross_icon} className='w-4 h-4' alt="Delete" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default BlogTableItem
