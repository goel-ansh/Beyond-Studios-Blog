import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const About = () => {
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
              About <span className='bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent'>Us</span>
            </h1>
            <p className='text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-instrument'>
              Design agency crafting minimal brand identities that speaks volumes. Elevating your brand with timeless beautiful website designs.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className='py-20 backdrop-blur-sm animate-slideInUp' style={{animationDelay: '0.2s'}}>
          <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid md:grid-cols-2 gap-16 items-center'>
              <div>
                <h2 className='text-4xl font-bold mb-8 text-gray-800 font-fraunces'>
                  Our <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Mission</span>
                </h2>
                <p className='text-lg text-gray-700 mb-6 leading-relaxed font-instrument'>
                  We specialize in crafting minimal brand identities and timeless website designs. 
                  Our mission is to elevate your brand with superior design, innovation, and client satisfaction benchmarks.
                </p>
                <p className='text-lg text-gray-700 leading-relaxed font-instrument'>
                  We provide omni-channel approach with tailored best-fit solutions, industry specific expertise, 
                  and experts with 10+ years of experience to scale your brand to new heights.
                </p>
              </div>
              <div className='relative'>
                <div className='bg-white/20 backdrop-blur-sm rounded-3xl p-8 text-gray-800 shadow-xl hover:scale-105 transition-all duration-300 border border-blue-100/50'>
                  <div className='flex items-center gap-4 mb-6'>
                    <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center'>
                      <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className='text-2xl font-bold text-gray-800'>Innovation First</h3>
                </div>
                <p className='text-gray-700 leading-relaxed font-instrument'>
                  We stay ahead of the curve by embracing emerging technologies and methodologies, 
                  ensuring our solutions are always at the forefront of digital innovation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className='py-20 backdrop-blur-sm animate-slideInUp' style={{animationDelay: '0.4s'}}>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-4 text-gray-800 font-fraunces'>
              Our <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Values</span>
            </h2>
            <p className='text-xl text-gray-700 max-w-3xl mx-auto font-instrument'>
              These core principles guide everything we do and shape the way we work with our clients and partners.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {/* Value 1 */}
            <div className='bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:scale-105 transition-all duration-300 border border-blue-100/50 group'>
              <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                <svg className='w-8 h-8 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className='text-2xl font-bold mb-4 text-gray-800 font-fraunces'>Creative Excellence</h3>
              <p className='text-gray-600 leading-relaxed font-instrument'>
                We pursue perfection in every pixel, every line of code, and every user interaction, 
                ensuring our work stands out in a crowded digital landscape.
              </p>
            </div>

            {/* Value 2 */}
            <div className='bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:scale-105 transition-all duration-300 border border-indigo-100/50 group'>
              <div className='w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                <svg className='w-8 h-8 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className='text-2xl font-bold mb-4 text-gray-800 font-fraunces'>Client Partnership</h3>
              <p className='text-gray-600 leading-relaxed font-instrument'>
                We build lasting relationships based on trust, transparency, and mutual success. 
                Your goals become our goals, and your success is our success.
              </p>
            </div>

            {/* Value 3 */}
            <div className='bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:scale-105 transition-all duration-300 border border-purple-100/50 group'>
              <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                <svg className='w-8 h-8 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className='text-2xl font-bold mb-4 text-gray-800 font-fraunces'>Future-Ready</h3>
              <p className='text-gray-600 leading-relaxed font-instrument'>
                We don't just build for today; we architect solutions that scale and evolve with your business, 
                ensuring long-term value and adaptability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className='py-20 backdrop-blur-sm animate-slideInUp' style={{animationDelay: '0.6s'}}>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-4 text-gray-800 font-fraunces'>
              Meet the <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Team</span>
            </h2>
            <p className='text-xl text-gray-700 max-w-3xl mx-auto font-instrument'>
              Our diverse team of creators, thinkers, and innovators brings together years of experience 
              and a shared passion for digital excellence.
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* Team Member 1 */}
            <div className='text-center group'>
              <div className='relative mb-6'>
                <div className='w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg group-hover:scale-105 transition-transform duration-300 font-fraunces'>
                  SB
                </div>
                <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
                  <svg className='w-4 h-4 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className='text-xl font-bold mb-2 text-gray-800 font-fraunces'>Creative Director</h3>
              <p className='text-gray-600 mb-4 font-instrument'>Leading creative vision and strategic direction</p>
              <div className='flex justify-center gap-3'>
                <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer'>
                  <svg className='w-4 h-4 text-blue-600' fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </div>
                <div className='w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors cursor-pointer'>
                  <svg className='w-4 h-4 text-blue-700' fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className='text-center group'>
              <div className='relative mb-6'>
                <div className='w-32 h-32 mx-auto bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg group-hover:scale-105 transition-transform duration-300 font-fraunces'>
                  TD
                </div>
                <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
                  <svg className='w-4 h-4 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className='text-xl font-bold mb-2 text-gray-800 font-fraunces'>Technical Lead</h3>
              <p className='text-gray-600 mb-4 font-instrument'>Architecting scalable and innovative solutions</p>
              <div className='flex justify-center gap-3'>
                <div className='w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center hover:bg-indigo-200 transition-colors cursor-pointer'>
                  <svg className='w-4 h-4 text-indigo-600' fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </div>
                <div className='w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center hover:bg-indigo-300 transition-colors cursor-pointer'>
                  <svg className='w-4 h-4 text-indigo-700' fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className='text-center group'>
              <div className='relative mb-6'>
                <div className='w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg group-hover:scale-105 transition-transform duration-300 font-fraunces'>
                  UX
                </div>
                <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
                  <svg className='w-4 h-4 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className='text-xl font-bold mb-2 text-gray-800 font-fraunces'>UX Designer</h3>
              <p className='text-gray-600 mb-4 font-instrument'>Crafting intuitive and delightful user experiences</p>
              <div className='flex justify-center gap-3'>
                <div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors cursor-pointer'>
                  <svg className='w-4 h-4 text-purple-600' fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.5 6.5a.5.5 0 00-.5-.5h-2v-2a.5.5 0 00-.5-.5h-2a.5.5 0 00-.5.5v2h-2a.5.5 0 00-.5.5v2a.5.5 0 00.5.5h2v2a.5.5 0 00.5.5h2a.5.5 0 00.5-.5v-2h2a.5.5 0 00.5-.5v-2z"/>
                  </svg>
                </div>
                <div className='w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center hover:bg-purple-300 transition-colors cursor-pointer'>
                  <svg className='w-4 h-4 text-purple-700' fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.521 8.521 0 01-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className='py-20 backdrop-blur-sm animate-slideInUp border-t border-blue-100/50' style={{animationDelay: '0.8s'}}>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-4xl font-bold mb-6 font-fraunces text-gray-800'>
            Ready to Create Something <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Amazing?</span>
          </h2>
          <p className='text-xl text-gray-700 mb-8 leading-relaxed font-instrument'>
            Let's collaborate and bring your vision to life with innovative solutions that make a difference.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 shadow-lg font-instrument'>
              Start a Project
            </button>
            <button className='px-8 py-4 bg-white/20 backdrop-blur-sm text-gray-700 font-bold text-lg rounded-xl hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-gray-200 shadow-lg font-instrument'>
              View Our Work
            </button>
          </div>
        </div>
      </div>

      <div className="animate-slideInUp pt-4" style={{animationDelay: '1.0s'}}>
        <Footer />
      </div>
    </div>
    </div>
  )
}

export default About
