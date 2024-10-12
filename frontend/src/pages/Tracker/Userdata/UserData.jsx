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
import * as Yup from 'yup';

// Yup validation schema
const userDataSchema = Yup.object().shape({
    name: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "Name must not contain numbers")
        .required('Name is required'),
    age: Yup.number()
        .min(16, "You must be at least 16 years old")
        .required('Age is required'),
    weightInKg: Yup.number()
        .typeError('Weight must be a number')
        .required('Weight is required'),
    heightInCm: Yup.number()
        .typeError('Height must be a number')
        .required('Height is required'),
    dob: Yup.date()
        .max(dayjs().subtract(16, 'years'), 'You must be at least 16 years old')
        .required('Date of birth is required'),
});

const UserData = ({ setformSubmitted }) => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        weightInKg: '',
        heightInCm: '',
        goal: '',
        gender: '',
        dob: new Date(),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validate form data using Yup schema
            await userDataSchema.validate(formData);

            // Call setformSubmitted only if it's passed as a prop
            if (typeof setformSubmitted === 'function') {
                setformSubmitted(true);
            }

            const dataToSubmit = {
                ...formData,
                weightInKg: formData.weightInKg ? [{ date: new Date(), weight: parseFloat(formData.weightInKg) }] : [],
                heightInCm: formData.heightInCm ? [{ date: new Date(), height: parseFloat(formData.heightInCm) }] : [],
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
                .then((response) => response.json())
                .then((data) => {
                    toast.success('Success: ' + data.msg);
                    setFormData({
                        name: '',
                        age: '',
                        weightInKg: '',
                        heightInCm: '',
                        goal: '',
                        gender: '',
                        dob: new Date(),
                    });
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } catch (error) {
            toast.error(error.message); // Show error message
        }
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
                    type="text"
                    placeholder='Weight in kg'
                    value={formData.weightInKg}
                    onChange={(e) => setFormData({ ...formData, weightInKg: e.target.value })}
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
                    type="text"
                    placeholder='Height in cm'
                    value={formData.heightInCm}
                    onChange={(e) => setFormData({ ...formData, heightInCm: e.target.value })}
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
