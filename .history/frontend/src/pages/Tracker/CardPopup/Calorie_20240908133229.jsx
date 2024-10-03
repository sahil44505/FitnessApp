import React, { useState } from 'react';
import '../css/popup.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Use the horizontal date picker from MUI
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const Calorie = ({ setShowCalorieIntakePopup }) => {
  const [date, setDate] = useState(dayjs());
  const [value, setValue] = useState(dayjs('2022-04-17T15:30'));

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
            selected={date}
            onChange={(newDate) => setDate(newDate)}
            renderInput={(params) => <TextField {...params} />}
            inputFormat="MM/DD/YYYY" // Format the date picker
            className="custom-datepicker" // Add custom styles if needed
          />
        </LocalizationProvider>

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
