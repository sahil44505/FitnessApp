import React from 'react'
import pxfuel from '../assets/pxfuel.jpg'
import goku2 from '../assets/goku2.png'
import LogoF from '../assets/LogoF.jpg'
const Details = ({ exerciseDetail }) => {
  const { bodyPart, gifUrl, name, target, equipment } = exerciseDetail;
  const extraDetail = [
    {

      icon: pxfuel,
      name: bodyPart,
    },
    {
      icon : goku2,
      name : target,
    },
    {
      icon : LogoF,
      name : equipment,
    },
  ]
  return (
    <>
      <div className='ex-detail'>
        <img src={gifUrl} alt={name} loading='lazy' className='detail-img' />
        <div className='img-detail'>
          <p className='img-para'>{name}</p>
          <p className='img-para-2'>Exercises keep you Strong. {name} {` `}  is one of the best exercises that target {target} the Best.It will help you improve your overall strength </p>
        </div>
      </div>
    </>
  )
}

export default Details
