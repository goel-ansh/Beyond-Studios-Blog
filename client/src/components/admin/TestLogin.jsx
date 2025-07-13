import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const TestLogin = () => {
    const {axios, setToken, setUser, navigate} = useAppContext();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    console.log('TestLogin - Component rendered')
    console.log('axios:', axios)
    console.log('setToken:', setToken)
    console.log('setUser:', setUser)
    console.log('navigate:', navigate)

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('Test Login - Form submitted')
        console.log('Email:', email)
        console.log('Password:', password)
        
        try {
            const endpoint = '/api/user/login';
            const payload = {email, password};
            
            console.log('Sending request to:', endpoint)
            const {data} = await axios.post(endpoint, payload);
            console.log('Response:', data)
            
            if(data.success){
                setToken(data.token)
                setUser(data.user)
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                
                toast.success('Login successful');
                navigate('/admin');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || error.message || 'Network error occurred');
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
            </div>

            <div className='bg-white/20 backdrop-blur-sm p-8 rounded-3xl shadow-xl max-w-md w-full relative z-10 border border-blue-100/50'>
                <h1 className='text-2xl font-bold mb-6 text-center text-gray-800'>Test Login</h1>
                
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-700'>Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400/20 focus:border-blue-400 bg-white/20 backdrop-blur-sm text-gray-800 placeholder-gray-600'
                            placeholder='Enter your email'
                        />
                    </div>
                    
                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-700'>Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400/20 focus:border-blue-400 bg-white/20 backdrop-blur-sm text-gray-800 placeholder-gray-600'
                            placeholder='Enter your password'
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg'
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default TestLogin
