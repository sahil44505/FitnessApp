import React from 'react'

const Exercisevideos = ({exerciseVideos , name}) => {
 console.log(exerciseVideos)
  return (
    <>
    <div className='ex-vid'>
      <p className='ex-vid-para'>
        Watch <span style={{color : '#ff2625',textTransform:'capitalize'}}>{name}</span> exercise on Youtube
      </p>
      <div className='ex-vid-videos'>
        {exerciseVideos?.slice(0,3).map((item,index)=>(
        
          <a 
          key={index}
          className='ex_vid'
          href={`https://www.youtube.com/watch?v=${item.video.videoId}`}
          target='_blank'
          rel='noreferrer'>
            <img src={item.video.thumbnails[0].url} alt={item.video.title}/>
            
          </a>
        ))}
      </div>
      
    </div>
    </>
  )
}

export default Exercisevideos
