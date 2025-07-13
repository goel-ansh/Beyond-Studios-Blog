import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const CleanLogin = () => {
    const { axios, setToken, setUser, navigate } = useAppContext()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLogin, setIsLogin] = useState(true)
    const [name, setName] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            let endpoint, payload
            
            if (isLogin) {
                endpoint = '/api/user/login'
                payload = { email, password }
            } else {
                endpoint = '/api/user/register'
                payload = { name, email, password, role: 'reader' }
            }
            
            const response = await axios.post(endpoint, payload)
            const data = response.data

            if (data.success) {
                setToken(data.token)
                setUser(data.user)
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
                
                toast.success(isLogin ? 'Login successful' : 'Registration successful')
                
                if (data.user.role === 'admin' || data.user.role === 'editor') {
                    navigate('/admin')
                } else {
                    navigate('/')
                }
            } else {
                // If user login failed, try admin login
                if (isLogin && endpoint === '/api/user/login') {
                    try {
                        const adminResponse = await axios.post('/api/admin/login', { email, password })
                        const adminData = adminResponse.data
                        
                        if (adminData.success) {
                            setToken(adminData.token)
                            setUser(adminData.user)
                            localStorage.setItem('token', adminData.token)
                            localStorage.setItem('user', JSON.stringify(adminData.user))
                            axios.defaults.headers.common['Authorization'] = `Bearer ${adminData.token}`
                            
                            toast.success('Login successful')
                            navigate('/admin')
                        } else {
                            toast.error(adminData.message || 'Login failed')
                        }
                    } catch {
                        toast.error(data.message || 'Login failed')
                    }
                } else {
                    toast.error(data.message || 'Operation failed')
                }
            }
        } catch (error) {
            console.error('Login error:', error)
            toast.error(error.response?.data?.message || error.message || 'Network error occurred')
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-200 via-slate-200 to-blue-200/80 relative overflow-hidden flex items-center justify-center p-4'>
            
            {/* Background Pattern - Same as other pages */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.15)_1px,transparent_0)] [background-size:32px_32px]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.12)_1px,transparent_0)] [background-size:16px_16px] translate-x-4 translate-y-4"></div>
            
            {/* Geometric blur overlays */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
                <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-40 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-3xl"></div>
            </div>

            <div className='w-full max-w-md relative z-10'>
                <div className='bg-white/20 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-blue-100/50'>
                    
                    {/* Header */}
                    <div className='text-center mb-8'>
                        <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6'>
                            <svg className='w-10 h-10 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        
                        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                            {isLogin ? 'Welcome Back!' : 'Join Us Today!'}
                        </h1>
                        <p className='text-gray-700'>
                            {isLogin ? 'Enter your credentials to access your account' : 'Create a new account to get started'}
                        </p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {!isLogin && (
                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2'>
                                    <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Full Name
                                </label>
                                <input 
                                    onChange={e => setName(e.target.value)} 
                                    value={name} 
                                    type="text" 
                                    required 
                                    placeholder='John Doe' 
                                    className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 bg-white/20 backdrop-blur-sm text-gray-800 placeholder-gray-600'
                                />
                            </div>
                        )}
                        
                        <div className='space-y-2'>
                            <label className='text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2'>
                                <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                                Email Address
                            </label>
                            <input 
                                onChange={e => setEmail(e.target.value)} 
                                value={email} 
                                type="email" 
                                required 
                                placeholder='your.email@example.com' 
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 bg-white/20 backdrop-blur-sm text-gray-800 placeholder-gray-600'
                            />
                        </div>
                        
                        <div className='space-y-2'>
                            <label className='text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2'>
                                <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Password
                            </label>
                            <input 
                                onChange={e => setPassword(e.target.value)} 
                                value={password} 
                                type="password" 
                                required 
                                placeholder='••••••••' 
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 bg-white/20 backdrop-blur-sm text-gray-800 placeholder-gray-600'
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className='w-full py-4 font-bold text-lg rounded-xl shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 flex items-center justify-center gap-2'
                        >
                            {isLogin ? (
                                <>
                                    <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Sign In to Your Account
                                </>
                            ) : (
                                <>
                                    <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    Create Your Account
                                </>
                            )}
                        </button>
                    </form>
                    
                    {/* Toggle Login/Register */}
                    <div className='mt-8 text-center p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-blue-100/50'>
                        <p className='text-gray-700'>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                        </p>
                        <button 
                            onClick={() => setIsLogin(!isLogin)}
                            className='mt-2 text-blue-600 hover:text-purple-600 font-bold text-lg transition-colors hover:underline'
                        >
                            {isLogin ? 'Create New Account' : 'Sign In Instead'}
                        </button>
                    </div>

                    {/* Security Notice */}
                    <div className='mt-6 text-center'>
                        <div className='flex items-center justify-center gap-2 text-xs text-gray-600'>
                            <svg className='w-3 h-3' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Your data is encrypted and secure</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CleanLogin
