import React from 'react'
import BodyPart from './BodyPart'

const CardComponent = ({ data, bodyPart, setbodyPart }) => {

  return (
    <div className='card-container'>

      {data.map((item) => (

        <div className='card'
          onClick={
            () => {

              setbodyPart(item)
              window.scrollTo({ top: 1800, left: 100, behavior: 'smooth' })
            }}
          key={item.id || item}
          itemId={item.id || item}
          title={item.id || item}>
          <BodyPart item={item} bodyPart={bodyPart} setbodyPart={setbodyPart} />

        </div>
      ))}


    </div>
  )

}

export default CardComponent
