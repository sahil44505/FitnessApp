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
        weightInKg: [],
        heightInCm: [],
        goal: '',
        gender: '',
        dob: new Date(),
    });

    // Temporary state to hold current input values
    const [currentWeight, setCurrentWeight] = useState('');
    const [currentHeight, setCurrentHeight] = useState('');

    const handleWeightChange = (e) => {
        setCurrentWeight(e.target.value); // Set current weight input
    };

    const handleHeightChange = (e) => {
        setCurrentHeight(e.target.value); // Set current height input
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Only add the new weight and height when submitting
        if (currentWeight) {
            setFormData(prevData => ({
                ...prevData,
                weightInKg: [...prevData.weightInKg, { date: new Date(), weight: parseFloat(currentWeight) }]
            }));
        }

        if (currentHeight) {
            setFormData(prevData => ({
                ...prevData,
                heightInCm: [...prevData.heightInCm, { date: new Date(), height: parseFloat(currentHeight) }]
            }));
        }

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        // Prepare the data to send
        const dataToSubmit = { ...formData };

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
            // Reset form and states after submission
            setFormData({
                name: '',
                age: '',
                weightInKg: [],
                heightInCm: [],
                goal: '',
                gender: '',
                dob: new Date(),
            });
            setCurrentWeight(''); // Reset weight input
            setCurrentHeight(''); // Reset height input
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
                    value={currentWeight} // Controlled input
                    onChange={handleWeightChange} // Update only current weight
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
                    value={currentHeight} // Controlled input
                    onChange={handleHeightChange} // Update only current height
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
