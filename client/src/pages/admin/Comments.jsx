import React, { useEffect, useState } from 'react'
import { comments_data } from '../../assets/assets'
import CommentTableItem from '../../components/admin/CommentTableItem'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Comments = () => {

    const [comments, setComments] = useState([])
    const [filter, setFilter] = useState('Not Approved')

    const {axios} = useAppContext();

    const fetchComments = async ()=>{
        try {
          const { data } = await axios.get('/api/admin/comments')
          data.success ? setComments(data.comments) : toast.error(data.message)
        } catch (error) {
          toast.error(error.message)
        }
    }

    useEffect(()=>{
        fetchComments()
    },[])

  return (
    <div className='flex-1 p-4 md:p-10 bg-gray-50'>
      <div className='max-w-6xl'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-900'>Comments</h1>
          <div className='flex gap-2'>
            <button 
              onClick={()=> setFilter('Approved')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'Approved' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Approved
            </button>
            <button 
              onClick={()=> setFilter('Not Approved')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'Not Approved' 
                  ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Not Approved
            </button>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-900">Blog Title & Comment</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-900 max-sm:hidden">Date</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {comments.filter((comment)=>{
                    if(filter === "Approved") return comment.isApproved === true;
                    return comment.isApproved === false;
                }).map((comment, index)=> <CommentTableItem key={comment._id} comment={comment} index={index + 1} fetchComments={fetchComments} />)}
              </tbody>
            </table>
          </div>
          
          {comments.filter((comment)=>{
              if(filter === "Approved") return comment.isApproved === true;
              return comment.isApproved === false;
          }).length === 0 && (
            <div className='text-center py-16'>
              <div className='w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center'>
                <svg className='w-12 h-12 text-gray-400' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>No {filter.toLowerCase()} comments</h3>
              <p className='text-gray-600'>Comments will appear here once they are {filter === 'Approved' ? 'approved' : 'submitted'}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Comments
