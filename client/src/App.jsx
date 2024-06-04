import { Routes,Route } from 'react-router-dom'
import Home from './Pages/Home'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostQuote from './Pages/PostQuote';

function App() {

  return (
    <div className='bg-blue-900 w-screen h-screen'>
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/post-quote' element={<PostQuote/>}/>
     </Routes>
     <ToastContainer />
    </div>
  )
}

export default App
