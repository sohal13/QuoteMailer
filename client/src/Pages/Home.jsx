import React, { useEffect, useState } from 'react'
import axios from "axios"
import { data } from 'autoprefixer';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const {authUser } = useAuth();

  const navigate = useNavigate();

  const [quote, setQuote] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [formData, setFormData] = useState({})
  const [showMore , setShowMore] = useState(false)

  const getRandomQuote = async () => {
    try {
      const { data } = await axios.get(`/api/user/get-quote`)
      if (data.success === false) {
        console.log(data.message);
      }
      setQuote(data)
    } catch (error) {
      console.log("getQuote",error);
    }
  }

  useEffect(() => {
    getRandomQuote();
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentQuoteIndex((prevIndex) =>
        prevIndex === quote.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change 3000 to the desired duration in milliseconds (3 seconds)

    return () => clearTimeout(timer);
  }, [currentQuoteIndex, quote]);

  const handelChnage=(e)=>{
    setFormData({
      ...formData,[e.target.id]:e.target.value
    })
  }
  console.log(formData);
  const handelInpuSubmit = async(e) => {
    e.preventDefault();
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const updatedFormData = {
      ...formData,
      timezone: userTimezone
  };
console.log(updatedFormData);
    try {
      const {data} = await axios.post(`/api/user/subscribe`,{...updatedFormData});
      if(data.success === false){
        console.log(data.message);
      }
      localStorage.setItem("QuoteMailer",JSON.stringify(data.newUser))
      window.location.reload();
      toast.success(data.message,{autoClose:1000 , theme:"dark"})
    } catch (error) {
      console.log(error);
    }
  }
  console.log(showMore);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("QuoteMailer");
      window.location.reload(); 
      toast.success("Loged out",{autoClose:1000 , theme:"dark"})// Clear local storage
        // Optionally, perform other logout actions like redirecting to a login page
    }
};

  return (
    <div className='w-full p-3'>
      <div className='md:flex md:justify-between px-20'>
        <div className='font-bold p-2 text-3xl text-white font-serif text-center'>
          QuoteMailer
        </div>
        <div className='md:flex p-3 font-bold text-white gap-6 hidden'>
          <a href='https://www.linkedin.com/in/sohal-rahaman-540941245/'>Linked IN</a>
          <a href='https://github.com/sohal13'>Git Hub</a>
          <a href='https://www.instagram.com/sohal_rahaman_/'>InsTagram</a>
          <a href='https://www.youtube.com/channel/UC-J5OVodo9RMoFsup0iBS3w'>YouTube</a>
        </div>
      </div>
      <p className='text-xl text-center mt-10 font-semibold text-white p-4 font-sans'>
        "Transform your day with daily doses of inspiration!
        Enter your Email and choose your daily moment of motivation with <span className=' text-green-600'>QuoteMailer</span>🔔."
      </p>
    <div className='w-full flex flex-col items-center'>
      {authUser ? (<div className='p-10 mt-10 text-xl font-bold text-yellow-200 text-center'>
        <h1 className=''>Hii {authUser?.email}</h1>
        <h1 className='text-sm'>Every Day You Will Get a Mail At {authUser?.timeing}</h1>
      </div>):(<form onSubmit={handelInpuSubmit} className='flex flex-col w-[300px] justify-center gap-2'>
        <div className='flex flex-col'>
          <p className='font-bold text-sm text-gray-900 p-1'>Input a Valid Email pleasee!!</p>
          <input id='email' type='email' onChange={handelChnage} required placeholder='Enter Your Email..' className='p-2 rounded ' />
        </div>
        <div className='flex flex-col'>
          <label className='text-xl font-bold'>select Time:</label>
          <input id='timeing' type='time' onChange={handelChnage} required className='p-2 rounded ' />
        </div>
        <button type='submit' className='p-2 bg-green-600 rounded hover:bg-green-800 hover:scale-95'>
          Let's GO
        </button>
      </form>)}
      </div>
      <div className='mt-10 flex flex-col justify-center items-center p-2 '>
        <p className='text-white font-bold text-xl'>Some OF The Quotes</p>
        <div className='bg-white font-mono  text-center rounded p-1'>
          <p className='font-semibold'>{quote[currentQuoteIndex]?.text}</p>
          <p className='font-extrabold'>- {quote[currentQuoteIndex]?.author || 'Unknown'}</p>
        </div>
      </div>
      <div className='md:hidden'>
        <h1 className='text-xl font-bold text-green-500 px-8'>My Socials</h1>
        <div className='flex flex-wrap justify-center p-3 font-bold text-white gap-6 md:hidden'>
          <a href='https://www.linkedin.com/in/sohal-rahaman-540941245/'>Linked In</a>
          <a href='https://github.com/sohal13'>Git Hub</a>
        </div>
        </div>
      <div className='absolute bottom-0 right-0 p-4 z-20 '>
        <div onClick={(e)=>setShowMore(!showMore)} className={`p-1 bg-white rounded-full border border-black hover:scale-105 cursor-pointer ${showMore === true ? ("bg-green-500"):""}`}>
        <IoMdAdd size={30}/>
        </div>
      </div>
      {
        showMore ? (<div className='bg-gray-200 absolute bottom-11 right-5 p-1 rounded flex flex-col gap-2 z-10 border border-black'>
       <button onClick={handleLogout} className='hover:bg-red-500 p-1 rounded'>LogOut</button>
      <button onClick={()=>navigate('/post-quote')} className='hover:bg-green-500 p-1 rounded'>Create Quote</button>
      </div>) : ("")
      }
    </div>
  )
  
}
export default Home