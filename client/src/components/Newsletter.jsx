import React, { useState } from 'react'
import axios from 'axios'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await axios.post('/api/email/subscribe', { email })
      if (response.data.success) {
        setSuccess('Subscription successful! Please check your email.')
        setEmail('')
      } else {
        setError(response.data.message || 'An error occurred')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mx-4 sm:mx-8 lg:mx-16 xl:mx-24 my-16'>
      <div className='bg-gradient-to-br from-gray-200 via-slate-200 to-blue-200/80 border border-blue-100/50 rounded-2xl p-8 md:p-10 text-center relative overflow-hidden shadow-xl backdrop-blur-sm'>
        
        {/* Background Pattern - Same as other pages */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.15)_1px,transparent_0)] [background-size:32px_32px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.12)_1px,transparent_0)] [background-size:16px_16px] translate-x-4 translate-y-4"></div>
        
        {/* Geometric blur overlays */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-10 w-28 h-28 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl"></div>
        </div>

        {/* Background decorations */}
        <div className='absolute top-0 left-0 w-full h-full'>
          <div className='absolute top-6 left-6 w-12 h-12 bg-blue-500/30 rounded-full animate-float'></div>
          <div className='absolute bottom-6 right-6 w-10 h-10 bg-purple-500/30 rounded-full animate-float' style={{animationDelay: '1s'}}></div>
          <div className='absolute top-1/2 left-1/4 w-8 h-8 bg-indigo-500/30 rounded-full animate-float' style={{animationDelay: '2s'}}></div>
        </div>

        <div className='relative z-10 max-w-2xl mx-auto'>
          {/* Icon */}
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-6 shadow-lg'>
            <svg className='w-8 h-8 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Heading */}
          <h2 className='text-2xl md:text-3xl font-bold mb-3 leading-tight text-gray-800'>
            Ready to scale your brand to <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'>new heights?</span>
          </h2>
          
          {/* Subtitle */}
          <p className='text-lg text-gray-700 mb-6 leading-relaxed'>
            Subscribe to get design insights, industry trends, and creative excellence tips delivered to your inbox.
          </p>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto'>
            <div className='flex-1 w-full sm:w-auto'>
              <input
                className='w-full px-4 py-3 text-gray-800 bg-white/20 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-600 shadow-sm backdrop-blur-sm'
                type="email"
                placeholder='Enter your email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50'
            >
              <span>{loading ? 'Subscribing...' : 'Subscribe'}</span>
              <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>

          {error && <p className="text-red-500 mt-4">{error}</p>}
          {success && <p className="text-green-500 mt-4">{success}</p>}

          {/* Trust indicators - Made smaller and more transparent */}
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mt-6'>
            <div className='flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg border border-gray-200/50 shadow-sm backdrop-blur-sm'>
              <svg className='w-4 h-4 text-green-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className='text-sm font-semibold text-gray-700'>No spam, unsubscribe anytime</span>
            </div>
            <div className='flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg border border-gray-200/50 shadow-sm backdrop-blur-sm'>
              <svg className='w-4 h-4 text-orange-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className='text-sm font-semibold text-gray-700'>Join 1,000+ readers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Newsletter
