import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'

const Sidebar = () => {
  const { user, navigate } = useAppContext()
  
  return (
    <div className='flex flex-col border-r border-orange-200 min-h-full pt-6 bg-gradient-to-b from-gray-50 via-orange-50 to-orange-100'>

      <NavLink end={true} to='/admin' className={({isActive})=> `flex items-center gap-3 py-4 px-3 md:px-9 md:min-w-64 cursor-pointer transition-all duration-200 hover:bg-orange-50 ${isActive && "bg-gradient-to-r from-orange-50 to-orange-100 border-r-4 border-orange-600 text-orange-700 font-semibold"}`}>
        <img src={assets.home_icon} alt="" className='min-w-4 w-6 '/>
        <p className='hidden md:inline-block text-base font-fraunces'>Dashboard</p>
      </NavLink>

      {/* Browse Articles for all users */}
      <div 
        onClick={() => navigate('/')}
        className='flex items-center gap-3 py-4 px-3 md:px-9 md:min-w-64 cursor-pointer transition-all duration-200 hover:bg-orange-50 text-gray-700 hover:text-orange-700'
      >
        <svg className='min-w-4 w-6' fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <p className='hidden md:inline-block text-base font-fraunces'>Browse Articles</p>
      </div>

      {(user?.role === 'admin' || user?.role === 'editor') && (
        <NavLink to='/admin/addBlog' className={({isActive})=> `flex items-center gap-3 py-4 px-3 md:px-9 md:min-w-64 cursor-pointer transition-all duration-200 hover:bg-orange-50 ${isActive && "bg-gradient-to-r from-orange-50 to-orange-100 border-r-4 border-orange-600 text-orange-700 font-semibold"}`}>
          <img src={assets.add_icon} alt="" className='min-w-4 w-6 '/>
          <p className='hidden md:inline-block text-base font-fraunces'>Add blogs</p>
        </NavLink>
      )}

      {(user?.role === 'admin' || user?.role === 'editor') && (
        <NavLink to='/admin/listBlog' className={({isActive})=> `flex items-center gap-3 py-4 px-3 md:px-9 md:min-w-64 cursor-pointer transition-all duration-200 hover:bg-orange-50 ${isActive && "bg-gradient-to-r from-orange-50 to-orange-100 border-r-4 border-orange-600 text-orange-700 font-semibold"}`}>
          <img src={assets.list_icon} alt="" className='min-w-4 w-6 '/>
          <p className='hidden md:inline-block text-base font-fraunces'>Blog lists</p>
        </NavLink>
      )}

      {(user?.role === 'admin' || user?.role === 'editor') && (
        <NavLink to='/admin/comments' className={({isActive})=> `flex items-center gap-3 py-4 px-3 md:px-9 md:min-w-64 cursor-pointer transition-all duration-200 hover:bg-orange-50 ${isActive && "bg-gradient-to-r from-orange-50 to-orange-100 border-r-4 border-orange-600 text-orange-700 font-semibold"}`}>
          <img src={assets.comment_icon} alt="" className='min-w-4 w-6 '/>
          <p className='hidden md:inline-block text-base font-fraunces'>Comments</p>
        </NavLink>
      )}

      {user?.role === 'admin' && (
        <NavLink to='/admin/users' className={({isActive})=> `flex items-center gap-3 py-4 px-3 md:px-9 md:min-w-64 cursor-pointer transition-all duration-200 hover:bg-orange-50 ${isActive && "bg-gradient-to-r from-orange-50 to-orange-100 border-r-4 border-orange-600 text-orange-700 font-semibold"}`}>
          <img src={assets.user_icon} alt="" className='min-w-4 w-6 '/>
          <p className='hidden md:inline-block text-base font-fraunces'>Manage Users</p>
        </NavLink>
      )}

      {/* Role Indicator */}
      <div className='mt-auto p-6 border-t border-orange-200 bg-gradient-to-r from-orange-100 to-orange-200'>
        <div className='text-center'>
          <p className='text-sm text-gray-600 mb-1 font-fraunces'>Logged in as</p>
          <p className='text-base font-bold text-orange-800 capitalize font-fraunces'>{user?.role}</p>
        </div>
      </div>

    </div>
  )
}

export default Sidebar
