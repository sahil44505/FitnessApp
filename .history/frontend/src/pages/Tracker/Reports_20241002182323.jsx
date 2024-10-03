import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import './css/reports.css';
import { AiFillEdit } from 'react-icons/ai';
import Calorie from './CardPopup/Calorie';
import { useLocation } from 'react-router-dom';
import 
const Reports = () => {
  const { pathname } = useLocation();
  console.log(pathname)
  const color = '#ffc20e';
  const chartsParams = { height: 300 };

  const [data10Days, setData10Days] = useState(null);
  const [data30Days, setData30Days] = useState(null);
  const [data365Days, setData365Days] = useState(null);
  const [dataAllTime, setDataAllTime] = useState(null);
  const [showCalorieIntakePopup, setShowCalorieIntakePopup] = useState(false);
  const [showStepsPopup, setshowStepsPopup] = useState(false)

  const getDataForS1 = async () => {
    if (pathname === '/report/Calorie%20Intake') {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:8080/calorie/getcalorieintakebylimit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          limit: 'all', // Fetch all data once
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            // Set data for each graph limit directly
            setDataForGraphs(data.data, 10, setData10Days);
            setDataForGraphs(data.data, 30, setData30Days);
            setDataForGraphs(data.data, 365, setData365Days);
            setDataForGraphs(data.data, 'all', setDataAllTime);
          } else {
            console.error('Error in fetching data');
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      console.error('Error in getting path');
    }
  };

  const setDataForGraphs = (data, limit, setStateFunc) => {
    const limitedData = limit === 'all' ? data : data.slice(0, limit);
    const temp = limitedData.map((item) => ({
      date: item.date,
      value: item.calorieIntake,
      unit: 'kcal',
    }));

    const dataForLineChart = temp.map((item) => item.value);
    const dataForXAxis = temp.map((item) => new Date(item.date));

    setStateFunc({
      data: dataForLineChart,
      title: `${limit === 'all' ? 'All Time' : `Last ${limit} Days`} Calorie Intake`,
      color,
      xAxis: {
        data: dataForXAxis,
        label: `${limit === 'all' ? 'All Time' : `Last ${limit} Days`}`,
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
        {data10Days && (
          <LineChart
            xAxis={[
              {
                id: 'Day',
                data: data10Days.xAxis.data,
                scaleType: data10Days.xAxis.scaleType,
                label: data10Days.xAxis.label,
                valueFormatter: (date) => date.toDateString().substring(4, 10),
              },
            ]}
            series={[
              {
                data: data10Days.data,
                label: data10Days.title,
                color: data10Days.color,
                area: true,
              },
            ]}
            {...chartsParams}
          />
        )}
      </div>

      <div className='s2'>
        {data30Days && (
          <LineChart
            xAxis={[
              {
                id: 'Day',
                data: data30Days.xAxis.data,
                scaleType: data30Days.xAxis.scaleType,
                label: data30Days.xAxis.label,
                valueFormatter: (date) => date.toDateString().substring(4, 10),
              },
            ]}
            series={[
              {
                data: data30Days.data,
                label: data30Days.title,
                color: data30Days.color,
              },
            ]}
            {...chartsParams}
          />
        )}
      </div>

      <div className='s3'>
        {data365Days && (
          <LineChart
            xAxis={[
              {
                id: 'Day',
                data: data365Days.xAxis.data,
                scaleType: data365Days.xAxis.scaleType,
                label: data365Days.xAxis.label,
                valueFormatter: (date) => date.toDateString().substring(4, 10),
              },
            ]}
            series={[
              {
                data: data365Days.data,
                label: data365Days.title,
                color: data365Days.color,
              },
            ]}
            {...chartsParams}
          />
        )}
      </div>

      <div className='s4'>
        {dataAllTime && (
          <LineChart
            xAxis={[
              {
                id: 'Day',
                data: dataAllTime.xAxis.data,
                scaleType: dataAllTime.xAxis.scaleType,
                label: dataAllTime.xAxis.label,
                valueFormatter: (date) => date.toDateString().substring(4, 10),
              },
            ]}
            series={[
              {
                data: dataAllTime.data,
                label: dataAllTime.title,
                color: dataAllTime.color,
              },
            ]}
            {...chartsParams}
          />
        )}
      </div>

      <button
        className='editbutton'
        onClick={() => {
          if (pathname === '/report/Calorie%20Intake') {
            setShowCalorieIntakePopup(true);
          }else if (pathname === '/report/Steps'){
            setshowStepsPopup(true)
          }
           else {
            alert('Path not found');
          }
        }}
      >
        <AiFillEdit />
      </button>

      {showCalorieIntakePopup && <Calorie setShowCalorieIntakePopup={setShowCalorieIntakePopup} />}
      {showStepsPopup && <Step setshowStepsPopup={setshowStepsPopup}/>}
    </div>
  );
};

export default Reports;
