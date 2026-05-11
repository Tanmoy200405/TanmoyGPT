import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'
import toast from 'react-hot-toast'

const ChatBox = () => {

  const containerRef = useRef(null)

  const {selectedChat, theme, user, axios, token, setUser} = useAppContext()

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('text')
  const [isPublished, setIsPublished] = useState(false)

  const onSubmit = async (e) => {
    try {
      e.preventDefault() 
      if(!user) return toast('Login to send message')
        setLoading(true)
        const promptCopy = prompt
        setPrompt('')
        setMessages(prev => [...prev, {role: 'user', content: prompt, timestamp: Date.now(), isImage: false }])

        const {data} = await axios.post(`/api/message/${mode}`, {chatId: selectedChat._id, prompt, isPublished}, {headers: { Authorization: token }})

        if(data.success){
          setMessages(prev => [...prev, data.reply])
          // decrease credits
          if (mode === 'image'){
            setUser(prev => ({...prev, credits: prev.credits - 2}))
          }else{
            setUser(prev => ({...prev, credits: prev.credits - 1}))
          }
        }else{
          toast.error(data.message)
          setPrompt(promptCopy)
        }
    } catch (error) {
      toast.error(error.message)
    }finally{
      setPrompt('')
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(selectedChat){
      setMessages(selectedChat.messages)
    }
  },[selectedChat])

  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  },[messages])

  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>
      
      {/* Chat Messages */}
      <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll'>
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-6 text-primary'>
            <div className='text-center space-y-2'>
              <h1 className='text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600 dark:from-white dark:to-gray-400'>
                TanmoyGPT
              </h1>
              <p className='text-lg sm:text-xl text-gray-500 dark:text-gray-400 opacity-80'>
                Your personal AI assistant. How can I help you today?
              </p>
            </div>
          </div>
        )}

        {messages.map((message, index)=> <Message key={index} message={message}/>)}

        {/* Three Dots Loading  */}
        {
          loading && <div className='loader flex  items-center gap-1.5'>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
          </div>
        }
      </div>

        {mode === 'image' && (
          <label className='inline-flex items-center gap-2 mb-3 text-sm mx-auto'>
            <p className='text-xs'>Publish Generated Image to Community</p>
            <input type="checkbox" className='cursor-pointer' checked={isPublished} onChange={(e)=>setIsPublished(e.target.checked)}/>
          </label>
        )}

      {/* Prompt Input Box */}
      <form onSubmit={onSubmit} className='bg-white dark:bg-[#2A1D39] border border-gray-200 dark:border-[#80609F]/30 rounded-2xl w-full max-w-3xl p-2 pl-4 mx-auto flex gap-4 items-center shadow-lg hover:shadow-xl transition-shadow'>
        <div className='flex items-center border-r border-gray-200 dark:border-gray-700 pr-2'>
          <select onChange={(e)=>setMode(e.target.value)} value={mode} className='bg-transparent text-sm font-medium outline-none cursor-pointer'>
            <option className='dark:bg-[#2A1D39]' value="text">Text Mode</option>
            <option className='dark:bg-[#2A1D39]' value="image">Image Mode</option>
          </select>
        </div>
        <input onChange={(e)=>setPrompt(e.target.value)} value={prompt} type="text" placeholder="Type your message..." className='flex-1 w-full text-sm bg-transparent outline-none py-2' required/>
        <button disabled={loading} className='hover:scale-110 transition-transform disabled:opacity-50'>
          <img src={loading ? assets.stop_icon : assets.send_icon} className='w-9' alt="" />
        </button>
      </form>
    </div>
  )
}

export default ChatBox
