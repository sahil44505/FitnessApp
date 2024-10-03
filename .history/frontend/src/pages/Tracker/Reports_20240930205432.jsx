import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import './css/reports.css';
import { AiFillEdit } from 'react-icons/ai';
import Calorie from "./CardPopup/Calorie"
import { useLocation } from 'react-router-dom';
const Reports = () => {
  const { pathname } = useLocation();
  console.log(pathname)
  const color = '#ffc20e';

  const chartsParams = {
    height: 300,
    
  };

  const [dataS1, setDataS1] = useState(null);
  const [showCalorieIntakePopup, setShowCalorieIntakePopup] = useState(false);

  const getDataForS1 = async () => {
    const token = localStorage.getItem('token')
    await fetch('http://localhost:8080/calorie/getcalorieintakebydate', {
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
      toast.error("Data added")
      setItems(data.data)
    }
    else{
      toast.error("Error in adding data in graph ")
    }
  })
  .catch(e=>{
    toast.error("Error")
    console.log(e)
   
  })
    // let temp = [
    //   {
    //     date: 'Thu Sep 28 2023 20:30:30 GMT+0530 (India Standard Time)',
    //     value: 2000,
    //     unit: 'kcal',
    //   },
    //   {
    //     date: 'Wed Sep 27 2023 20:30:30 GMT+0530 (India Standard Time)',
    //     value: 2500,
    //     unit: 'kcal',
    //   },
    //   {
    //     date: 'Tue Sep 26 2023 20:30:30 GMT+0530 (India Standard Time)',
    //     value: 2700,
    //     unit: 'kcal',
    //   },
    //   {
    //     date: 'Mon Sep 25 2023 20:30:30 GMT+0530 (India Standard Time)',
    //     value: 3000,
    //     unit: 'kcal',
    //   },
    //   {
    //     date: 'Sun Sep 24 2023 20:30:30 GMT+0530 (India Standard Time)',
    //     value: 2000,
    //     unit: 'kcal',
    //   },
    //   {
    //     date: 'Sat Sep 23 2023 20:30:30 GMT+0530 (India Standard Time)',
    //     value: 2300,
    //     unit: 'kcal',
    //   },
    //   {
    //     date: 'Fri Sep 22 2023 20:30:30 GMT+0530 (India Standard Time)',
    //     value: 2500,
    //     unit: 'kcal',
    //   },
    //   {
    //     date: 'Thu Sep 21 2023 20:30:30 GMT+0530 (India Standard Time)',
    //     value: 2700,
    //     unit: 'kcal',
    //   },
    // ];

    // let dataForLineChart = temp.map((item) => {
    //   let val = JSON.stringify(item.value);
    //   return val;
    // });

    // // let dataForXAxis = temp.map((item) => {
    // //   let val = new Date(item.date);
    // //   return val;
    // // });
    // let dataForXAxis = temp.map((item) => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    // let dataForLineChart = temp.map((item) => {
    //   return item.value; // Ensure these are numbers
    // });

    // let dataForXAxis = temp.map((item) => {
    //   return new Date(item.date); // Convert strings to Date objects
    // });
    // console.log({
    //   data: dataForLineChart,
    //   title: '1 Day Calorie Intake',
    //   color: color,
    //   xAxis: {
    //     data: dataForXAxis,
    //     label: 'Last 10 Days',
    //     scaleType: 'time',
    //   },
    // });

    setDataS1({
      data: dataForLineChart,
      title: '1 Day Calorie Intake',
      color: color,
      xAxis: {
        data: dataForXAxis,
        label: 'Last 10 Days',
        scaleType: 'time',
      },
    });
  };

  useEffect(() => {
    getDataForS1();
  }, []);

  return (
    <div className='reportpage'>
      <div className='s1'>
        {dataS1 && (
          
          <LineChart
            xAxis={[
              {
                id: 'Day',
                data: dataS1.xAxis.data,
                scaleType: dataS1.xAxis.scaleType,
                label: dataS1.xAxis.label,
                valueFormatter: (date) => date.toDateString().substring(4, 10),
              },
            ]}
            series={[
              {
                data: dataS1.data,
                label: dataS1.title,
                color: dataS1.color,
              },
            ]}
            {...chartsParams}
          />
        )}
      </div>

      <div className='s2'>
        {dataS1 && (
          <LineChart
            xAxis={[
              {
                id: 'Day',
                data: dataS1.xAxis.data,
                scaleType: dataS1.xAxis.scaleType,
                label: dataS1.xAxis.label,
                valueFormatter: (date) => date.toDateString().substring(4, 10),
              },
            ]}
            series={[
              {
                data: dataS1.data,
                label: dataS1.title,
                color: dataS1.color,
              },
            ]}
            {...chartsParams}
          />
        )}
      </div>

      <div className='s3'>
        {dataS1 && (
          <LineChart
            xAxis={[
              {
                id: 'Day',
                data: dataS1.xAxis.data,
                scaleType: dataS1.xAxis.scaleType,
                label: dataS1.xAxis.label,
                valueFormatter: (date) => date.toDateString().substring(4, 10),
              },
            ]}
            series={[
              {
                data: dataS1.data,
                label: dataS1.title,
                color: dataS1.color,
              },
            ]}
            {...chartsParams}
          />
        )}
      </div>

      <div className='s4'>
        {dataS1 && (
          <LineChart
            xAxis={[
              {
                id: 'Day',
                data: dataS1.xAxis.data,
                scaleType: dataS1.xAxis.scaleType,
                label: dataS1.xAxis.label,
                valueFormatter: (date) => date.toDateString().substring(4, 10),
              },
            ]}
            series={[
              {
                data: dataS1.data,
                label: dataS1.title,
                color: dataS1.color,
              },
            ]}
            {...chartsParams}
          />
        )}
      </div>

      <button
        className='editbutton'
        onClick={() => {
          if (pathname =='/report/Calorie%20Intake'){
          setShowCalorieIntakePopup(true)
        }else{
          alert("Path not found")
        }
      }}
      >
        <AiFillEdit />
      </button>

      {showCalorieIntakePopup && (
        <Calorie setShowCalorieIntakePopup={setShowCalorieIntakePopup} />
      )}
    </div>
  );
};

export default Reports;
