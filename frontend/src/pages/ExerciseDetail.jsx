import React ,{useEffect,useState} from 'react'
import {useParams} from 'react-router-dom'
import { exerciseOptions , fetchData , youtubeOptions} from "../utils/fetchData"
import Details from '../Components/Details'
import ExerciseVideos from '../Components/ExerciseVideos'

const ExerciseDetail = () => {
  const [exerciseDetail, setexerciseDetail] = useState({});
  const [exerciseVideos, setexerciseVideos] = useState([])
  const { id } = useParams();
  useEffect(() => {
    const fetchExercisesData = async() => {
      const exerciseDbUrl = 'https://exercisedb.p.rapidapi.com'
      const youtubeSearchUrl = 'https://youtube-search-and-download.p.rapidapi.com'
      const exerciseDetailData = await fetchData(`${exerciseDbUrl}/exercises/exercise/${id}`,exerciseOptions)
      setexerciseDetail(exerciseDetailData)
      
      const exerciseVideosData = await fetchData(`${youtubeSearchUrl}/search?query=${exerciseDetailData.name}` ,youtubeOptions)
      setexerciseVideos(exerciseVideosData.contents)
     
    }

    fetchExercisesData()
  
  }, [id])
  return (
    <>
    <div>
      <Details exerciseDetail={exerciseDetail}/>
      <ExerciseVideos exerciseVideos = {exerciseVideos} name={exerciseDetail.name}/>

      
    </div>
    </>
  )
}

export default ExerciseDetail
