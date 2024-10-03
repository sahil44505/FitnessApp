import React, { useState } from 'react';
import './UserData.css';
import dayjs from 'dayjs';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { ToastContainer, toast, Bounce } from 'react-toastify';

const UserData = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        weightInKg: '',  // Keep as a string input
        heightInCm: '',  // Keep as a string input
        goal: '',
        gender: '',
        dob: new Date(),
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare the data to send
        const dataToSubmit = { 
            ...formData, 
            weightInKg: formData.weightInKg ? [{ date: new Date(), weight: parseFloat(formData.weightInKg) }] : [], // Convert weight to the desired format
            heightInCm: formData.heightInCm ? [{ date: new Date(), height: parseFloat(formData.heightInCm) }] : [] // Convert height to the desired format
        };

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        fetch('http://localhost:8080/user/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(dataToSubmit),
        })
        .then(response => response.json())
        .then(data => {
            toast.success('Success: ' + data.msg);
            // Reset form after submission
            setFormData({
                name: '',
                age: '',
                weightInKg: '', // Reset weight input
                heightInCm: '', // Reset height input
                goal: '',
                gender: '',
                dob: new Date(),
            });
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

                <label>Weight in kg</label>
                <Input
                    name="weightInKg"
                    color="neutral"
                    size="md"
                    variant="outlined"
                    type="text" // Set as text input
                    placeholder='Weight in kg'
                    value={formData.weightInKg} // Controlled input
                    onChange={(e) => setFormData({ ...formData, weightInKg: e.target.value })} // Update directly
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

                <label>Height in cm</label>
                <Input
                    name="heightInCm"
                    color="neutral"
                    size="md"
                    variant="outlined"
                    type="text" // Set as text input
                    placeholder='Height in cm'
                    value={formData.heightInCm} // Controlled input
                    onChange={(e) => setFormData({ ...formData, heightInCm: e.target.value })} // Update directly
                />

                <label>Date of Birth</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                        name="dob"
                        defaultValue={dayjs(new Date())}
                        sx={{ backgroundColor: 'white' }}
                        onChange={(newValue) => setFormData({ ...formData, dob: new Date(newValue) })}
                    />
                </LocalizationProvider>

                <button type="submit">Submit</button>
            </form>
            <ToastContainer transition={Bounce} />
        </div>
    );
};

export default UserData;
