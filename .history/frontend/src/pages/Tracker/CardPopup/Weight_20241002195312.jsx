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
const Weight = ({setshowWeightPopup }) => {
  const [date, setDate] = useState(dayjs(new Date()));
  const [time, setTime] = useState(dayjs(new Date()));
 
  const [Weight, setWeight] = useState({
   
    date:'',
    weight:'',
    
})
  const [items, setItems] = useState([]);

  const handleSave = async() => {
    let tempdate = date.format("YYYY-MM-DD")
    let temptime = time.format("HH:mm:ss")
    let tempdatetime = tempdate + " " + temptime
    let finaldatetime = new Date(tempdatetime)
    
    const token = localStorage.getItem('token')
   
    console.log("Final DateTime:", finaldatetime);
    console.log(Weight.weight)
   
    await fetch('http://localhost:8080/weight/addweightentry', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      credentials:"include",
      body: JSON.stringify({
       
        date:finaldatetime,
        weight:weight,
       
      })
  })
  .then(res => res.json())
  .then(data =>{
    console.log(data)
    if(data.ok){
     toast.success('Weight entry added successfully')
     getWeight()
    }
    else{
      toast.error("Error in adding Weight entry")
    }
  })
  .catch(e=>{
    toast.error("Error")
    console.log(e)
   
  })
   
  };
  const getWeight = async()=>{
    setItems([])
    const token = localStorage.getItem('token')
    await fetch('http://localhost:8080/weight/getweightbydate', {
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
      console.log(data.data,'Weight data')
      setItems(data.data)
    }
    else{
      toast.error("Error in getting Weight")
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
    await fetch('http://localhost:8080/weight/deleteweightentry', {
      method: 'DELETE',
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
      toast.success('weight entry deleted')
      getWeight()
    }
    else{
      toast.error("Error in deleting Weight")
    }
  })
  .catch(e=>{
    toast.error("Error")
    console.log(e)
   
  })
   
  };
  useEffect(() => {
 
    getWeight()
  }, [date])

  return (
    <div className='popupout'>
      <div className='popupbox'>
        <button
          className='close'
          onClick={() =>setshowWeightPopup(false)}
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
          id='Weight'
          label=' Weight '
          variant='outlined'
          color='warning'
         
          onChange={(e) => setWeight({...Weight,weight:e.target.value})}
        />

        <Button variant='contained' color='warning' onClick={handleSave}>
          Save
        </Button>

        <div className='hrline'></div>

        <div className='items'>
          {items.map(item => (
            <div key={item.id} className='item'>
              <h3>{item.item}</h3>
              <h3>{item.Weight}</h3>
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

export default Weight;
