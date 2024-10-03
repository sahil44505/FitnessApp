import {React, useEffect,useState}from 'react'
import CircularProgress from '@mui/joy/CircularProgress';
import {AiOutlineEye} from 'react-icons/ai'
import "./css/tracker.css"
const Trackcards = () => {
  const [data, setdata] = useState(0);
  const token = localStorage.getItem('token');
  const getData = async () => {
     await fetch('http://localhost:8080/report/getreport', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      credentials:"include"
  })
  .then(res => res.json())
  .then(data =>{
    console.log(data)
    if(data.ok){
      setdata(data.data)
    }
    else{
      setdata([])
    }
  })
  .catch(e=>{
    console.log(e)
    setdata([])
  })
  

  }
  useEffect(() => {
    getData()

  }, [])


  return (
    <>
    <h1 className='header'>Track</h1>
    <div className='cards-container'>
     
      {data && data.map((item, index) => {
        return (
          <div className='card' key={index}>
            <div className='card-header'>
              <div className='card-header-box'>
                <div className='card-header-box-name'>{item.name}</div>
                <div className='card-header-box-value'>{parseInt(item.value)} {item.unit}</div>
              </div>
              <div className='card-header-box'>
                <div className='card-header-box-name'>Target</div>
                <div className='card-header-box-value'>{parseInt(item.goal)} {item.goalUnit}</div>
              </div>
            </div>
            {console.log(item.value)}
            <CircularProgress
              color="success"
              determinate
              variant="soft"
              size="lg"
              value={
                (item.value / item.goal) * 100
              }

            ><div className='textincircle'>
                <span>{
                parseInt(item.value)
                  }</span>
                  <span className='hr-line'></span>
                  <span>{
                    parseInt(item.goal)
                  }</span>
              </div>
            </CircularProgress>
            <button
              onClick={() => {
                window.location.href = `/report/${item.name}`
              }}
            >Show Report <AiOutlineEye /></button>


          </div>
        )
      })
    }
    </div></>

      
   
  )
}

export default Trackcards
