import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import BlogList from '../components/BlogList'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

const StepTestHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-600 to-orange-700">
      <div className="animate-fadeIn">
        <Navbar/>
        <div className="animate-slideInUp">
          <Header/>
        </div>
        <div className="animate-slideInUp">
          <BlogList/>
        </div>
        <div className="animate-slideInUp">
          <Newsletter/>
        </div>
        <div className="animate-slideInUp">
          <Footer/>
        </div>
        <div className="flex items-center justify-center min-h-40">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Testing Home with ALL Components</h1>
            <p className="text-gray-300">Step 5: If you see this, ALL components are working! 🎉</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StepTestHome
