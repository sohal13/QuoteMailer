import { Routes,Route } from 'react-router-dom'
import Home from './Pages/Home'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <div className='bg-blue-900 w-screen h-screen'>
     <Routes>
      <Route path='/' element={<Home/>}/>
     </Routes>
     <ToastContainer />
    </div>
  )
}

export default App
