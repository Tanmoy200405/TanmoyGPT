import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

const Message = ({message}) => {

  useEffect(()=>{
    Prism.highlightAll()
  },[message.content])

  return (
    <div className='w-full'>
      {message.role === "user" ? (
        <div className='flex items-start justify-end my-5 gap-3'>
          <div className='flex flex-col gap-1.5 p-3 px-5 bg-blue-600 text-white rounded-2xl rounded-tr-none shadow-sm max-w-[80%] sm:max-w-xl'>
            <p className='text-sm leading-relaxed'>{message.content}</p>
            <span className='text-[10px] opacity-70 text-right'>
              {moment(message.timestamp).format('LT')}</span>
          </div>
          <img src={assets.user_icon} alt="" className='w-9 h-9 rounded-full border-2 border-blue-600/20'/>
        </div>
      )
      : 
      (
        <div className='flex items-start justify-start my-5 gap-3'>
          <div className='flex flex-col gap-1.5 p-3 px-5 bg-gray-100 dark:bg-[#2A1D39] border border-gray-200 dark:border-[#80609F]/30 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] sm:max-w-2xl'>
            {message.isImage ? (
              <div className='relative group'>
                <img src={message.content} alt="" className='w-full max-w-md mt-1 rounded-xl shadow-md transition-transform group-hover:scale-[1.02]'/>
                <a href={message.content} download target='_blank' className='absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
                  <img src={assets.gallery_icon} className='w-4 invert' />
                </a>
              </div>
            ):
            (
              <div className='text-sm dark:text-gray-100 leading-relaxed reset-tw prose dark:prose-invert max-w-none'>
               <Markdown>{message.content}</Markdown></div>
            )}
            <span className='text-[10px] text-gray-400 dark:text-gray-500'>{moment(message.timestamp).format('LT')}</span>
          </div>
        </div>
      )
    }
    </div>
  )
}

export default Message
