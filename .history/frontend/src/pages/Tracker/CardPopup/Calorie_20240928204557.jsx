import React, { useState } from 'react';
import '../css/popup.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const Calorie = ({ setShowCalorieIntakePopup }) => {
  const [date, setDate] = useState(dayjs(new Date()));
  const [time, setTime] = useState(dayjs(new Date()));
  const [foodName, setFoodName] = useState('');
  const [foodAmount, setFoodAmount] = useState('');
  const [items, setItems] = useState([
    { id: 1, name: 'Apple', amount: '100 gms' },
    { id: 2, name: 'Banana', amount: '200 gms' },
    { id: 3, name: 'Rice', amount: '300 gms' },
  ]);

  const handleSave = async() => {
    // Handle save logic here, e.g., add a new item to the list
   
  };
  const getcalorieIntake = async()=>{}

  const handleDelete = (id) => {
    // Handle delete logic here
    setItems(items.filter(item => item.id !== id));
  };
  useEffect(() => {
 
  getcalorieIntake()
  }, [date])

  return (
    <div className='popupout'>
      <div className='popupbox'>
        <button
          className='close'
          onClick={() => setShowCalorieIntakePopup(false)}
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
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
        />
        <TextField
          id='food-amount'
          label='Food item amount (in gms)'
          variant='outlined'
          color='warning'
          value={foodAmount}
          onChange={(e) => setFoodAmount(e.target.value)}
        />

        <Button variant='contained' color='warning' onClick={handleSave}>
          Save
        </Button>

        <div className='hrline'></div>

        <div className='items'>
          {items.map(item => (
            <div key={item.id} className='item'>
              <h3>{item.name}</h3>
              <h3>{item.amount}</h3>
              <button onClick={() => handleDelete(item.id)}>
                <AiFillDelete />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calorie;
