import React from 'react'
import Trackcards from './Trackcards'
import Workouts from './Workouts'
import "./css/tracker.css"
import UserData from './Userdata/UserData'
const Tracker = () => {
  return (
    <div>
      <UserData isSubmitted={isSubmitted}/>
      <Trackcards isSubmitted={isSubmitted}/>
      <Workouts/>
    </div>
  )
}

export default Tracker
