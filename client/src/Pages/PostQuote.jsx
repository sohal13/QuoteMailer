import axios from 'axios';
import React, { useState } from 'react'
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PostQuote = () => {

    const navigate = useNavigate();

  const [formData, setFormData] = useState({})

    const handelChnage=(e)=>{
        setFormData({
          ...formData,[e.target.id]:e.target.value
        })
      }

      const handelInpuSubmit=async(e)=>{
        e.preventDefault();
        try {
            const {data} = await axios.post(`/api/user/post-quote`,{...formData})
            if(data.success === false){
                toast.info(data.message)
                console.log(data);
            }
            toast.success("Quote Posted Succesfully!!")
            navigate('/')
        } catch (error) {
            console.log(error);
        }
      }

  return (
    <div className='w-full flex flex-col justify-center items-center'>
        <button onClick={()=>navigate('/')} className='absolute top-5 left-3 bg-white p-1 rounded-full'>
        <FaArrowLeft size={20} />
        </button>
        <h1 className='font-bold text-white text-2xl mt-5'>POST QUOTE</h1>
        <form onSubmit={handelInpuSubmit} className='flex flex-col w-[300px] justify-center gap-2'>
        <div className='flex flex-col'>
          <p className='font-bold text-sm text-gray-900 p-1'>Input Quote That Motivates People!!</p>
          <textarea rows={5} id='text' type='text' onChange={handelChnage} required placeholder='Enter The Quote....' className='p-2 rounded ' />
        </div>
        <div className='flex flex-col'>
          <label className='text-sm font-bold'>Auther Name</label>
          <input id='author' type='text' onChange={handelChnage} placeholder='Auther Name' required className='p-2 rounded ' />
        </div>
        <button type='submit' className='p-2 bg-green-600 rounded hover:bg-green-800 hover:scale-95'>
          Post Quote
        </button>
      </form>
    </div>
  )
}

export default PostQuote