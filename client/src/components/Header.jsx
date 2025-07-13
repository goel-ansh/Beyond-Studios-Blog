import React, { useRef } from 'react'
import { useAppContext } from '../context/AppContext'

const Header = () => {
  const {setInput, input} = useAppContext()
  const inputRef = useRef()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setInput(inputRef.current.value)
  }

  const onClear = () => {
    setInput('')
    inputRef.current.value = ''
  }

  return (
    <div className='mx-4 sm:mx-8 lg:mx-16 xl:mx-24 py-12 lg:py-16 relative'>
      <div className='text-center max-w-4xl mx-auto relative z-10'>
        
        {/* Main Heading */}
        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight'>
          <span className='block'>Design insights, creative</span>
          <span className='block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            excellence unleashed
          </span>
        </h1>

        {/* Subtitle */}
        <p className='text-base sm:text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed'>
          Discover the art of digital transformation. From web design to brand identity, 
          explore insights, case studies, and creative processes that elevate brands to new heights.
        </p>

        {/* Search Bar */}
        <div className='max-w-2xl mx-auto'>
          <form onSubmit={onSubmitHandler} className='relative group'>
            <div className='absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none'>
              <svg className='h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search articles, topics, or authors..."
              className='w-full pl-16 pr-32 py-4 text-base border-2 border-gray-200 rounded-2xl outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all duration-300 bg-white/90 text-gray-900 placeholder-gray-500 shadow-lg hover:shadow-xl group-focus-within:shadow-xl backdrop-blur-sm'
            />
            <div className='absolute inset-y-0 right-0 flex items-center gap-3 pr-4'>
              {input && (
                <button 
                  type="button"
                  onClick={onClear}
                  className='text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100'
                >
                  <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                className='px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105'
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Header
