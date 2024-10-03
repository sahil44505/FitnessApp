import React, { useState } from 'react';
import './UserData.css';
import dayjs from 'dayjs';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers';

const UserData = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        weightInKg: 0.0,
        heightInCm: 0.0,
        goal: '',
        gender: '',
        dob: new Date(),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
       
        localStorage.getItem('token')

        fetch('http://localhost:8080/user/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
           
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <div className='form-container'>
            <form className='user-form' onSubmit={handleSubmit}>
                <Input
                    name="name"
                    color="neutral"
                    placeholder="Name"
                    size="md"
                    variant="outlined"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                    name="age"
                    color="neutral"
                    placeholder="Age"
                    type='number'
                    size="md"
                    variant="outlined"
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />

                <Input
                    name="weightInKg"
                    color="neutral"
                    size="md"
                    variant="outlined"
                    type="number"
                    placeholder='Weight in kg'
                    onChange={(e) => setFormData({ ...formData, weightInKg: parseFloat(e.target.value) })}
                />

                <Select
                    name="goal"
                    color="neutral"
                    placeholder="Goal"
                    size="md"
                    variant="outlined"
                    onChange={(event, newValue) => setFormData({ ...formData, goal: newValue?.toString() || '' })}
                >
                    <Option value="weightLoss">Lose</Option>
                    <Option value="weightMaintain">Maintain</Option>
                    <Option value="weightGain">Gain</Option>
                </Select>

                <Select
                    name="gender"
                    color="neutral"
                    placeholder="Gender"
                    size="md"
                    variant="outlined"
                    onChange={(event, newValue) => setFormData({ ...formData, gender: newValue?.toString() || '' })}
                >
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                </Select>

                <label>Height</label>
                <Input
                    name="heightInCm"
                    color="neutral"
                    size="md"
                    variant="outlined"
                    type="number"
                    placeholder='cm'
                    onChange={(e) => setFormData({ ...formData, heightInCm: parseFloat(e.target.value) })}
                />

                <label>Date of Birth</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                        name="dob"
                        defaultValue={dayjs(new Date())}
                        sx={{ backgroundColor: 'white' }} /* You can keep this for specific styling */
                        onChange={(newValue) => setFormData({ ...formData, dob: new Date(newValue) })}
                    />
                </LocalizationProvider>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default UserData;
