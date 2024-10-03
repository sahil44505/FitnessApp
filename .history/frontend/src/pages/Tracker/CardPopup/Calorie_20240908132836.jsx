import React, { useState } from 'react';
import '../css/popup.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the date picker CSS
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const Calorie = ({ setShowCalorieIntakePopup }) => {
  const color = '#ffc20e';
  
  const [date, setDate] = useState(new Date());
  const [value, setValue] = useState(dayjs('2022-04-17T15:30'));

  return (
    <div className='popupout'>
      <div className='popupbox'>
        <button
          className='close'
          onClick={() => {
            setShowCalorieIntakePopup(false);
          }}
        >
          <AiOutlineClose />
        </button>

       
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="MMMM d, yyyy"
          className="custom-datepicker" // Add a custom class for additional styling if needed
        />

        <TextField id='outlined-basic' label='Food item name' variant='outlined' color='warning' />
        <TextField id='outlined-basic' label='Food item amount (in gms)' variant='outlined' color='warning' />

        <div className='timebox'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeClock value={value} onChange={(newValue) => setValue(newValue)} />
          </LocalizationProvider>
        </div>

        <Button variant='contained' color='warning'>
          Save
        </Button>

        <div className='hrline'></div>

        <div className='items'>
          <div className='item'>
            <h3>Apple</h3>
            <h3>100 gms</h3>
            <button>
              <AiFillDelete />
            </button>
          </div>

          <div className='item'>
            <h3>Banana</h3>
            <h3>200 gms</h3>
            <button>
              <AiFillDelete />
            </button>
          </div>

          <div className='item'>
            <h3>Rice</h3>
            <h3>300 gms</h3>
            <button>
              <AiFillDelete />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calorie;
