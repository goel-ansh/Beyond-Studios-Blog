import React, { useEffect, useState, useCallback } from 'react'
import BlogTableItem from '../../components/admin/BlogTableItem';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ListBlog = () => {

 const [blogs, setBlogs] = useState([]);
 const {axios} = useAppContext()

 const fetchBlogs = useCallback(async () =>{
    try {
        const {data} = await axios.get('/api/admin/blogs')
        if(data.success){
            setBlogs(data.blogs)
        }else{
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.message)
    }
 }, [axios])

 useEffect(()=>{
    fetchBlogs()
 },[fetchBlogs])

  return (
    <div className='flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen'>
        <div className='p-4 md:p-6 lg:p-8'>
            {/* Header Section */}
            <div className='bg-white rounded-2xl shadow-elegant border border-gray-200 mb-6 overflow-hidden'>
                <div className='bg-gradient-to-r from-orange-600 to-orange-700 p-6 text-white'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center'>
                            <svg className='w-6 h-6' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className='text-2xl md:text-3xl font-bold mb-1'>All Blog Posts</h1>
                            <p className='text-orange-100'>Manage and organize your blog content</p>
                        </div>
                    </div>
                    <div className='mt-4 flex items-center justify-between'>
                        <div className='text-sm text-orange-100'>
                            Total: <span className='font-semibold text-white'>{blogs.length}</span> posts
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog List */}
            <div className='bg-white rounded-2xl shadow-elegant border border-gray-200 overflow-hidden'>
                {blogs.length === 0 ? (
                    <div className='text-center py-16'>
                        <div className='w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center'>
                            <svg className='w-8 h-8 text-gray-400' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>No blogs found</h3>
                        <p className='text-gray-500 mb-6'>Start by creating your first blog post.</p>
                        <button 
                            onClick={() => window.location.href = '/admin/addBlog'}
                            className='bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-colors'
                        >
                            Create First Blog
                        </button>
                    </div>
                ) : (
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead className='bg-gradient-to-r from-gray-50 to-orange-50 border-b border-orange-200'>
                                <tr>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[60px]'>#</th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[300px]'>Blog Details</th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell min-w-[120px]'>Category</th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell min-w-[100px]'>Date</th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell min-w-[120px]'>Performance</th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]'>Status</th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[160px]'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-100'>
                                {blogs.map((blog, index)=>{
                                    return <BlogTableItem key={blog._id} blog={blog} fetchBlogs={fetchBlogs} index={index + 1}/>
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default ListBlog
