import {createContext, useContext, useEffect, useState} from 'react'
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast';


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// Add request interceptor for debugging
axios.interceptors.request.use(
    (config) => {
        console.log('🚀 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            baseURL: config.baseURL,
            fullURL: `${config.baseURL}${config.url}`,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('❌ API Error:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.message,
            response: error.response?.data
        });
        
        // Handle invalid token responses globally
        if (error.response?.data?.message?.includes('Invalid token') || 
            error.response?.data?.message?.includes('please login again')) {
            console.log('🚪 Invalid token detected, logging out...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            window.location.href = '/admin/login';
        }
        
        return Promise.reject(error);
    }
);

const AppContext = createContext();

export const AppProvider = ({ children })=>{

    const navigate = useNavigate()

    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [input, setInput] = useState("")

    const fetchBlogs = async ()=>{
        try {
           const {data} = await axios.get('/api/blog/all');
           if(data.success) {
               setBlogs(data.blogs);
           } else {
               console.error('Failed to fetch blogs:', data.message);
               toast.error(data.message);
           }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to fetch blogs');
        }
    }

    useEffect(()=>{
        fetchBlogs();
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        if(token){
            setToken(token);
            setUser(userData ? JSON.parse(userData) : null);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    },[])

    const value = {
        axios, navigate, token, setToken, user, setUser, blogs, setBlogs, input, setInput, fetchBlogs
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = ()=>{
    return useContext(AppContext)
};