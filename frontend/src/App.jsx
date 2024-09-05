
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ExerciseDetail from './pages/ExerciseDetail'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Tracker from './pages/Tracker/Tracker'
import WorkoutDetail from './pages/Tracker/WorkoutDetail'
import Reports from './pages/Tracker/Reports'
function App() {
  console.log(import.meta.env)
  

  return (
    <>
      <div className='App'>
    
      <Router>
        <Navbar/>

        <Routes>
        <Route path="/" element={<Home/>} />
          <Route path="/exercise/:id" element={<ExerciseDetail/>}/>
          <Route path="/auth" element={<Home/>}/>
          <Route path="/Shop" element={<Shop/>}/>
          <Route path="/Cart" element={<Cart/>}/>
          <Route path="/tracker" element={<Tracker/>}/>
          <Route path="/workout/:type" element={<WorkoutDetail/>}/>
          <Route path="/report/:itemname" element={<Reports/>}/>
         
        

        
        </Routes>
        <Footer/>      
      </Router>
    
    </div>
    </>
  )
}

export default App
