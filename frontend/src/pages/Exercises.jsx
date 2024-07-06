import {React,useEffect,useState} from 'react'
import {Stack , Pagination} from '@mui/material'
import ExerciseCart from '../Components/ExerciseCart'
import { fetchData , exerciseOptions } from '../utils/fetchData';
const Exercises = ({ exercises , setExercises , bodyPart}) => {
  const [currentPage, setcurrentPage] = useState(1);
  const exercisesPerPage = 9;
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = exercises.slice(indexOfFirstExercise,indexOfLastExercise)
  const paginate = (e,value) =>{
    setcurrentPage(value)
    window.scrollTo({top:1800,behavior:'smooth'})

  }
  useEffect(() => {
    const fetchExercisesData = async()=>{
      let exercisesData = [];
      if (bodyPart === "all"){
        exercisesData = await fetchData(
          'https://exercisedb.p.rapidapi.com/exercises?limit=700&offset=0'
          ,exerciseOptions )
      }else{
        exercisesData =  await fetchData(
          `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`
          ,exerciseOptions )
      }
      setExercises(exercisesData)
    }
    
    fetchExercisesData();
  }, [bodyPart]);

  console.log(exercises)
  return (
    <div id="exercises">
      <p id="show">Showing Results</p>
      <div className='exercises-container'>
        {currentExercises.map((exercise,index) =>(
         <ExerciseCart key={index} exercise={exercise}/>
        ))}

      </div>
      <Stack mt="100px" alignItems = "center">
        {exercises.length > 9 && (
          <Pagination 
          color="standard"
          shape="rounded"
          count={Math.ceil(exercises.length /exercisesPerPage)}
          page={currentPage}
          onChange={paginate}
          size='large'/>
        )}

      </Stack>
    </div>
  )
}

export default Exercises
