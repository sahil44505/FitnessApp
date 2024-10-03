import React, { useState ,useEffect} from 'react';
import '../css/popup.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ToastContainer, toast } from 'react-toastify';
const Workout = ({ setShowExercisePopup }) => {
  const [date, setDate] = useState(dayjs(new Date()));
  const [time, setTime] = useState(dayjs(new Date()));
 
  const [Exercise, setExercise] = useState({
    
    date:'',
    exercise:'',
    durationInMinutes:''
})
  const [items, setItems] = useState([]);

  const handleSave = async() => {
    let tempdate = date.format("YYYY-MM-DD")
    let temptime = time.format("HH:mm:ss")
    let tempdatetime = tempdate + " " + temptime
    let finaldatetime = new Date(tempdatetime)
    
    const token = localStorage.getItem('token')
   
    console.log("Final DateTime:", finaldatetime);
   
    await fetch('http://localhost:8080/calorie/addworkoutentry', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      credentials:"include",
      body: JSON.stringify({
       
        date:finaldatetime,
        exercise:Exercise.exercise,
        durationInMinutes:Exercise.durationInMinutes
      })
  })
  .then(res => res.json())
  .then(data =>{
    console.log(data)
    if(data.ok){
     toast.success('Calorie Intake added successfully')
     getExercise()
    }
    else{
      toast.error("Error in adding calorie intake")
    }
  })
  .catch(e=>{
    toast.error("Error")
    console.log(e)
   
  })
   
  };
  const getExercise = async()=>{
    setItems([])
    const token = localStorage.getItem('token')
    await fetch('http://localhost:8080/calorie/getExercisebydate', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      credentials:"include",
      body: JSON.stringify({
       
        date:date,
        
      })
  })
  .then(res => res.json())
  .then(data =>{
    console.log(data)
    if(data.ok){
      console.log(data.data,'calorie intake data')
      setItems(data.data)
    }
    else{
      toast.error("Error in adding calorie intake")
    }
  })
  .catch(e=>{
    toast.error("Error")
    console.log(e)
   
  })
   
  }

  const handleDelete = async(item) => {
    // Handle delete logic here
 
    const token = localStorage.getItem('token')
    await fetch('http://localhost:8080/calorie/deleteExercise', {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      credentials:"include",
      body: JSON.stringify({
       
        date:date,
        item:item.item
        
      })
  })
  .then(res => res.json())
  .then(data =>{
    console.log(data)
    if(data.ok){
      toast.success('item deleted')
      getExercise()
    }
    else{
      toast.error("Error in deleting calorie intake")
    }
  })
  .catch(e=>{
    toast.error("Error")
    console.log(e)
   
  })
   
  };
  useEffect(() => {
 
    getExercise()
  }, [date])

  return (
    <div className='popupout'>
      <div className='popupbox'>
        <button
          className='close'
          onClick={() => setShowExercisePopup(false)}
        >
          <AiOutlineClose />
        </button>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={date}
            onChange={(newDate) => setDate(newDate)}
            renderInput={(params) => <TextField {...params} />}
            inputFormat="MM/DD/YYYY"
            className="custom-datepicker"
          />
          
          <TimePicker
            value={time}
            onChange={(newTime) => setTime(newTime)}
            renderInput={(params) => <TextField {...params} />}
            ampm={false}
          />
        </LocalizationProvider>

        <TextField
          id='food-name'
          label='Food item name'
          variant='outlined'
          color='warning'
      
          onChange={(e) => setExercise({...Exercise,item:e.target.value})}
        />
        
        <TextField
          id='food-amount'
          label='Food item amount (in gms)'
          variant='outlined'
          color='warning'
         
          onChange={(e) => setExercise({...Exercise,quantity:e.target.value})}
        />

        <Button variant='contained' color='warning' onClick={handleSave}>
          Save
        </Button>

        <div className='hrline'></div>

        <div className='items'>
          {items.map(item => (
            <div key={item.id} className='item'>
              <h3>{item.item}</h3>
              <h3>{item.quantity}</h3>
              <button onClick={() => handleDelete(item)}>
                <AiFillDelete />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workout;
