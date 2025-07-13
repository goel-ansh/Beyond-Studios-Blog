import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await axios.post('/api/email/contact', formData)
      if (response.data.success) {
        setSuccess('Message sent successfully!')
        setFormData({ name: '', email: '', subject: '', message: '' })
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
        <Navbar />
        
        {/* Hero Section */}
        <div className='relative bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20 backdrop-blur-sm py-20 overflow-hidden animate-slideInUp border-b border-white/10'>
          <div className='absolute top-0 left-0 w-full h-full'>
            <div className='absolute top-20 left-10 w-32 h-32 bg-blue-500/30 rounded-full animate-float'></div>
            <div className='absolute bottom-20 right-10 w-24 h-24 bg-purple-500/30 rounded-full animate-float' style={{animationDelay: '1s'}}></div>
            <div className='absolute top-1/2 left-1/3 w-16 h-16 bg-indigo-500/30 rounded-full animate-float' style={{animationDelay: '2s'}}></div>
          </div>
          
          <div className='relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
            <h1 className='text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-800 font-fraunces animate-text-glow'>
              Ready to scale your brand to <span className='bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent'>new heights?</span>
            </h1>
            <p className='text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-instrument'>
              Let's discuss your project and craft a minimal brand identity that speaks volumes. Get in touch for a consultation.
            </p>
          </div>
        </div>

        {/* Contact Form & Info Section */}
        <div className='py-20 backdrop-blur-sm animate-slideInUp' style={{animationDelay: '0.2s'}}>
          <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid lg:grid-cols-2 gap-16'>
              
              {/* Contact Form */}
              <div>
                <h2 className='text-3xl font-bold mb-8 text-gray-800 font-fraunces'>
                  Send us a <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Message</span>
                </h2>
                
                <form onSubmit={handleSubmit} className='space-y-6'>
                  {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}
                  {success && <p className="text-green-500 bg-green-100 p-3 rounded-lg">{success}</p>}
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div>
                      <label htmlFor="name" className='block text-sm font-semibold text-gray-700 mb-2'>
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400/20 focus:border-blue-400 transition-all outline-none bg-white/20 backdrop-blur-sm text-gray-800 placeholder-gray-600'
                        placeholder='Your full name'
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className='block text-sm font-semibold text-gray-700 mb-2'>
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400/20 focus:border-blue-400 transition-all outline-none bg-white/20 backdrop-blur-sm text-gray-800 placeholder-gray-600'
                        placeholder='your.email@example.com'
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className='block text-sm font-semibold text-gray-700 mb-2'>
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400/20 focus:border-blue-400 transition-all outline-none bg-white/20 backdrop-blur-sm text-gray-800 placeholder-gray-600'
                      placeholder='How can we help you?'
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className='block text-sm font-semibold text-gray-700 mb-2'>
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400/20 focus:border-blue-400 transition-all outline-none resize-none bg-white/20 backdrop-blur-sm text-gray-800 placeholder-gray-600'
                      placeholder='Tell us about your project, ideas, or any questions you have...'
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-instrument disabled:opacity-50'
                  >
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                    <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className='text-3xl font-bold mb-8 text-gray-800 font-fraunces'>
                  Let's <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Connect</span>
                </h2>
                
                <div className='space-y-8'>
                  {/* Contact Card 1 */}
                  <div className='bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/50 shadow-lg hover:scale-105 transition-all duration-300'>
                    <div className='flex items-start gap-4'>
                      <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0'>
                        <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className='text-xl font-bold text-gray-800 mb-2 font-fraunces'>Email Us</h3>
                        <p className='text-gray-600 mb-2 font-instrument'>Get in touch via email for project inquiries</p>
                        <a href="mailto:hello@example.com" className='text-blue-600 font-semibold hover:text-blue-700 transition-colors font-instrument'>
                          hello@example.com
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Contact Card 2 */}
                  <div className='bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100/50 shadow-lg hover:scale-105 transition-all duration-300'>
                    <div className='flex items-start gap-4'>
                      <div className='w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0'>
                        <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className='text-xl font-bold text-gray-800 mb-2 font-fraunces'>Call Us</h3>
                        <p className='text-gray-600 mb-2 font-instrument'>Speak directly with our team</p>
                        <a href="tel:+1234567890" className='text-indigo-600 font-semibold hover:text-indigo-700 transition-colors font-instrument'>
                          +1 (234) 567-8900
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Contact Card 3 */}
                  <div className='bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-100/50 shadow-lg hover:scale-105 transition-all duration-300'>
                    <div className='flex items-start gap-4'>
                      <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0'>
                        <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className='text-xl font-bold text-gray-800 mb-2 font-fraunces'>Visit Us</h3>
                        <p className='text-gray-600 mb-2 font-instrument'>Come to our studio for a coffee chat</p>
                        <p className='text-purple-600 font-semibold font-instrument'>
                          123 Creative Street<br />
                          Innovation District<br />
                          Tech City, TC 12345
                        </p>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Social Links */}
              <div className='mt-12'>
                <h3 className='text-xl font-bold text-gray-800 mb-6 font-fraunces'>Follow Us</h3>
                <div className='flex gap-4'>
                  <a href="#" className='w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white hover:bg-blue-600 hover:scale-110 transition-all duration-300'>
                    <svg className='w-5 h-5' fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className='w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white hover:bg-indigo-600 hover:scale-110 transition-all duration-300'>
                    <svg className='w-5 h-5' fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className='w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white hover:bg-purple-600 hover:scale-110 transition-all duration-300'>
                    <svg className='w-5 h-5' fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.748.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.726-1.378l-.737 2.83c-.266 1.026-1.02 2.31-1.518 3.089 1.143.35 2.33.535 3.585.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </a>
                  <a href="#" className='w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center text-white hover:bg-gray-700 hover:scale-110 transition-all duration-300'>
                    <svg className='w-5 h-5' fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className='py-20 backdrop-blur-sm animate-slideInUp' style={{animationDelay: '0.4s'}}>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-4 text-gray-800 font-fraunces'>
              Frequently Asked <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Questions</span>
            </h2>
            <p className='text-xl text-gray-700 font-instrument'>
              Get quick answers to common questions about our services and process.
            </p>
          </div>

          <div className='space-y-6'>
            {/* FAQ Item 1 */}
            <div className='bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100/50 hover:scale-105 transition-all duration-300'>
              <h3 className='text-xl font-bold text-gray-800 mb-3 font-fraunces'>
                What services do we offer?
              </h3>
              <p className='text-gray-600 leading-relaxed font-instrument'>
                We specialize in web development, mobile app development, UI/UX design, brand identity, 
                digital marketing, and custom software solutions. Our team combines creativity with 
                technical expertise to deliver comprehensive digital experiences.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className='bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-indigo-100/50 hover:scale-105 transition-all duration-300'>
              <h3 className='text-xl font-bold text-gray-800 mb-3 font-fraunces'>
                How long does a typical project take?
              </h3>
              <p className='text-gray-600 leading-relaxed font-instrument'>
                Project timelines vary based on scope and complexity. A simple website might take 2-4 weeks, 
                while complex applications can take 3-6 months. We provide detailed timelines during our 
                initial consultation and keep you updated throughout the process.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className='bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100/50 hover:scale-105 transition-all duration-300'>
              <h3 className='text-xl font-bold text-gray-800 mb-3 font-fraunces'>
                Do you provide ongoing support and maintenance?
              </h3>
              <p className='text-gray-600 leading-relaxed font-instrument'>
                Yes! We offer comprehensive support and maintenance packages to ensure your digital 
                assets stay secure, updated, and performing optimally. Our support includes regular 
                updates, security monitoring, and technical assistance.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className='bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-cyan-100/50 hover:scale-105 transition-all duration-300'>
              <h3 className='text-xl font-bold text-gray-800 mb-3 font-fraunces'>
                What's your development process like?
              </h3>
              <p className='text-gray-600 leading-relaxed font-instrument'>
                We follow an agile approach with clear phases: Discovery & Planning, Design & Prototyping, 
                Development, Testing, and Launch. We maintain transparent communication throughout and 
                provide regular updates and demos to ensure we're aligned with your vision.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="animate-slideInUp pt-4" style={{animationDelay: '0.6s'}}>
        <Footer />
      </div>
    </div>
    </div>
  )
}

export default Contact
