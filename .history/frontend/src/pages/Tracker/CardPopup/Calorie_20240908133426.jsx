import React, { useState } from 'react';
import '../css/popup.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DatePicker from '@mui/x-date-pickers/DatePicker'; // Import DatePicker from MUI
import TimePicker from '@mui/x-date-pickers/TimePicker'; // Import TimePicker from MUI
import 'react-datepicker/dist/react-datepicker.css'; // Import the date picker CSS
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const Calorie = ({ setShowCalorieIntakePopup }) => {
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(dayjs()); // Use dayjs for time

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
            ampm={false} // Use 24-hour format; remove this line if you want 12-hour format
          />
        </LocalizationProvider>

        <TextField id='outlined-basic' label='Food item name' variant='outlined' color='warning' />
        <TextField id='outlined-basic' label='Food item amount (in gms)' variant='outlined' color='warning' />

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
