import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import BlogList from '../components/BlogList'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-slate-200 to-blue-200/80 relative overflow-hidden">
      {/* Enhanced multi-layered background pattern covering entire page */}
      <div className="absolute inset-0">
        {/* Primary dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.15)_1px,transparent_0)] [background-size:32px_32px]"></div>
        
        {/* Secondary smaller dots */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.12)_1px,transparent_0)] [background-size:16px_16px] translate-x-4 translate-y-4"></div>
        
        {/* Enhanced geometric overlays spread across entire page */}
        <div className="absolute inset-0 opacity-[0.06]">
          {/* Top section gradients */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full blur-3xl"></div>
          
          {/* Middle section gradients */}
          <div className="absolute top-96 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl"></div>
          <div className="absolute top-96 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-3xl"></div>
          
          {/* Bottom section gradients */}
          <div className="absolute bottom-40 left-40 w-88 h-88 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-32 w-76 h-76 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-3xl"></div>
        </div>
      </div>
      
      <div className="animate-fadeIn relative z-10 backdrop-blur-[0.5px]">
        <Navbar/>
        <div className="animate-slideInUp">
          <Header/>
        </div>
        <div className="animate-slideInUp -mt-8" style={{animationDelay: '0.2s'}}>
          <BlogList />
        </div>
        <div className="animate-slideInUp py-6" style={{animationDelay: '0.4s'}}>
          <Newsletter />
        </div>
        <div className="animate-slideInUp pt-4" style={{animationDelay: '0.6s'}}>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default Home
