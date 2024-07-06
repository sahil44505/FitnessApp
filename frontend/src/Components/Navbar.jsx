import React from 'react'
import "../Components/Navbar.css"
import {Link} from "react-router-dom"
// import LogoF from "../assets/LogoF.jpg"
import pxfuel from "../assets/pxfuel.jpg"
const Navbar = () => {
  return (
    <div>
      <div className='navbar'>
      <div className='Roam'>
      <Link to="/">
      <img src={pxfuel} alt='Logo' style={{
            width: '67px',
            height: '40px',
            margin:' 2px' }}/>
      </Link>
       
      </div>
      
        <div className='Links'>
          <Link to="/" >Home</Link>
          <a href="#exercises" >Exercises</a>

           
        </div>
      
    </div>
    </div>
  )
}

export default Navbar
