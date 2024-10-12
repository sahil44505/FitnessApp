import React from 'react'
import HeroBanner from './HeroBanner'
import SearchExercises from './SearchExercises'
import Exercises from './Exercises'
import { useState, useEffect } from 'react'
import "./css/Home.css"

const Home = () => {
 
  

  const [exercises, setExercises] = useState([])
  const [bodyPart, setBodyPart] = useState('all')

  return (
    <div>
      <HeroBanner/>
      <SearchExercises 
      setExercises={setExercises}
      bodyPart={bodyPart}
      setbodyPart={setBodyPart}/>
      <Exercises
      setExercises={setExercises}
      bodyPart={bodyPart}
      exercises={exercises}/>
     

    </div>
  )
}

export default Home
