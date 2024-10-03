import React from 'react'
import goku2 from "../assets/goku2.png"
import '../pages/css/Home.css'
import '../../src/App.css'


const HeroBanner = () => {

  
   
  return (
    <>
    <div className ="hero-div">
      <img src={goku2} alt="Goku" style={{
            height:' 90vh',
            width: ' 100%',
      }}></img>
      <p className="hero-para">Fitness Freak</p>
      <div className='hero-text'>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore molestiae necessitatibus natus libero quam dicta ratione amet pariatur animi a!</p>
      </div>
      <button className='hero-button' onClick={}>Explore Exercises</button>
      
      

    </div>
    <div className='line'></div>
    </>
  )
}

export default HeroBanner
