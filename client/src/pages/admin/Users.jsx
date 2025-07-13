import React, { useEffect, useState, useCallback } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Users = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const { axios, user: currentUser } = useAppContext()

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true)
            const { data } = await axios.get('/api/user/all')
            if (data.success) {
                setUsers(data.users)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }, [axios])

    const updateUserRole = async (userId, newRole) => {
        try {
            const { data } = await axios.post('/api/user/update-role', { userId, role: newRole })
            if (data.success) {
                toast.success(data.message)
                fetchUsers()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const toggleUserStatus = async (userId) => {
        try {
            const { data } = await axios.post('/api/user/toggle-status', { userId })
            if (data.success) {
                toast.success(data.message)
                fetchUsers()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    if (loading) {
        return (
            <div className='flex-1 bg-gradient-to-br from-orange-50 via-orange-900 to-black min-h-screen'>
                <div className='p-6 md:p-12'>
                    <div className='flex items-center justify-center h-64'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600'></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex-1 bg-gradient-to-br from-orange-50 via-orange-900 to-black min-h-screen'>
            <div className='p-6 md:p-12'>
                {/* Header */}
                <div className='mb-8'>
                    <div className='flex items-center gap-4 mb-6'>
                        <div className='w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl flex items-center justify-center shadow-lg'>
                            <svg className='w-8 h-8 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className='text-4xl font-bold font-serif text-white mb-2'>User Management</h1>
                            <p className='text-xl text-orange-200'>Manage user accounts and permissions</p>
                        </div>
                    </div>
                </div>
                
                <div className='bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead className='bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200'>
                                <tr>
                                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>#</th>
                                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>Name</th>
                                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>Email</th>
                                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>Role</th>
                                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>Status</th>
                                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>Joined</th>
                                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-orange-100'>
                                {users.map((user, index) => (
                                    <tr key={user._id} className='hover:bg-orange-50/50 transition-colors'>
                                        <td className='px-6 py-4 text-sm text-gray-900 font-medium'>{index + 1}</td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-md'>
                                                    <span className='text-white font-bold text-sm'>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className='text-sm font-semibold text-gray-900'>{user.name}</span>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 text-sm text-gray-600'>{user.email}</td>
                                        <td className='px-6 py-4'>
                                            {currentUser?.role === 'admin' ? (
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => updateUserRole(user._id, e.target.value)}
                                                    className='text-sm border border-orange-300 rounded-lg px-3 py-1 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white'
                                                >
                                                    <option value="reader">Reader</option>
                                                    <option value="editor">Editor</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            ) : (
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                                                    user.role === 'admin' 
                                                        ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                                                        : user.role === 'editor'
                                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>
                                        <td className='px-6 py-4'>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                user.isActive 
                                                    ? 'bg-green-100 text-green-800 border border-green-200' 
                                                    : 'bg-red-100 text-red-800 border border-red-200'
                                            }`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 text-sm text-gray-600'>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className='px-6 py-4'>
                                            <button
                                                onClick={() => toggleUserStatus(user._id)}
                                                className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
                                                    user.isActive
                                                        ? 'text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300'
                                                        : 'text-green-600 hover:bg-green-50 border border-green-200 hover:border-green-300'
                                                }`}
                                            >
                                                {user.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {users.length === 0 && (
                    <div className='text-center py-16 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 mt-8'>
                        <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center border border-orange-300'>
                            <svg className='w-12 h-12 text-orange-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                            </svg>
                        </div>
                        <h3 className='text-lg font-semibold font-serif text-gray-900 mb-2'>No users found</h3>
                        <p className='text-gray-600'>Users will appear here once they register.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Users
