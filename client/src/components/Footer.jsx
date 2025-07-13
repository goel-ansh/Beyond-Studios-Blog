import React from 'react'
import { footer_data } from '../assets/assets'
import logoImage from '../assets/logo.fcb9b7b3.png'

const Footer = () => {
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-br from-gray-700 via-slate-700 to-blue-800/90 relative overflow-hidden'>
      {/* Subtle background pattern matching the page theme */}
      <div className="absolute inset-0">
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.08)_1px,transparent_0)] [background-size:24px_24px]"></div>
        
        {/* Geometric overlay for depth */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-56 h-56 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className='flex flex-col md:flex-row items-start justify-between gap-10 py-12 border-b border-gray-600/50 text-white relative z-10'>

        <div>
        <div className='mb-6'>
          {/* Logo with enhanced styling */}
          <img 
            src={logoImage} 
            alt="Logo" 
            className='w-28 h-28 object-contain filter brightness-110 contrast-125 hover:scale-105 transition-transform duration-300'
          />
        </div>
        <p className='max-w-[410px] text-gray-200 leading-relaxed text-base'>
          Crafting minimal brand identities and timeless website designs that speak volumes. 
          We elevate your brand with superior design, innovation, and creative excellence.
        </p>
        </div>

        <div className='flex flex-wrap justify-between w-full md:w-[45%] gap-6'>
            {footer_data.map((section, index)=> (
                <div key={index}>
                    <h3 className='font-semibold text-lg text-white mb-4 relative'>
                      {section.title}
                      <div className='absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full'></div>
                    </h3>
                    <ul className='text-sm space-y-2'>
                        {section.links.map((link, i)=> (
                            <li key={i}>
                                <a href="#" className='text-gray-300 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 inline-block relative group'>
                                  {link}
                                  <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-200 group-hover:w-full'></span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>

      </div>
      
      <div className='py-6 text-center relative z-10'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-sm md:text-base text-gray-300'>
            Copyright 2025 © Beyond Studios. All Rights Reserved.
          </p>
          <div className='flex items-center gap-4'>
            <span className='text-xs text-gray-400'>Made with</span>
            <div className='flex items-center gap-1'>
              <svg className='w-4 h-4 text-red-400 animate-pulse' fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span className='text-xs text-gray-400'>and</span>
              <span className='text-xs bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium'>passion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
