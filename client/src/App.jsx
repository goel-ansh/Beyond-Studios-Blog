import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import 'quill/dist/quill.snow.css'

// Import the original Home component
import Home from './pages/Home'

// Lazy load other components
const Blog = React.lazy(() => import('./pages/Blog'))
const About = React.lazy(() => import('./pages/About'))
const Contact = React.lazy(() => import('./pages/Contact'))
const Layout = React.lazy(() => import('./pages/admin/Layout'))
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'))
const AddBlog = React.lazy(() => import('./pages/admin/AddBlog'))
const EditBlog = React.lazy(() => import('./pages/admin/EditBlog'))
const ListBlog = React.lazy(() => import('./pages/admin/ListBlog'))
const Comments = React.lazy(() => import('./pages/admin/Comments'))
const Users = React.lazy(() => import('./pages/admin/Users'))
const Login = React.lazy(() => import('./components/admin/Login'))

const App = () => {
  const {token, user} = useAppContext()

  // Check if user has admin or editor access
  const hasAdminAccess = user && (user.role === 'admin' || user.role === 'editor');
  const hasUserAccess = user && user.role === 'reader';

  return (
    <div>
      <Toaster/>
      <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading...</div>}>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/blog/:id' element={<Blog/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/contact' element={<Contact/>} />
          <Route path='/admin' element={token && (hasAdminAccess || hasUserAccess) ? <Layout/> : <Login/>}>
            <Route index element={<Dashboard/>}/>
            <Route path='addBlog' element={hasAdminAccess ? <AddBlog/> : <Dashboard/>}/>
            <Route path='edit-blog/:id' element={hasAdminAccess ? <EditBlog/> : <Dashboard/>}/>
            <Route path='listBlog' element={hasAdminAccess ? <ListBlog/> : <Dashboard/>}/>
            {/* Redirect old hyphenated routes to new camelCase routes */}
            <Route path='list-blog' element={<Navigate to="/admin/listBlog" replace />}/>
            <Route path='comments' element={hasAdminAccess ? <Comments/> : <Dashboard/>}/>
            <Route path='users' element={user?.role === 'admin' ? <Users/> : <Dashboard/>}/>
          </Route>
        </Routes>
      </React.Suspense>
    </div>
  )
}

export default App
