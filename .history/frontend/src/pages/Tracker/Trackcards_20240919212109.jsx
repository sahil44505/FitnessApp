import {React, useEffect,useState}from 'react'
import CircularProgress from '@mui/joy/CircularProgress';
import {AiOutlineEye} from 'react-icons/ai'
import "./css/tracker.css"
const Trackcards = () => {
  const [data, setdata] = useState(0);
  const getData = async () => {
    let temp = [
      {
        "name": "Calories Intake",
        "value": 2000,
        "unit": "kcal",
        "goal": 2500,
        "goalUnit": "kcal"
      },
     
      {
        "name": "Steps",
        "value": 5000,
        "unit": "steps",
        "goal": 10000,
        "goalUnit": "steps"
      },
     
      {
        "name": "Weight",
        "value": 50,
        "unit": "kg",
        "goal": 70,
        "goalUnit": "kg"
      },
      {
        "name": "Workout",
        "value": 3,
        "unit": "days",
        "goal": 6,
        "goalUnit": "days"
      }
    ]
    setdata(temp)
  }
  useEffect(() => {
    getData()

  }, [])
  function simplifyFraction(numerator, denominator){
    function gcd(a, b) {
      return b === 0 ? a : gcd(b, a % b);
    }
    const commonDivisor = gcd(numerator, denominator);

    // Simplify the fraction
    const simplifiedNumerator = numerator / commonDivisor;
    const simplifiedDenominator = denominator / commonDivisor;

    return [simplifiedNumerator, simplifiedDenominator];
  }

  return (
    <>
    <h1 className='header'>Track</h1>
    <div className='cards-container'>
     
      {data.length > 0 && data.map((item, index) => {
        return (
          <div className='card' key={index}>
            <div className='card-header'>
              <div className='card-header-box'>
                <div className='card-header-box-name'>{item.name}</div>
                <div className='card-header-box-value'>{item.value} {item.unit}</div>
              </div>
              <div className='card-header-box'>
                <div className='card-header-box-name'>Target</div>
                <div className='card-header-box-value'>{item.goal} {item.goalUnit}</div>
              </div>
            </div>
            <CircularProgress
              color="success"
              determinate
              variant="soft"
              size="lg"
              value={
                (item.value / item.goal) * 100
              }

            >   <span className='textincircle'>
                {
                  simplifyFraction(item.value, item.goal)[0] + ' / ' + simplifyFraction(item.value, item.goal)[1]
                }
              </span>
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
