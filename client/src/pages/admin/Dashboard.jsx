import React, { useEffect, useState, useCallback } from 'react'
import { assets } from '../../assets/assets'
import BlogTableItem from '../../components/admin/BlogTableItem'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Dashboard = () => {

    const [dashboardData, setDashboardData] = useState({
        blogs: 0,
        comments: 0,
        drafts: 0,
        recentBlogs: []
    })

    const [blogStats, setBlogStats] = useState({
        totalLikes: 0,
        totalViews: 0,
        totalShares: 0,
        publishedBlogs: 0,
        unpublishedBlogs: 0,
        totalBlogs: 0,
        recentBlogs: []
    })

    const [userStats, setUserStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        adminUsers: 0,
        editorUsers: 0,
        readerUsers: 0,
        recentUsers: []
    })

    const { axios, user } = useAppContext()

    // Format numbers for display
    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M'
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K'
        }
        return num.toString()
    }

     const fetchDashboard = useCallback(async ()=>{
       try {
         const {data} = await axios.get('/api/admin/dashboard')
         data.success ? setDashboardData(data.dashboardData) : toast.error(data.message)
       } catch (error) {
            toast.error(error.message)
       }
     }, [axios])

     const fetchBlogStats = useCallback(async () => {
       try {
         const { data } = await axios.get('/api/blog/dashboard/stats')
         if (data.success) {
           setBlogStats(data.stats)
           // Also update dashboard data with recent blogs from stats
           setDashboardData(prev => ({
             ...prev,
             recentBlogs: data.stats.recentBlogs || prev.recentBlogs
           }))
         } else {
           toast.error(data.message)
         }
       } catch (error) {
         console.error('Error fetching blog stats:', error)
       }
     }, [axios])

     const fetchUserStats = useCallback(async () => {
       if (user?.role !== 'admin') return
       
       try {
         const { data } = await axios.get('/api/user/stats')
         if (data.success) {
           setUserStats(data.stats)
         } else {
           console.error('Error fetching user stats:', data.message)
         }
       } catch (error) {
         console.error('Error fetching user stats:', error)
       }
     }, [axios, user?.role])

     useEffect(()=>{
        fetchDashboard()
        fetchBlogStats()
        fetchUserStats()
     },[fetchDashboard, fetchBlogStats, fetchUserStats])

  // Different dashboard content based on user role
  if (user?.role === 'reader') {
    return (
        <div className='flex-1 bg-gradient-to-br from-gray-700 via-gray-600 to-orange-700 min-h-screen font-fraunces'>
            <div className='p-6 md:p-12'>
                <div className='mb-12 animate-slideInUp'>
                    <div className='flex items-center gap-4 mb-6'>
                        <div className='w-16 h-16 bg-gradient-to-r from-orange-600 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg'>
                            <svg className='w-8 h-8 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className='text-4xl font-bold text-white mb-2 font-fraunces'>Welcome, {user.name}!</h1>
                            <p className='text-xl text-orange-100 font-fraunces'>You're logged in as a reader. Enjoy reading and interacting with our blog posts!</p>
                        </div>
                    </div>
                </div>

                {/* Reader Features */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <div className='bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg border border-orange-300/30 hover:shadow-xl transition-all duration-300 hover:scale-105'>
                        <div className='flex items-center gap-4 mb-4'>
                            <div className='w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center'>
                                <svg className='w-6 h-6 text-orange-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className='text-xl font-bold text-gray-900 font-fraunces'>Browse Articles</h3>
                        </div>
                        <p className='text-gray-700 mb-4 font-fraunces'>Discover and read interesting blog posts from our collection.</p>
                        <button 
                            onClick={() => window.location.href = '/'}
                            className='w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-gray-600 text-white rounded-lg hover:from-orange-700 hover:to-gray-700 transition-all duration-300 font-bold font-fraunces'
                        >
                            Browse Articles
                        </button>
                    </div>

                    <div className='bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg border border-orange-300/30 hover:shadow-xl transition-all duration-300 hover:scale-105'>
                        <div className='flex items-center gap-4 mb-4'>
                            <div className='w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center'>
                                <svg className='w-6 h-6 text-red-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className='text-xl font-bold text-gray-900 font-fraunces'>Like Posts</h3>
                        </div>
                        <p className='text-gray-700 mb-4 font-fraunces'>Show appreciation for articles you enjoy reading.</p>
                        <div className='w-full px-4 py-3 bg-gray-300 text-gray-600 rounded-lg text-center font-fraunces'>
                            Available on blog posts
                        </div>
                    </div>

                    <div className='bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg border border-orange-300/30 hover:shadow-xl transition-all duration-300 hover:scale-105'>
                        <div className='flex items-center gap-4 mb-4'>
                            <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                                <svg className='w-6 h-6 text-green-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className='text-xl font-bold text-gray-900 font-fraunces'>Comment</h3>
                        </div>
                        <p className='text-gray-700 mb-4 font-fraunces'>Share your thoughts and engage with the community.</p>
                        <div className='w-full px-4 py-3 bg-gray-300 text-gray-600 rounded-lg text-center font-fraunces'>
                            Available on blog posts
                        </div>
                    </div>

                    <div className='bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg border border-orange-300/30 hover:shadow-xl transition-all duration-300 hover:scale-105'>
                        <div className='flex items-center gap-4 mb-4'>
                            <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center'>
                                <svg className='w-6 h-6 text-purple-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                </svg>
                            </div>
                            <h3 className='text-xl font-bold text-gray-900 font-fraunces'>Share</h3>
                        </div>
                        <p className='text-gray-700 mb-4 font-fraunces'>Share interesting articles with friends and social media.</p>
                        <div className='w-full px-4 py-3 bg-gray-300 text-gray-600 rounded-lg text-center font-fraunces'>
                            Available on blog posts
                        </div>
                    </div>

                    <div className='bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg border border-orange-300/30 hover:shadow-xl transition-all duration-300 hover:scale-105'>
                        <div className='flex items-center gap-4 mb-4'>
                            <div className='w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center'>
                                <svg className='w-6 h-6 text-indigo-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <h3 className='text-xl font-bold text-gray-900 font-fraunces'>Newsletter</h3>
                        </div>
                        <p className='text-gray-700 mb-4 font-fraunces'>Stay updated with our latest blog posts and articles.</p>
                        <div className='w-full px-4 py-3 bg-gray-300 text-gray-600 rounded-lg text-center font-fraunces'>
                            Subscribe on home page
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className='mt-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg border border-orange-300/30'>
                    <h3 className='text-2xl font-bold text-gray-900 mb-6 font-fraunces'>How to Get Started</h3>
                    <div className='space-y-6'>
                        <div className='flex items-start gap-4'>
                            <div className='w-8 h-8 bg-gradient-to-r from-orange-600 to-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1'>1</div>
                            <div>
                                <h4 className='font-semibold text-gray-900 font-fraunces'>Browse Articles</h4>
                                <p className='text-gray-700 font-fraunces'>Visit the home page to see all available blog posts and find topics that interest you.</p>
                            </div>
                        </div>
                        <div className='flex items-start gap-4'>
                            <div className='w-8 h-8 bg-gradient-to-r from-orange-600 to-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1'>2</div>
                            <div>
                                <h4 className='font-semibold text-gray-900 font-fraunces'>Engage with Content</h4>
                                <p className='text-gray-700 font-fraunces'>Like posts you enjoy, leave thoughtful comments, and share articles with others.</p>
                            </div>
                        </div>
                        <div className='flex items-start gap-4'>
                            <div className='w-8 h-8 bg-gradient-to-r from-orange-600 to-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1'>3</div>
                            <div>
                                <h4 className='font-semibold text-gray-900 font-fraunces'>Join the Community</h4>
                                <p className='text-gray-700 font-fraunces'>Participate in discussions and connect with other readers who share your interests.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
  }

  // Original admin dashboard for admin and editor users
  return (
    <div className='flex-1 bg-gradient-to-br from-orange-50 via-orange-900 to-black min-h-screen'>
        <div className='p-6 md:p-12'>
            
            {/* Header */}
            <div className='mb-12 animate-slideInUp'>
                <div className='flex items-center gap-4 mb-6'>
                    <div className='w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl flex items-center justify-center shadow-lg'>
                        <svg className='w-8 h-8 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className='text-4xl font-bold font-serif text-white mb-2'>
                            {user?.role === 'admin' ? 'Admin Dashboard' : 'Editor Dashboard'}
                        </h1>
                        <p className='text-xl text-orange-200'>
                            Welcome back! Here's what's happening with your blog.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12'>
                <div className='bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-orange-200 hover:shadow-2xl transition-all duration-300 hover:scale-105'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl flex items-center justify-center shadow-lg'>
                            <img src={assets.dashboard_icon_1} alt="" className='w-6 h-6 filter brightness-0 invert' />
                        </div>
                        <div className='text-right'>
                            <p className='text-2xl font-bold text-orange-800'>{blogStats.totalBlogs || dashboardData.blogs}</p>
                            <p className='text-xs text-orange-600 font-medium'>Total Blogs</p>
                        </div>
                    </div>
                </div>

                <div className='bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-emerald-200 hover:shadow-2xl transition-all duration-300 hover:scale-105'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg'>
                            <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className='text-right'>
                            <p className='text-2xl font-bold text-emerald-800'>{blogStats.publishedBlogs}</p>
                            <p className='text-xs text-emerald-600 font-medium'>Published</p>
                        </div>
                    </div>
                </div>

                <div className='bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-green-200 hover:shadow-2xl transition-all duration-300 hover:scale-105'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='w-12 h-12 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl flex items-center justify-center shadow-lg'>
                            <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <div className='text-right'>
                            <p className='text-2xl font-bold text-green-800'>{formatNumber(blogStats.totalViews)}</p>
                            <p className='text-xs text-green-600 font-medium'>Total Views</p>
                        </div>
                    </div>
                    <div className='mt-2 flex items-center text-xs text-green-600'>
                        <svg className='w-3 h-3 mr-1' fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        Live tracking
                    </div>
                </div>

                <div className='bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-red-200 hover:shadow-2xl transition-all duration-300 hover:scale-105'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-lg'>
                            <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <div className='text-right'>
                            <p className='text-2xl font-bold text-red-800'>{formatNumber(blogStats.totalLikes)}</p>
                            <p className='text-xs text-red-600 font-medium'>Total Likes</p>
                        </div>
                    </div>
                </div>

                <div className='bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-purple-200 hover:shadow-2xl transition-all duration-300 hover:scale-105'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg'>
                            <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                        </div>
                        <div className='text-right'>
                            <p className='text-2xl font-bold text-purple-800'>{formatNumber(blogStats.totalShares)}</p>
                            <p className='text-xs text-purple-600 font-medium'>Total Shares</p>
                        </div>
                    </div>
                </div>

                <div className='bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-orange-200 hover:shadow-2xl transition-all duration-300 hover:scale-105'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl flex items-center justify-center shadow-lg'>
                            <img src={assets.dashboard_icon_2} alt="" className='w-6 h-6 filter brightness-0 invert' />
                        </div>
                        <div className='text-right'>
                            <p className='text-2xl font-bold text-orange-800'>{formatNumber(dashboardData.comments)}</p>
                            <p className='text-xs text-orange-600 font-medium'>Comments</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin-only User Management Quick Stats */}
            {user?.role === 'admin' && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
                    <div className='bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-indigo-200 hover:shadow-2xl transition-all duration-300'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='w-12 h-12 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg'>
                                <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className='text-right'>
                                <p className='text-2xl font-bold text-indigo-800'>{userStats.totalUsers}</p>
                                <p className='text-xs text-indigo-600 font-medium'>Total Users</p>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-green-200 hover:shadow-2xl transition-all duration-300'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='w-12 h-12 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl flex items-center justify-center shadow-lg'>
                                <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className='text-right'>
                                <p className='text-2xl font-bold text-green-800'>{userStats.activeUsers}</p>
                                <p className='text-xs text-green-600 font-medium'>Active Users</p>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-purple-200 hover:shadow-2xl transition-all duration-300'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg'>
                                <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div className='text-right'>
                                <p className='text-2xl font-bold text-purple-800'>{userStats.adminUsers}</p>
                                <p className='text-xs text-purple-600 font-medium'>Admins</p>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-blue-200 hover:shadow-2xl transition-all duration-300'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg'>
                                <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div className='text-right'>
                                <p className='text-2xl font-bold text-blue-800'>{userStats.editorUsers}</p>
                                <p className='text-xs text-blue-600 font-medium'>Editors</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Analytics Summary */}
            <div className='bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-200 overflow-hidden animate-slideInUp mb-12'>
                <div className='bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b border-orange-200'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h3 className='text-xl font-bold font-serif text-gray-900 mb-1'>Performance Summary</h3>
                            <p className='text-gray-600 text-sm'>Key metrics and engagement rates</p>
                        </div>
                        <div className='w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl flex items-center justify-center shadow-lg'>
                            <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className='p-6'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        <div className='p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl text-center border border-green-200'>
                            <div className='flex items-center justify-center gap-2 mb-2'>
                                <svg className='w-5 h-5 text-green-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <h4 className='font-semibold text-gray-900'>Avg Views per Blog</h4>
                            </div>
                            <p className='text-2xl font-bold text-green-700'>
                                {blogStats.totalBlogs > 0 ? Math.round(blogStats.totalViews / blogStats.totalBlogs) : 0}
                            </p>
                        </div>
                        <div className='p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl text-center border border-purple-200'>
                            <div className='flex items-center justify-center gap-2 mb-2'>
                                <svg className='w-5 h-5 text-purple-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <h4 className='font-semibold text-gray-900'>Engagement Rate</h4>
                            </div>
                            <p className='text-2xl font-bold text-purple-700'>
                                {blogStats.totalViews > 0 
                                    ? (((blogStats.totalLikes + blogStats.totalShares + dashboardData.comments) / blogStats.totalViews) * 100).toFixed(1)
                                    : 0}%
                            </p>
                        </div>
                        <div className='p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl text-center border border-orange-200'>
                            <div className='flex items-center justify-center gap-2 mb-2'>
                                <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                                <h4 className='font-semibold text-gray-900'>View Tracking</h4>
                            </div>
                            <p className='text-lg font-bold text-orange-700'>Real-time</p>
                            <p className='text-xs text-gray-600 mt-1'>Live counting enabled</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Blogs Section */}
            <div className='bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-200 overflow-hidden animate-slideInUp'>
                <div className='bg-gradient-to-r from-orange-50 to-orange-100 p-8 border-b border-orange-200'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h2 className='text-2xl font-bold font-serif text-gray-900 mb-2'>Recent Blog Posts</h2>
                            <p className='text-gray-600'>Latest content with real-time metrics</p>
                        </div>
                        <div className='flex items-center gap-3'>
                            <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
                            <span className='text-sm text-green-600 font-medium'>Live Analytics</span>
                        </div>
                    </div>
                </div>
                
                <div className='p-8'>
                    {(dashboardData.recentBlogs && dashboardData.recentBlogs.length > 0) || (blogStats.recentBlogs && blogStats.recentBlogs.length > 0) ? (
                        <div className='space-y-4'>
                            {/* Show recent blogs from either source */}
                            {(blogStats.recentBlogs && blogStats.recentBlogs.length > 0 ? blogStats.recentBlogs : dashboardData.recentBlogs).map((blog) => (
                                <div key={blog._id} className='bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 border border-orange-200'>
                                    <div className='flex items-center justify-between mb-4'>
                                        <div className='flex-1'>
                                            <h3 className='text-lg font-semibold font-serif text-gray-900 mb-2 line-clamp-2'>{blog.title}</h3>
                                            <div className='flex items-center gap-4 text-sm text-gray-600'>
                                                <span className='flex items-center gap-1'>
                                                    <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {new Date(blog.createdAt).toLocaleDateString()}
                                                </span>
                                                {blog.author && (
                                                    <span className='flex items-center gap-1'>
                                                        <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        {blog.author.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-6 ml-6'>
                                            <div className='text-center'>
                                                <div className='flex items-center gap-1 text-green-600 mb-1'>
                                                    <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    <span className='text-xs font-medium'>Views</span>
                                                </div>
                                                <p className='text-lg font-bold text-green-700'>{formatNumber(blog.views || 0)}</p>
                                            </div>
                                            <div className='text-center'>
                                                <div className='flex items-center gap-1 text-red-600 mb-1'>
                                                    <svg className='w-4 h-4' fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className='text-xs font-medium'>Likes</span>
                                                </div>
                                                <p className='text-lg font-bold text-red-700'>{formatNumber(blog.likesCount || 0)}</p>
                                            </div>
                                            <div className='text-center'>
                                                <div className='flex items-center gap-1 text-purple-600 mb-1'>
                                                    <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                                    </svg>
                                                    <span className='text-xs font-medium'>Shares</span>
                                                </div>
                                                <p className='text-lg font-bold text-purple-700'>{formatNumber(blog.shares || 0)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Performance indicator */}
                                    <div className='flex items-center justify-between pt-4 border-t border-orange-300'>
                                        <div className='flex items-center gap-2'>
                                            <div className={`w-2 h-2 rounded-full ${
                                                (blog.views || 0) > 100 ? 'bg-green-500' : 
                                                (blog.views || 0) > 50 ? 'bg-yellow-500' : 'bg-gray-400'
                                            }`}></div>
                                            <span className='text-xs text-gray-600'>
                                                {(blog.views || 0) > 100 ? 'High Performance' : 
                                                 (blog.views || 0) > 50 ? 'Good Performance' : 'Building Audience'}
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-4'>
                                            <button className='text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors'>
                                                View Details
                                            </button>
                                            <button className='text-gray-600 hover:text-gray-700 text-sm font-medium transition-colors'>
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-12'>
                            <div className='w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-300'>
                                <svg className='w-10 h-10 text-orange-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className='text-xl font-semibold font-serif text-gray-700 mb-2'>No blog posts yet</h3>
                            <p className='text-gray-500 mb-6'>Start creating your first blog post to see analytics here.</p>
                            <button className='bg-gradient-to-r from-orange-600 to-orange-800 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-700 hover:to-orange-900 transition-all duration-300 shadow-lg'>
                                Create First Post
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* View Tracking Information */}
            <div className='mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl shadow-lg border border-green-200 overflow-hidden animate-slideInUp'>
                <div className='p-6'>
                    <div className='flex items-center gap-4 mb-4'>
                        <div className='w-12 h-12 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl flex items-center justify-center shadow-lg'>
                            <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className='text-xl font-bold font-serif text-gray-900'>Real-Time View Tracking</h3>
                            <p className='text-gray-600'>Your blog now features live view counting</p>
                        </div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div className='bg-white rounded-xl p-4 border border-green-100'>
                            <div className='flex items-center gap-2 mb-2'>
                                <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                                <h4 className='font-semibold text-gray-900'>Live Counting</h4>
                            </div>
                            <p className='text-sm text-gray-600'>Views increment on every page visit or refresh</p>
                        </div>
                        <div className='bg-white rounded-xl p-4 border border-green-100'>
                            <div className='flex items-center gap-2 mb-2'>
                                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                <h4 className='font-semibold text-gray-900'>Accurate Metrics</h4>
                            </div>
                            <p className='text-sm text-gray-600'>Real-time analytics without session restrictions</p>
                        </div>
                        <div className='bg-white rounded-xl p-4 border border-green-100'>
                            <div className='flex items-center gap-2 mb-2'>
                                <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                                <h4 className='font-semibold text-gray-900'>Performance Insights</h4>
                            </div>
                            <p className='text-sm text-gray-600'>Track engagement and content performance</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard