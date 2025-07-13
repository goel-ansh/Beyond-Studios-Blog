import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import { assets } from '../assets/assets'
import Navbar from '../components/Navbar'
import Moment from 'moment'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Blog = () => {

  const {id} = useParams()

  const {axios, user, navigate} = useAppContext()

  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [activeSection, setActiveSection] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [shareCount, setShareCount] = useState(0)
  const [viewsCount, setViewsCount] = useState(0)
  const [readingProgress, setReadingProgress] = useState(0)

  const fetchBlogData = async ()=>{
    try {
      const {data} = await axios.get(`/api/blog/${id}`)
      if(data.success) {
        setData(data.blog)
        setLikesCount(data.blog.likesCount || 0)
        setShareCount(data.blog.shares || 0)
        setViewsCount(data.blog.views || 0)
        
        // Increment views when blog is loaded (only once per session)
        const viewKey = `blog_viewed_${id}`;
        const hasViewed = sessionStorage.getItem(viewKey);
        
        console.log('Blog data loaded, checking if already viewed:', hasViewed);
        if (!hasViewed) {
          console.log('First time viewing this blog in this session, incrementing view...');
          sessionStorage.setItem(viewKey, 'true');
          incrementViewCount();
        } else {
          console.log('Blog already viewed in this session');
        }
        
        // Like status will be fetched by the separate useEffect when user data is available
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchLikeStatus = async () => {
    if (!user) {
      console.log('No user logged in, skipping like status fetch');
      return;
    }
    
    try {
      console.log('Fetching like status for user:', user.name, 'blog:', id);
      console.log('Auth headers:', axios.defaults.headers.common['Authorization']);
      
      const { data } = await axios.get(`/api/blog/like-status/${id}`)
      if (data.success) {
        console.log('✅ Like status fetched successfully:', data.isLiked, 'Likes count:', data.likesCount);
        setIsLiked(data.isLiked)
        setLikesCount(data.likesCount)
      } else {
        console.error('❌ Error in like status response:', data.message);
      }
    } catch (error) {
      console.error('❌ Error fetching like status:', error?.response?.data || error.message)
    }
  }

  const toggleLike = async () => {
    if (!user) {
      toast.error('Please login to like this blog')
      navigate('/admin')
      return
    }

    try {
      console.log('Toggling like for blog:', id, 'Current status:', isLiked);
      const { data } = await axios.post(`/api/blog/like/${id}`)
      if (data.success) {
        console.log('Like toggle successful. New status:', data.isLiked, 'New count:', data.likesCount);
        setIsLiked(data.isLiked)
        setLikesCount(data.likesCount)
        toast.success(data.message)
      } else {
        console.error('Like toggle failed:', data.message);
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error in toggleLike:', error);
      toast.error(error.message)
    }
  }

  // Function to add IDs to headings in content
  const addHeadingIds = (content) => {
    if (!content) return content
    
    // Add IDs to headings based on TOC anchors
    let processedContent = content
    
    if (data?.tableOfContents && Array.isArray(data.tableOfContents)) {
      data.tableOfContents.forEach((item) => {
        // Create a simple regex to find headings that might match this TOC item
        const headingText = item.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special regex characters
        const headingRegex = new RegExp(`(<h[1-6][^>]*>)([^<]*${headingText}[^<]*)(</h[1-6]>)`, 'gi')
        
        processedContent = processedContent.replace(headingRegex, (match, openTag, text, closeTag) => {
          // Check if ID already exists
          if (openTag.includes('id=')) {
            return match
          }
          // Add ID to the opening tag
          const tagWithId = openTag.replace('>', ` id="${item.anchor}">`)
          return tagWithId + text + closeTag
        })
      })
    }
    
    return processedContent
  }

  const scrollToSection = (anchor) => {
    const element = document.getElementById(anchor)
    if (element) {
      const headerOffset = 120 // Account for sticky header and TOC
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      
      // Update active section immediately for better UX
      setActiveSection(anchor)
    }
  }

  const fetchComments = async () =>{
    try {
      const { data } = await axios.post('/api/blog/comments', {blogId: id})
      if (data.success){
        setComments(data.comments)
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const addComment = async (e)=>{
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to comment on this blog')
      navigate('/admin')
      return
    }
    
    try {
      const { data } = await axios.post('/api/blog/add-comment', {blog: id, name: user.name, content});
      if (data.success){
        toast.success(data.message)
        setContent('')
        fetchComments()
      }else{
         toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // Share functionality
  const handleShare = async (platform) => {
    const blogUrl = window.location.href
    const blogTitle = data?.title || 'Check out this blog'
    
    let shareUrl = ''
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(blogTitle)}&url=${encodeURIComponent(blogUrl)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`
        break
      case 'copy':
        try {
          await navigator.clipboard.writeText(blogUrl)
          toast.success('Link copied to clipboard!')
          incrementShareCount()
          return
        } catch {
          toast.error('Failed to copy link')
          return
        }
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${blogTitle} - ${blogUrl}`)}`
        break
      default:
        return
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
      incrementShareCount()
    }
  }

  const incrementShareCount = async () => {
    try {
      const { data: shareData } = await axios.post(`/api/blog/share/${id}`)
      if (shareData.success) {
        setShareCount(shareData.shares)
      }
    } catch (error) {
      console.error('Error updating share count:', error)
    }
  }

  const incrementViewCount = async () => {
    console.log('incrementViewCount called for blog:', id);
    
    try {
      console.log('Making API call to increment views...');
      const { data: viewData } = await axios.post(`/api/blog/view/${id}`)
      if (viewData.success) {
        console.log('View increment successful, new count:', viewData.views);
        setViewsCount(viewData.views)
      }
    } catch (error) {
      console.error('Error updating view count:', error)
    }
  }

  useEffect(()=>{
    console.log('useEffect triggered for blog ID:', id);
    
    fetchBlogData()
    fetchComments()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[id])

  // Separate effect to handle user authentication changes
  useEffect(() => {
    console.log('User/Data effect triggered. User:', user?.name, 'Data loaded:', !!data);
    if (user && data) {
      console.log('Both user and data available, fetching like status...');
      fetchLikeStatus()
    } else if (!user && data) {
      console.log('No user but data loaded, resetting like status');
      setIsLiked(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, data?.title]) // Use data.title to detect when data is actually loaded

  useEffect(() => {
    const handleScroll = () => {
      // Calculate reading progress
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrollTop = window.scrollY
      const progress = Math.min(Math.max((scrollTop / documentHeight) * 100, 0), 100)
      setReadingProgress(progress)
      
      // Track active section
      if (!data?.tableOfContents || data.tableOfContents.length === 0) return
      
      let current = ''
      const sections = data.tableOfContents
      
      // Find the current section based on scroll position
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].anchor)
        if (element) {
          const rect = element.getBoundingClientRect()
          // Consider a section active if it's in the top 30% of the viewport
          if (rect.top <= windowHeight * 0.3) {
            current = sections[i].anchor
            break
          }
        }
      }
      
      setActiveSection(current)
    }

    // Initial calculation
    handleScroll()
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [data])

  return data ? (
    <div className='min-h-screen bg-white'>
      {/* Use the shared Navbar component */}
      <Navbar />

      {/* Main Content */}
      <div className='max-w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 py-3'>
        <div className='flex gap-6 lg:gap-10'>
          {/* Left Sidebar - Article Info & Navigation */}
          <div className='hidden lg:block w-80 xl:w-96 sticky top-20 h-fit flex-shrink-0'>
            {/* Article Header Info */}
            <div className='mb-4'>
              {/* Category Badge */}
              <div className='mb-2'>
                <span className='inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium'>
                  <svg className='w-4 h-4' fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  {data.category}
                </span>
              </div>

              {/* Title */}
              <h1 className='text-xl lg:text-2xl xl:text-3xl font-bold leading-tight text-gray-900 mb-2'>
                {data.title}
              </h1>
              
              {/* Subtitle */}
              {data.subTitle && (
                <p className='text-sm text-gray-600 leading-relaxed mb-2'>
                  {data.subTitle}
                </p>
              )}

              {/* Publication Date */}
              <div className='text-xs text-gray-600 mb-2'>
                <span>{Moment(data.createdAt).format('MMMM Do, YYYY')}</span>
              </div>
            </div>

            {/* Author, Views, Likes, Shares Info */}
            <div className='bg-gray-50 rounded-lg p-3 border border-gray-200 mb-3'>
              <h3 className='text-sm font-semibold text-gray-900 mb-2'>Article Stats</h3>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <div className='w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center'>
                    <svg className='w-3 h-3 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className='text-xs font-medium text-gray-900'>Article by</p>
                    <p className='text-xs text-gray-600'>Beyond Studios</p>
                  </div>
                </div>
                
                <div className='grid grid-cols-3 gap-2 pt-2 border-t border-gray-200'>
                  <div className='text-center'>
                    <div className='flex items-center justify-center mb-1'>
                      <svg className='w-3 h-3 text-red-500' fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className='text-sm font-bold text-gray-900'>{likesCount}</p>
                    <p className='text-xs text-gray-600'>Likes</p>
                  </div>
                  
                  <div className='text-center'>
                    <div className='flex items-center justify-center mb-1'>
                      <svg className='w-3 h-3 text-blue-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <p className='text-sm font-bold text-gray-900'>{viewsCount}</p>
                    <p className='text-xs text-gray-600'>Views</p>
                  </div>
                  
                  <div className='text-center'>
                    <div className='flex items-center justify-center mb-1'>
                      <svg className='w-3 h-3 text-green-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </div>
                    <p className='text-sm font-bold text-gray-900'>{shareCount}</p>
                    <p className='text-xs text-gray-600'>Shares</p>
                  </div>
                </div>
                
                <div className='pt-2 border-t border-gray-200'>
                  <div className='flex items-center gap-2 text-xs text-gray-600'>
                    <svg className='w-3 h-3' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{data.readingTime || 5} min read</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            {data && (
              <div className='bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6'>
                <div className='mb-4'>
                  <h3 className='text-base font-bold text-gray-900 mb-2'>
                    Table of Contents
                  </h3>
                  
                  {/* Reading Progress */}
                  <div className='mb-3'>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-xs text-gray-600'>Progress</span>
                      <span className='text-xs font-semibold text-gray-900'>{Math.round(readingProgress)}%</span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-1.5'>
                      <div 
                        className='bg-blue-600 h-1.5 rounded-full transition-all duration-300' 
                        style={{width: `${readingProgress}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Navigation */}
                <nav className='space-y-1'>
                  {(data.tableOfContents && Array.isArray(data.tableOfContents) && data.tableOfContents.length > 0 
                    ? data.tableOfContents 
                    : [
                        { title: 'Introduction', anchor: 'introduction', level: 1 },
                        { title: 'Getting Started', anchor: 'getting-started', level: 1 },
                        { title: 'Key Features', anchor: 'key-features', level: 2 },
                        { title: 'Advanced Topics', anchor: 'advanced-topics', level: 2 },
                        { title: 'Conclusion', anchor: 'conclusion', level: 1 }
                      ]
                  ).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(item.anchor)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                        activeSection === item.anchor 
                          ? 'bg-blue-100 text-blue-700 font-medium' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      style={{ paddingLeft: `${12 + (item.level - 1) * 16}px` }}
                    >
                      {item.title}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* Share Buttons */}
            <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
              <h3 className='text-base font-semibold text-gray-900 mb-3'>Share this article</h3>
              
              {/* Like Button */}
              <div className='mb-3'>
                <button 
                  onClick={toggleLike}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium ${
                    isLiked 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <svg 
                    className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} 
                    fill={isLiked ? 'currentColor' : 'none'} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{isLiked ? 'Liked' : 'Like'} ({likesCount})</span>
                </button>
              </div>
              
              <div className='grid grid-cols-2 gap-2'>
                <button 
                  onClick={() => handleShare('twitter')}
                  className='flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium'
                >
                  <img src={assets.twitter_icon} width={14} alt="" />
                  Twitter
                </button>
                <button 
                  onClick={() => handleShare('facebook')}
                  className='flex items-center justify-center gap-2 px-3 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200 text-sm font-medium'
                >
                  <img src={assets.facebook_icon} width={14} alt="" />
                  Facebook
                </button>
                <button 
                  onClick={() => handleShare('copy')}
                  className='flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium'
                >
                  <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
                <button 
                  onClick={() => handleShare('whatsapp')}
                  className='flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium'
                >
                  <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className='flex-1 min-w-0'>
            {/* Featured Image */}
            <div className='mb-6'>
              <div className='relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 p-2'>
                <img 
                  src={data.image} 
                  alt={data.title}
                  className='w-full h-[350px] md:h-[400px] object-cover rounded-lg shadow-md'
                />
              </div>
            </div>

            {/* Article Content */}
            <div className='max-w-full'>
              {/* Content Display */}
              {data.content ? (
                <div className='prose prose-lg prose-gray max-w-none lg:max-w-6xl xl:max-w-7xl'>
                  <div 
                    className='article-content text-gray-800 leading-relaxed [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mb-8 [&>h1]:mt-12 [&>h1]:leading-tight [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mb-6 [&>h2]:mt-10 [&>h2]:leading-tight [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mb-4 [&>h3]:mt-8 [&>h3]:leading-tight [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:text-gray-900 [&>h4]:mb-4 [&>h4]:mt-6 [&>h5]:text-lg [&>h5]:font-semibold [&>h5]:text-gray-900 [&>h5]:mb-3 [&>h5]:mt-5 [&>h6]:text-base [&>h6]:font-semibold [&>h6]:text-gray-900 [&>h6]:mb-3 [&>h6]:mt-4 [&>p]:mb-6 [&>p]:text-gray-700 [&>p]:leading-relaxed [&>p]:text-lg [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>li]:mb-2 [&>li]:text-gray-700 [&>li]:leading-relaxed [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-6 [&>blockquote]:py-4 [&>blockquote]:bg-blue-50 [&>blockquote]:rounded-r-lg [&>blockquote]:my-8 [&>blockquote]:italic [&>blockquote]:text-gray-700 [&>code]:bg-gray-100 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono [&>code]:text-gray-800 [&>pre]:bg-gray-900 [&>pre]:text-white [&>pre]:p-6 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-8 [&>pre]:text-sm [&>pre]:font-mono [&>a]:text-blue-600 [&>a]:hover:text-blue-800 [&>a]:underline [&>a]:decoration-blue-300 [&>a]:underline-offset-2 [&>strong]:font-semibold [&>strong]:text-gray-900 [&>em]:italic [&>em]:text-gray-700'
                    dangerouslySetInnerHTML={{__html: addHeadingIds(data.content)}}
                  />
                </div>
              ) : data.description ? (
                <div className='prose prose-lg prose-gray max-w-none lg:max-w-5xl xl:max-w-6xl'>
                  <div 
                    className='article-content text-gray-800 leading-relaxed [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mb-8 [&>h1]:mt-12 [&>h1]:leading-tight [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mb-6 [&>h2]:mt-10 [&>h2]:leading-tight [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mb-4 [&>h3]:mt-8 [&>h3]:leading-tight [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:text-gray-900 [&>h4]:mb-4 [&>h4]:mt-6 [&>h5]:text-lg [&>h5]:font-semibold [&>h5]:text-gray-900 [&>h5]:mb-3 [&>h5]:mt-5 [&>h6]:text-base [&>h6]:font-semibold [&>h6]:text-gray-900 [&>h6]:mb-3 [&>h6]:mt-4 [&>p]:mb-6 [&>p]:text-gray-700 [&>p]:leading-relaxed [&>p]:text-lg [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>li]:mb-2 [&>li]:text-gray-700 [&>li]:leading-relaxed [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-6 [&>blockquote]:py-4 [&>blockquote]:bg-blue-50 [&>blockquote]:rounded-r-lg [&>blockquote]:my-8 [&>blockquote]:italic [&>blockquote]:text-gray-700 [&>code]:bg-gray-100 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono [&>code]:text-gray-800 [&>pre]:bg-gray-900 [&>pre]:text-white [&>pre]:p-6 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-8 [&>pre]:text-sm [&>pre]:font-mono [&>a]:text-blue-600 [&>a]:hover:text-blue-800 [&>a]:underline [&>a]:decoration-blue-300 [&>a]:underline-offset-2 [&>strong]:font-semibold [&>strong]:text-gray-900 [&>em]:italic [&>em]:text-gray-700'
                    dangerouslySetInnerHTML={{__html: addHeadingIds(data.description)}}
                  />
                </div>
              ) : (
                <div className='text-center py-12'>
                  <p className='text-gray-500 text-lg'>No content available for this blog post.</p>
                </div>
              )}
            </div>

            {/* Tags */}
            {data.tags && data.tags.length > 0 && (
              <div className='mt-12 mb-8'>
                <div className='border-t border-gray-200 pt-8'>
                  <div className='flex flex-wrap gap-2'>
                    {data.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className='px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200'
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className='mt-12'>
              <div className='border-t border-gray-200 pt-12'>
                <h3 className='text-2xl font-bold text-gray-900 mb-8'>
                  Comments ({comments.length})
                </h3>
                
                {/* Add Comment Form */}
                <div className='mb-12'>
                  <h4 className='text-lg font-semibold text-gray-900 mb-6'>
                    Leave a comment
                  </h4>
                  {user ? (
                    <form onSubmit={addComment} className='space-y-4'>
                      <div className='flex items-center gap-3 mb-4'>
                        <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center'>
                          <span className='text-white font-semibold text-sm'>
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className='text-base font-semibold text-gray-900'>{user.name}</span>
                          <p className='text-sm text-gray-600 capitalize'>{user.role}</p>
                        </div>
                      </div>
                      <textarea
                        onChange={(e)=> setContent(e.target.value)} 
                        value={content} 
                        placeholder='Share your thoughts about this article...' 
                        className='w-full p-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 h-32 resize-none bg-white transition-all duration-200' 
                        required
                      ></textarea>
                      <button 
                        type="submit" 
                        className='flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium'
                      >
                        <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Post Comment
                      </button>
                    </form>
                  ) : (
                    <div className='text-center py-12 bg-gray-50 rounded-lg'>
                      <div className='mb-4'>
                        <svg className='w-12 h-12 mx-auto text-gray-400' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </div>
                      <h5 className='text-lg font-semibold text-gray-900 mb-2'>Join the conversation</h5>
                      <p className='text-gray-600 mb-4'>Please login to leave a comment and engage with our community.</p>
                      <button 
                        onClick={() => navigate('/admin')}
                        className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium'
                      >
                        Login to Comment
                      </button>
                    </div>
                  )}
                </div>

                {/* Comments List */}
                <div className='space-y-6'>
                  {comments.map((comment, index)=>(
                    <div key={index} className='border-b border-gray-100 pb-6 last:border-b-0'>
                      <div className='flex items-start gap-4'>
                        <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0'>
                          <span className='text-white font-semibold text-sm'>
                            {comment.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className='flex-1'>
                          <div className='flex items-center gap-3 mb-2'>
                            <h5 className='font-semibold text-gray-900'>{comment.name}</h5>
                            <span className='text-sm text-gray-500'>
                              {Moment(comment.createdAt).fromNow()}
                            </span>
                          </div>
                          <p className='text-gray-700 leading-relaxed'>{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {comments.length === 0 && (
                    <div className='text-center py-12'>
                      <svg className='w-12 h-12 mx-auto text-gray-400 mb-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <h4 className='text-lg font-semibold text-gray-600 mb-2'>No comments yet</h4>
                      <p className='text-gray-500'>Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header Info - Shows when sidebar is hidden */}
        <div className='lg:hidden mb-6 px-8'>
          {/* Category Badge */}
          <div className='mb-6'>
            <span className='inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium'>
              <svg className='w-4 h-4' fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {data.category}
            </span>
          </div>

          {/* Title */}
          <h1 className='text-3xl lg:text-4xl font-bold leading-tight text-gray-900 mb-6'>
            {data.title}
          </h1>
          
          {/* Subtitle */}
          {data.subTitle && (
            <p className='text-lg text-gray-600 leading-relaxed mb-6'>
              {data.subTitle}
            </p>
          )}

          {/* Meta Info */}
          <div className='flex flex-wrap gap-4 text-sm text-gray-600 mb-6'>
            <span>{Moment(data.createdAt).format('MMMM Do, YYYY')}</span>
            <span>•</span>
            <span>{data.readingTime || 5} min read</span>
            <span>•</span>
            <span>{likesCount} likes</span>
            <span>•</span>
            <span>{viewsCount} views</span>
          </div>

          {/* Mobile Share Buttons */}
          <div className='flex flex-wrap gap-3 mb-6'>
            <button 
              onClick={toggleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                isLiked 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg 
                className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} 
                fill={isLiked ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{likesCount}</span>
            </button>
            
            <button 
              onClick={() => handleShare('twitter')}
              className='flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium'
            >
              <img src={assets.twitter_icon} width={14} alt="" />
              Share
            </button>
            
            <button 
              onClick={() => handleShare('copy')}
              className='flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium'
            >
              <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
          </div>
        </div>
      </div>
      
      <Footer/>
    </div>
  ) : <Loader/>
}

export default Blog
