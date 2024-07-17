
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ExerciseDetail from './pages/ExerciseDetail'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'


function App() {
  

  return (
    <>
      <div className='App'>
    
      <Router>
        <Navbar/>

        <Routes>
        <Route path="/" element={<Home/>} />
          <Route path="/exercise/:id" element={<ExerciseDetail/>}/>
          <Route path="/auth" element={<Home/>}/>
         
        

        
        </Routes>
        <Footer/>      
      </Router>
    
    </div>
    </>
  )
}

export default App
