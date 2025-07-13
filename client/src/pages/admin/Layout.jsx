import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar'
import { useAppContext } from '../../context/AppContext'
import logoImage from '../../assets/logo.fcb9b7b3.png'

const Layout = () => {

    const {axios, setToken, setUser, user, navigate} = useAppContext()

    const logout = ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        axios.defaults.headers.common['Authorization'] = null;
        setToken(null)
        setUser(null)
        navigate('/')
    }

  return (
    <>
      <div className='flex items-center justify-between py-6 h-[100px] px-4 sm:px-12 border-b border-orange-800/50 bg-gradient-to-r from-gray-800 via-gray-800 to-orange-800 shadow-xl'>
        <div 
          className='cursor-pointer' 
          onClick={()=> navigate('/')}
        >
          {/* Clean Logo - No Container */}
          <img 
            src={logoImage} 
            alt="Logo" 
            className='w-32 h-32 object-contain hover:scale-110 transition-all duration-300'
          />
        </div>
        <div className='flex items-center gap-6'>
          {user && (
            <div className='text-right'>
              <p className='text-lg font-bold text-white font-fraunces'>{user.name}</p>
              <p className='text-sm text-orange-200 capitalize font-fraunces'>{user.role}</p>
            </div>
          )}
          <button 
            onClick={logout} 
            className='text-base px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl cursor-pointer hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg font-bold font-fraunces transform hover:scale-105 flex items-center gap-2'
          >
            <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
      <div className='flex h-[calc(100vh-100px)]'>
            <Sidebar />
            <Outlet />
      </div>
    </>
  )
}

export default Layout
