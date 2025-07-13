import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import logoImage from '../assets/logo.fcb9b7b3.png'

const Navbar = () => {
  const {navigate, user} = useAppContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  return (
    <nav className='sticky top-0 z-50 bg-gradient-to-r from-gray-800 via-gray-900 to-slate-800 backdrop-blur-md border-b border-gray-700/50 shadow-xl'>
      {/* Subtle background overlay for depth */}
      <div className='absolute inset-0 bg-gradient-to-r from-blue-900/20 via-gray-800/30 to-purple-900/20'></div>
      
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-20'>
          
          {/* Logo - Shifted left and smaller */}
          <div 
            onClick={() => navigate('/')} 
            className='cursor-pointer -ml-24'
          >
            <img 
              src={logoImage} 
              alt="Logo" 
              className='w-32 h-32 object-contain hover:scale-110 transition-all duration-300 filter brightness-100 contrast-125'
            />
          </div>
          
          {/* Desktop Navigation with reduced height */}
          <div className='hidden md:flex items-center gap-6'>
            <div className='flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/20'>
              <button 
                onClick={() => navigate('/')}
                className='px-4 py-2 text-white hover:text-blue-300 transition-all duration-200 font-medium rounded-lg hover:bg-white/10 hover:shadow-sm relative group text-sm'
              >
                Home
                <span className='absolute bottom-0.5 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-200 group-hover:w-3/4 group-hover:left-1/8 rounded-full'></span>
              </button>
              <button 
                onClick={() => navigate('/about')}
                className='px-4 py-2 text-white hover:text-blue-300 transition-all duration-200 font-medium rounded-lg hover:bg-white/10 hover:shadow-sm relative group text-sm'
              >
                About
                <span className='absolute bottom-0.5 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-200 group-hover:w-3/4 group-hover:left-1/8 rounded-full'></span>
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className='px-4 py-2 text-white hover:text-blue-300 transition-all duration-200 font-medium rounded-lg hover:bg-white/10 hover:shadow-sm relative group text-sm'
              >
                Contact
                <span className='absolute bottom-0.5 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-200 group-hover:w-3/4 group-hover:left-1/8 rounded-full'></span>
              </button>
              <button 
                onClick={() => navigate(user ? '/admin' : '/admin')}
                className='px-4 py-2 text-white hover:text-blue-300 transition-all duration-200 font-medium rounded-lg hover:bg-white/10 hover:shadow-sm relative group text-sm'
              >
                {user ? 'Dashboard' : 'Get Started'}
                <span className='absolute bottom-0.5 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-200 group-hover:w-3/4 group-hover:left-1/8 rounded-full'></span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 group'
          >
            <svg className={`w-5 h-5 transition-all duration-300 ${isMenuOpen ? 'rotate-45 text-blue-300' : 'text-white group-hover:text-blue-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu with Dark Theme */}
        {isMenuOpen && (
          <div className='md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-gray-800/95 via-gray-900/95 to-slate-800/95 backdrop-blur-2xl border-b border-gray-600/50 shadow-2xl animate-slideInUp'>
            <div className='p-4 space-y-2'>
              <button 
                onClick={() => {navigate('/'); setIsMenuOpen(false)}}
                className='block w-full text-left px-4 py-3 text-white hover:text-blue-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-blue-500/20 rounded-xl transition-all duration-300 font-medium hover:shadow-sm group text-sm'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'></div>
                  Home
                </div>
              </button>
              <button 
                onClick={() => {navigate('/about'); setIsMenuOpen(false)}}
                className='block w-full text-left px-4 py-3 text-white hover:text-blue-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-blue-500/20 rounded-xl transition-all duration-300 font-medium hover:shadow-sm group text-sm'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'></div>
                  About
                </div>
              </button>
              <button 
                onClick={() => {navigate('/contact'); setIsMenuOpen(false)}}
                className='block w-full text-left px-4 py-3 text-white hover:text-blue-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-blue-500/20 rounded-xl transition-all duration-300 font-medium hover:shadow-sm group text-sm'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'></div>
                  Contact
                </div>
              </button>
              <button 
                onClick={() => {navigate(user ? '/admin' : '/admin'); setIsMenuOpen(false)}}
                className='block w-full text-left px-4 py-3 text-white hover:text-blue-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-blue-500/20 rounded-xl transition-all duration-300 font-medium hover:shadow-sm group text-sm'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'></div>
                  {user ? 'Dashboard' : 'Get Started'}
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
