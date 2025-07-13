import React, { useEffect, useRef, useState } from 'react'
import { blogCategories } from '../../assets/assets'
import Quill from 'quill';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import {parse} from 'marked'

const AddBlog = () => {

    const {axios} = useAppContext()
    const [isAdding, setIsAdding] = useState(false)
    const [loading, setLoading] = useState(false)

    const editorRef = useRef(null)
    const quillRef = useRef(null)

    const [image, setImage] = useState(false);
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [category, setCategory] = useState('Startup');
    const [isPublished, setIsPublished] = useState(false);
    const [tags, setTags] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [tableOfContents, setTableOfContents] = useState([]);

    const generateContent = async ()=>{
        if(!title) return toast.error('Please enter a title')

        try {
            setLoading(true);
            const {data} = await axios.post('/api/blog/generate', {prompt: title})
            if (data.success){
                if (quillRef.current) {
                    try {
                        // Convert markdown to HTML and set in editor
                        const htmlContent = parse(data.content)
                        quillRef.current.root.innerHTML = htmlContent
                        console.log('AI generated content set successfully in AddBlog')
                    } catch (error) {
                        console.error('Error setting AI generated content in AddBlog:', error)
                        toast.error('Error setting generated content in editor')
                    }
                } else {
                    toast.error('Editor not ready. Please try again.')
                }
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error('AI generation error in AddBlog:', error)
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
            setIsAdding(true)

            // Validate required fields
            if (!title) {
                toast.error('Please enter a title');
                return;
            }

            if (!image) {
                toast.error('Please select an image');
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

            console.log('Blog data being sent:', {
                title,
                hasContent: !!editorContent,
                contentLength: textContent.length,
                category
            });

            const formData = new FormData();
            formData.append('blog', JSON.stringify(blog))
            formData.append('image', image)

            const {data} = await axios.post('/api/blog/add', formData);

            if(data.success){
                toast.success(data.message);
                setImage(false)
                setTitle('')
                setSubTitle('')
                quillRef.current.root.innerHTML = ''
                setCategory('Startup')
                setTags('')
                setMetaTitle('')
                setMetaDescription('')
                setTableOfContents([])
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }finally{
            setIsAdding(false)
        }
        
    }

    useEffect(()=>{
        // Initiate Quill only once
        if(!quillRef.current && editorRef.current){
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
        }
    },[])

  return (
    <div className='flex-1 bg-gradient-to-br from-orange-50 via-gray-50 to-slate-100 min-h-screen font-serif'>
      <form onSubmit={onSubmitHandler} className='p-6 md:p-12'>
        <div className='bg-white w-full max-w-6xl mx-auto shadow-2xl border border-gray-200 rounded-3xl overflow-hidden animate-slideInUp'>
          
          {/* Header */}
          <div className='bg-gradient-to-r from-orange-600 to-gray-800 p-8 text-white'>
            <div className='flex items-center gap-4 mb-4'>
              <div className='w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm'>
                <svg className='w-8 h-8' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className='text-4xl font-bold mb-2 font-serif'>Create New Blog Post</h1>
                <p className='text-orange-100'>Share your thoughts and insights with the world</p>
              </div>
            </div>
          </div>

          <div className='p-8 md:p-12 space-y-8'>
            {/* Thumbnail Upload */}
            <div className='bg-gray-50 rounded-2xl p-6 border border-gray-200'>
              <label className='flex items-center gap-2 text-lg font-bold text-gray-800 mb-6 font-serif'>
                <svg className='w-5 h-5 text-orange-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Featured Image
              </label>
              <label htmlFor="image" className='block group cursor-pointer'>
                <div className='relative h-48 w-80 mx-auto rounded-2xl border-2 border-dashed border-gray-300 hover:border-orange-500 transition-all duration-300 overflow-hidden bg-gradient-to-br from-gray-100 to-orange-50 hover:from-orange-50 hover:to-orange-100'>
                  {image ? (
                    <>
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt="Thumbnail preview" 
                        className='w-full h-full object-cover'
                      />
                      <div className='absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full'>
                        <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <div className='flex flex-col items-center justify-center h-full text-gray-500 group-hover:text-orange-600 transition-colors'>
                      <svg className='w-16 h-16 mb-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className='text-lg font-medium font-serif'>Click to upload image</span>
                      <span className='text-sm text-gray-400 mt-2'>PNG, JPG up to 10MB</span>
                    </div>
                  )}
                  <div className='absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl'></div>
                </div>
                <input onChange={(e)=> setImage(e.target.files[0])} type="file" id='image' hidden required/>
              </label>
            </div>

            {/* Title and Subtitle */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              <div className='space-y-3'>
                <label className='flex items-center gap-2 text-lg font-bold text-gray-800 font-serif'>
                  <svg className='w-5 h-5 text-orange-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a2 2 0 012-2z" />
                  </svg>
                  Blog Title
                </label>
                <input 
                  type="text" 
                  placeholder='Enter an engaging title...' 
                  required 
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors font-serif text-lg' 
                  onChange={e => setTitle(e.target.value)} 
                  value={title}
                />
              </div>

              <div className='space-y-3'>
                <label className='flex items-center gap-2 text-lg font-bold text-gray-800 font-serif'>
                  <svg className='w-5 h-5 text-orange-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Subtitle
                </label>
                <input 
                  type="text" 
                  placeholder='Enter subtitle...' 
                  required 
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors font-serif text-lg' 
                  onChange={e => setSubTitle(e.target.value)} 
                  value={subTitle}
                />
              </div>
            </div>

            {/* Content Editor */}
            <div className='bg-gray-50 rounded-2xl p-6 border border-gray-200'>
              <div className='flex items-center justify-between mb-6'>
                <label className='flex items-center gap-2 text-lg font-bold text-gray-800 font-serif'>
                  <svg className='w-5 h-5 text-orange-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Blog Content
                </label>
                <button 
                  type="button" 
                  onClick={generateContent} 
                  disabled={!title || loading}
                  className='px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-serif flex items-center gap-2'
                >
                  {loading ? (
                    <>
                      <svg className='w-4 h-4 animate-spin' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI Generate
                    </>
                  )}
                </button>
              </div>
              <div className='relative border-2 border-gray-200 rounded-xl overflow-hidden hover:border-orange-300 transition-colors bg-white'>
                <div ref={editorRef} className='min-h-[400px] bg-white'></div>
                {loading && ( 
                <div className='absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center'>
                  <div className='flex flex-col items-center gap-4'>
                    <div className='w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin'></div>
                    <p className='text-orange-600 font-medium font-serif'>AI is crafting your content...</p>
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* Category and Tags */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              <div className='space-y-3'>
                <label className='flex items-center gap-2 text-lg font-bold text-gray-800 font-serif'>
                  <svg className='w-5 h-5 text-orange-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a2 2 0 012-2z" />
                  </svg>
                  Category
                </label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors font-serif text-lg bg-white'
                >
                  {blogCategories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className='space-y-3'>
                <label className='flex items-center gap-2 text-lg font-bold text-gray-800 font-serif'>
                  <svg className='w-5 h-5 text-orange-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a2 2 0 012-2z" />
                  </svg>
                  Tags
                </label>
                <input 
                  type="text" 
                  placeholder='React, JavaScript, Web Development' 
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors font-serif text-lg' 
                  onChange={(e) => setTags(e.target.value)} 
                  value={tags}
                />
                <p className='text-sm text-gray-500 flex items-center gap-2 font-serif'>
                  <svg className='w-4 h-4 text-orange-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Separate tags with commas
                </p>
              </div>
            </div>

            {/* SEO Settings */}
            <div className='bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl p-6 border border-gray-200'>
                <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 font-serif'>
                  <svg className='w-6 h-6 text-orange-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  SEO Settings
                </h3>
                
                <div className='space-y-6'>
                  <div className='space-y-3'>
                    <label className='block text-lg font-bold text-gray-800 font-serif'>Meta Title</label>
                    <input 
                        type="text" 
                        placeholder='SEO title (optional - uses blog title if empty)' 
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors font-serif text-lg' 
                        onChange={e => setMetaTitle(e.target.value)} 
                        value={metaTitle}
                    />
                  </div>

                  <div className='space-y-3'>
                    <label className='block text-lg font-bold text-gray-800 font-serif'>Meta Description</label>
                    <textarea 
                        placeholder='SEO description (optional - auto-generated if empty)' 
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors font-serif text-lg h-24 resize-none' 
                        onChange={e => setMetaDescription(e.target.value)} 
                        value={metaDescription}
                        maxLength={160}
                    />
                    <div className='flex justify-between items-center'>
                      <p className='text-sm text-gray-500 font-serif'>Recommended: 120-160 characters</p>
                      <span className={`text-sm font-medium ${metaDescription.length > 160 ? 'text-red-500' : metaDescription.length > 140 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {metaDescription.length}/160
                      </span>
                    </div>
                  </div>
                </div>
            </div>

            {/* Table of Contents */}
            <div className='bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200'>
                <h3 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 font-serif'>
                  <svg className='w-6 h-6 text-orange-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Table of Contents
                </h3>
                <p className='text-sm text-gray-600 mb-6 font-serif'>Create navigation links for your blog sections. Readers can click these to jump to specific parts.</p>
                
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
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t-2 border-gray-200'>
              <div className='flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200'>
                  <input 
                    type="checkbox" 
                    checked={isPublished} 
                    className='w-6 h-6 text-orange-600 border-orange-300 rounded-lg focus:ring-orange-500 transition-colors' 
                    onChange={e => setIsPublished(e.target.checked)}
                    id='publish-checkbox'
                  />
                  <label htmlFor='publish-checkbox' className='text-lg font-bold text-gray-800 cursor-pointer flex items-center gap-2 font-serif'>
                    <svg className='w-5 h-5 text-orange-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Publish immediately
                  </label>
              </div>

              <button 
                disabled={isAdding} 
                type="submit" 
                className='px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl font-bold text-lg shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 min-w-[250px] justify-center hover:from-orange-700 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 font-serif'
              >
                  {isAdding ? (
                    <>
                      <div className='w-6 h-6 rounded-full border-3 border-white border-t-transparent animate-spin'></div>
                      Creating Blog...
                    </>
                  ) : (
                    <>
                      <svg className='w-6 h-6' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Create Blog Post
                    </>
                  )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddBlog
