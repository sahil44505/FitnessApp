import React from 'react'
import HeroBanner from './HeroBanner'
import SearchExercises from './SearchExercises'
import Exercises from './Exercises'
import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const Home = () => {
 
  

  const [exercises, setExercises] = useState([])
  const [bodyPart, setBodyPart] = useState('all')

  return (
    <div>
      {/* <HeroBanner/>
      <SearchExercises 
      setExercises={setExercises}
      bodyPart={bodyPart}
      setbodyPart={setBodyPart}/>
      <Exercises
      setExercises={setExercises}
      bodyPart={bodyPart}
      exercises={exercises}/>
      */}

    </div>
  )
}

export default Home