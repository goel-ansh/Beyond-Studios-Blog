import React, { useState } from 'react'
import { blogCategories } from '../assets/assets'
import BlogCard from './BlogCard'
import { useAppContext } from '../context/AppContext'

const BlogList = () => {

    const [menu, setMenu] = useState("All")
    const {blogs, input} = useAppContext()

    const filteredBlogs = ()=>{
      if(input === ''){
        return blogs
      }
      return blogs.filter((blog)=> blog.title.toLowerCase().includes(input.toLowerCase()) || blog.category.toLowerCase().includes(input.toLowerCase()))
    }
  return (
    <div className='max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-8'>
      {/* Category Filters with reduced spacing - transparent background to show page gradient */}
      <div className='flex flex-wrap justify-center gap-2 mb-12'>
        {blogCategories.map((item)=> (
          <button 
            key={item}
            onClick={()=> setMenu(item)}
            className={`px-4 py-2 rounded-lg border transition-all duration-300 font-medium relative overflow-hidden group text-sm ${
              menu === item 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-400/25 scale-105' 
                : 'bg-white/70 backdrop-blur-sm text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50/80 hover:text-blue-600 hover:shadow-md hover:shadow-blue-400/10 hover:scale-105'
            }`}
          >
            {/* Shimmer effect for active button */}
            {menu === item && (
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
            )}
            <span className='relative z-10'>{item}</span>
          </button>
        ))}
      </div>

      {/* Blog Grid - Expanded horizontal spacing */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16'>
        {filteredBlogs().filter((blog)=> menu === "All" ? true : blog.category === menu).map((blog)=> 
          <BlogCard key={blog._id} blog={blog}/>
        )}
      </div>

      {/* Empty State */}
      {filteredBlogs().filter((blog)=> menu === "All" ? true : blog.category === menu).length === 0 && (
        <div className='text-center py-16'>
          <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center border border-blue-200/50'>
            <svg className='w-12 h-12 text-blue-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>No articles found</h3>
          <p className='text-gray-600'>Try adjusting your search or browse other categories.</p>
        </div>
      )}
    </div>
  )
}

export default BlogList
