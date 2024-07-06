import React from 'react'
import { Link } from 'react-router-dom'

const ExerciseCart = ({exercise}) => {
  return (
    <Link className='exercise-cart' to={`/exercise/${exercise.id}`}>
        <img src={exercise.gifUrl} alt={exercise.name} loading='lazy'/>
    
    <div className='exercise-button-sec'>
      <button className="exercise-button">
        {exercise.bodyPart}
      </button>
      <button className="exercise-button , new">
        {exercise.target}
      </button>
    </div>
    <div className='exercise-name'>
      {exercise.name}
    </div>
    </Link>
    
  )
}

export default ExerciseCart
