import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { blogCategories } from '../../assets/assets'
import Quill from 'quill'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import {parse} from 'marked'

const EditBlog = () => {
    const { id } = useParams()
    const {axios, navigate} = useAppContext()
    const [isUpdating, setIsUpdating] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fetchingBlog, setFetchingBlog] = useState(true)
    const [editorReady, setEditorReady] = useState(false)

    const editorRef = useRef(null)
    const quillRef = useRef(null)

    const [image, setImage] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [category, setCategory] = useState('Startup');
    const [isPublished, setIsPublished] = useState(false);
    const [tags, setTags] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [tableOfContents, setTableOfContents] = useState([]);
    const [blogContent, setBlogContent] = useState('');

    const fetchBlogData = async () => {
        try {
            setFetchingBlog(true)
            console.log('🔍 Fetching blog data for ID:', id)
            
            const {data} = await axios.get(`/api/blog/${id}`)
            
            if(data.success) {
                const blog = data.blog
                console.log('✅ Blog data loaded successfully')
                setTitle(blog.title || '')
                setSubTitle(blog.subTitle || '')
                setCategory(blog.category || 'Startup')
                setIsPublished(blog.isPublished || false)
                setTags(Array.isArray(blog.tags) ? blog.tags.join(', ') : '')
                setMetaTitle(blog.metaTitle || '')
                setMetaDescription(blog.metaDescription || '')
                setCurrentImage(blog.image || '')
                setTableOfContents(blog.tableOfContents || [])
                setBlogContent(blog.content || '')
            } else {
                console.error('❌ API returned error:', data.message)
                toast.error(data.message)
                navigate('/admin/listBlog')
            }
        } catch (error) {
            console.error('💥 Error fetching blog data:', error)
            toast.error(error.response?.data?.message || error.message || 'Failed to fetch blog data')
            navigate('/admin/listBlog')
        } finally {
            setFetchingBlog(false)
        }
    }

    const generateContent = async ()=>{
        if(!title) return toast.error('Please enter a title')

        try {
            setLoading(true);
            console.log('🤖 Generating AI content for title:', title)
            
            const {data} = await axios.post('/api/blog/generate', {prompt: title})
            console.log('🤖 AI Response:', data)
            
            if (data.success){
                if (quillRef.current) {
                    // Convert markdown to HTML and set in editor
                    const htmlContent = parse(data.content)
                    console.log('📝 Setting AI content in editor')
                    quillRef.current.root.innerHTML = htmlContent
                    console.log('✅ AI generated content set successfully')
                    toast.success('Content generated successfully!')
                } else {
                    console.error('❌ Editor not ready')
                    toast.error('Editor not ready. Please try again.')
                }
            }else{
                console.error('❌ AI generation failed:', data.message)
                toast.error(data.message)
            }
        } catch (error) {
            console.error('💥 AI generation error:', error)
            toast.error(error.response?.data?.message || error.message || 'Failed to generate content')
        }finally{
            setLoading(false)
        }
    }

    const addTocItem = () => {
        setTableOfContents([...tableOfContents, { title: '', anchor: '', level: 1 }])
    }

    const removeTocItem = (index) => {
        setTableOfContents(tableOfContents.filter((_, i) => i !== index))
    }

    const updateTocItem = (index, field, value) => {
        const updated = [...tableOfContents]
        updated[index][field] = value
        
        // Auto-generate anchor from title if title is being updated
        if (field === 'title') {
            updated[index].anchor = value.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim('-')
        }
        
        setTableOfContents(updated)
    }

    const onSubmitHandler = async (e) =>{
        try {
            e.preventDefault();
            setIsUpdating(true)

            // Validate required fields
            if (!title) {
                toast.error('Please enter a title');
                return;
            }

            // Get content from Quill editor
            const editorContent = quillRef.current ? quillRef.current.root.innerHTML : '';
            
            // Check if content is meaningful (not just empty HTML tags)
            const textContent = quillRef.current ? quillRef.current.getText().trim() : '';
            if (!textContent || textContent.length < 10) {
                toast.error('Please write some content for the blog (at least 10 characters)');
                return;
            }

            const blog = {
                title, 
                subTitle, 
                description: subTitle || title,
                content: editorContent,
                category, 
                isPublished, 
                tags, 
                metaTitle, 
                metaDescription,
                tableOfContents
            }

            const formData = new FormData();
            formData.append('blog', JSON.stringify(blog))
            
            // Only append image if a new one is selected
            if (image) {
                formData.append('image', image)
            }

            const {data} = await axios.put(`/api/blog/edit/${id}`, formData);

            if(data.success){
                toast.success(data.message);
                navigate('/admin/listBlog')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }finally{
            setIsUpdating(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchBlogData()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    useEffect(()=>{
        // Initiate Quill with a delay to ensure DOM is ready
        const initQuill = () => {
            if(!quillRef.current && editorRef.current){
                try {
                    quillRef.current = new Quill(editorRef.current, {
                        theme: 'snow',
                        modules: {
                            toolbar: [
                                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'color': [] }, { 'background': [] }],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                [{ 'indent': '-1'}, { 'indent': '+1' }],
                                [{ 'align': [] }],
                                ['blockquote', 'code-block'],
                                ['link', 'image'],
                                ['clean']
                            ]
                        },
                        formats: [
                            'header', 'bold', 'italic', 'underline', 'strike',
                            'color', 'background', 'list', 'bullet', 'indent',
                            'align', 'blockquote', 'code-block', 'link', 'image'
                        ]
                    })
                    console.log('✅ Quill auto-initialized successfully')
                    setEditorReady(true)
                } catch (error) {
                    console.error('❌ Auto-init error:', error)
                }
            }
        }
        
        // Try multiple times with increasing delays
        const timers = [
            setTimeout(initQuill, 100),
            setTimeout(initQuill, 300),
            setTimeout(initQuill, 500),
            setTimeout(initQuill, 1000)
        ]
        
        return () => timers.forEach(clearTimeout)
    },[])

    // Effect to set content in editor once both editor and content are ready
    useEffect(() => {
        if (editorReady && quillRef.current && blogContent && !fetchingBlog) {
            console.log('📝 Setting blog content in editor')
            try {
                quillRef.current.root.innerHTML = blogContent
                console.log('✅ Content loaded successfully')
            } catch (error) {
                console.error('❌ Error setting content:', error)
            }
        }
    }, [blogContent, fetchingBlog, editorReady])

    if (fetchingBlog) {
        return (
            <div className='flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <div className='w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
                    <p className='text-gray-600'>Loading blog data...</p>
                </div>
            </div>
        )
    }

  return (
    <div className='flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen'>
      <form onSubmit={onSubmitHandler} className='p-6 md:p-12'>          <div className='bg-white w-full max-w-5xl mx-auto shadow-elegant border border-gray-200 rounded-2xl overflow-hidden animate-slideInUp'>
          
          {/* Header */}
          <div className='bg-gradient-to-r from-orange-600 to-orange-700 p-8 text-white'>
            <div className='flex items-center gap-4 mb-4'>
              <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center'>
                <svg className='w-6 h-6' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h1 className='text-3xl font-bold mb-2'>Edit Blog Post</h1>
                <p className='text-orange-100'>Update your blog content and settings</p>
              </div>
            </div>
          </div>

          <div className='p-8 md:p-12'>
            {/* Thumbnail Upload */}
            <div className='mb-8'>
              <label className='flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4'>
                <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Update Thumbnail
              </label>
              <label htmlFor="image" className='block group cursor-pointer'>
                <div className='relative h-40 w-64 rounded-xl border-2 border-dashed border-gray-300 hover:border-orange-500 transition-all duration-300 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100'>
                  {image ? (
                    <img 
                      src={URL.createObjectURL(image)} 
                      alt="New thumbnail preview" 
                      className='w-full h-full object-cover'
                    />
                  ) : currentImage ? (
                    <img 
                      src={currentImage} 
                      alt="Current thumbnail" 
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='flex flex-col items-center justify-center h-full text-gray-500 group-hover:text-orange-500 transition-colors'>
                      <svg className='w-12 h-12 mb-2' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className='text-sm font-medium'>Click to upload image</span>
                      <span className='text-xs text-gray-400 mt-1'>PNG, JPG up to 10MB</span>
                    </div>
                  )}
                  <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                </div>
                <input onChange={(e)=> setImage(e.target.files[0])} type="file" id='image' hidden/>
              </label>
              {!image && currentImage && (
                <p className='text-xs text-gray-500 mt-2'>Leave empty to keep current image, or select a new one to replace it.</p>
              )}
            </div>

            {/* Title and Subtitle */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
              <div className='space-y-2'>
                <label className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
                  <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a2 2 0 012-2z" />
                  </svg>
                  Blog Title
                </label>
                <input 
                  type="text" 
                  placeholder='Enter an engaging title...' 
                  required 
                  className='input-modern w-full' 
                  onChange={e => setTitle(e.target.value)} 
                  value={title}
                />
              </div>

              <div className='space-y-2'>
                <label className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
                  <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Subtitle
                </label>
                <input 
                  type="text" 
                  placeholder='Enter subtitle...' 
                  className='input-modern w-full' 
                  onChange={e => setSubTitle(e.target.value)} 
                  value={subTitle}
                />
              </div>
            </div>

            {/* Content Editor */}
            <div className='mb-8'>
              <label className='flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4'>
                <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Blog Content
              </label>
              <div className='relative border-2 border-gray-200 rounded-xl overflow-hidden hover:border-orange-300 transition-colors'>
                <div ref={editorRef} className='min-h-[300px] bg-white'></div>
                {loading && ( 
                <div className='absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center'>
                    <div className='flex items-center gap-3 bg-white rounded-lg p-4 shadow-lg'>
                      <div className='w-6 h-6 rounded-full border-2 border-orange-500 border-t-transparent animate-spin'></div>
                      <span className='text-sm font-medium text-gray-700'>Generating content...</span>
                    </div>
                </div> )}
                <div className='absolute bottom-4 right-4'>
                  <button 
                    disabled={loading} 
                    type='button' 
                    onClick={generateContent} 
                    className='bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg disabled:opacity-50 hover:from-orange-700 hover:to-orange-800 transition-colors'
                  >
                    <svg className='w-4 h-4 mr-2 inline' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {loading ? 'Generating...' : 'Generate with AI'}
                  </button>
                </div>
              </div>
            </div>

            {/* Category and Tags */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
              <div className='space-y-2'>
                <label className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
                  <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a2 2 0 012-2z" />
                  </svg>
                  Category
                </label>
                <select 
                  onChange={e => setCategory(e.target.value)} 
                  value={category}
                  name="category" 
                  className='input-modern w-full'
                >
                    <option value="">Select category</option>
                    {blogCategories.map((item, index)=>{
                        return <option key={index} value={item}>{item}</option>
                    })}
                </select>
              </div>

              <div className='space-y-2'>
                <label className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
                  <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a2 2 0 012-2z" />
                  </svg>
                  Tags
                </label>
                <input 
                    type="text" 
                    placeholder='React, JavaScript, Web Development' 
                    className='input-modern w-full' 
                    onChange={e => setTags(e.target.value)} 
                    value={tags}
                />
                <p className='text-xs text-gray-500 flex items-center gap-1'>
                  <svg className='w-3 h-3' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Separate tags with commas
                </p>
              </div>
            </div>

            {/* SEO Settings */}
            <div className='bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-8 border border-gray-200'>
                <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                  <svg className='w-5 h-5 text-blue-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  SEO Settings
                </h3>
                
                <div className='space-y-6'>
                  <div className='space-y-2'>
                    <label className='block text-sm font-semibold text-gray-700'>Meta Title</label>
                    <input 
                        type="text" 
                        placeholder='SEO title (optional - uses blog title if empty)' 
                        className='input-modern w-full' 
                        onChange={e => setMetaTitle(e.target.value)} 
                        value={metaTitle}
                    />
                  </div>

                  <div className='space-y-2'>
                    <label className='block text-sm font-semibold text-gray-700'>Meta Description</label>
                    <textarea 
                        placeholder='SEO description (optional - auto-generated if empty)' 
                        className='input-modern w-full h-24 resize-none' 
                        onChange={e => setMetaDescription(e.target.value)} 
                        value={metaDescription}
                        maxLength={160}
                    />
                    <div className='flex justify-between items-center'>
                      <p className='text-xs text-gray-500'>Recommended: 120-160 characters</p>
                      <span className={`text-xs font-medium ${metaDescription.length > 160 ? 'text-red-500' : metaDescription.length > 140 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {metaDescription.length}/160
                      </span>
                    </div>
                  </div>
                </div>
            </div>

            {/* Table of Contents */}
            <div className='bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 mb-8 border border-orange-200'>
                <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                  <svg className='w-5 h-5 text-orange-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Table of Contents
                </h3>
                <p className='text-sm text-gray-600 mb-4'>Create navigation links for your blog sections. Readers can click these to jump to specific parts.</p>
                
                <div className='space-y-4'>
                  {tableOfContents.map((item, index) => (
                    <div key={index} className='bg-white p-4 rounded-lg border border-orange-200 shadow-sm'>
                      <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-end'>
                        <div className='md:col-span-5'>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Section Title</label>
                          <input
                            type="text"
                            placeholder="e.g., Introduction, Main Features"
                            value={item.title}
                            onChange={(e) => updateTocItem(index, 'title', e.target.value)}
                            className='input-modern w-full'
                          />
                        </div>
                        
                        <div className='md:col-span-4'>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Anchor Link</label>
                          <input
                            type="text"
                            placeholder="Auto-generated from title"
                            value={item.anchor}
                            onChange={(e) => updateTocItem(index, 'anchor', e.target.value)}
                            className='input-modern w-full'
                          />
                        </div>
                        
                        <div className='md:col-span-2'>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Level</label>
                          <select
                            value={item.level}
                            onChange={(e) => updateTocItem(index, 'level', parseInt(e.target.value))}
                            className='input-modern w-full'
                          >
                            <option value={1}>H1</option>
                            <option value={2}>H2</option>
                            <option value={3}>H3</option>
                            <option value={4}>H4</option>
                          </select>
                        </div>
                        
                        <div className='md:col-span-1'>
                          <button
                            type="button"
                            onClick={() => removeTocItem(index)}
                            className='w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                            title="Remove this item"
                          >
                            <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className='text-xs text-gray-500 mt-2'>
                        Add this anchor to your content using: <code className='bg-gray-100 px-1 rounded'>&lt;h{item.level} id="{item.anchor}"&gt;Your Heading&lt;/h{item.level}&gt;</code>
                      </p>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addTocItem}
                    className='w-full p-4 border-2 border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center justify-center gap-2'
                  >
                    <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Table of Contents Item
                  </button>
                </div>
            </div>

            {/* Publish Actions */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-gray-200'>
              <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                  <input 
                    type="checkbox" 
                    checked={isPublished} 
                    className='w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 transition-colors' 
                    onChange={e => setIsPublished(e.target.checked)}
                    id='publish-checkbox'
                  />
                  <label htmlFor='publish-checkbox' className='text-sm font-semibold text-gray-700 cursor-pointer flex items-center gap-2'>
                    <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Publish immediately
                  </label>
              </div>

              <div className='flex gap-3'>
                <button 
                  type="button"
                  onClick={() => navigate('/admin/listBlog')}
                  className='px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors'
                >
                  Cancel
                </button>
                <button 
                  disabled={isUpdating} 
                  type="submit" 
                  className='bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[200px] justify-center hover:from-orange-700 hover:to-orange-800 transition-colors'
                >
                    {isUpdating ? (
                      <>
                        <div className='w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin'></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Update Blog Post
                      </>
                    )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditBlog
