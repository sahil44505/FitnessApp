import React, { useEffect, useState } from 'react'
import { exerciseOptions,fetchData } from '../utils/fetchData'
import CardComponent from './CardComponent'
const SearchExercises = ({setExercises,bodyPart,setbodyPart}) => {
  const[search,setsearch]=useState('')

  
  const[bodyParts,setBodyParts]=useState([])
  useEffect(()=>{
    const fetchExercisesData = async()=>{
      const bodyPartsData = await fetchData('https://exercisedb.p.rapidapi.com/exercises/bodyPartList' ,exerciseOptions)
      console.log(bodyPartsData)
      setBodyParts(['all',...bodyPartsData])
    }
    fetchExercisesData();
  },[])


  const handlesearch = async() =>{
    if (search){
      const exercisesData = await fetchData(
        'https://exercisedb.p.rapidapi.com/exercises?limit=700&offset=0'
        ,exerciseOptions )
     const searchedExercises = exercisesData.filter(
      (exercise) => exercise.name.toLowerCase().includes(search)
      || exercise.name.toLowerCase().includes(search)
      || exercise.target.toLowerCase().includes(search)
      || exercise.equipment.toLowerCase().includes(search)
      || exercise.bodyPart.toLowerCase().includes(search)
     );
     setsearch('')
     setExercises(searchedExercises)
   
    }
  }
  return (
    <>
    
    <div className='search-container'>
      <div className='search-div'>
      <p className='search-para'>Awesome Exercises You should Know</p>
      </div>
      <input value={search} onChange={(e)=>{setsearch(e.target.value.toLowerCase())}} placeholder='Search Exercises' className='textfeild'/>
      <button  onClick={handlesearch} className='search-button'>Search</button>
      
    </div>
    <div className='card-container'>
      {/* <div className='card'> */}
      <CardComponent data={bodyParts} bodyPart={bodyPart} setbodyPart={setbodyPart}/>
      
    </div>
    </>
  )
}

export default SearchExercises
