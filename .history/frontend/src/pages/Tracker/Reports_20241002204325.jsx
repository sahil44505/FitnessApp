import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import './css/reports.css';
import { AiFillEdit } from 'react-icons/ai';
import Calorie from './CardPopup/Calorie';
import { useLocation } from 'react-router-dom';
import Step from './CardPopup/Step';
import Weight from './CardPopup/Weight';
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
  const [showWeightPopup, setshowWeightPopup] = useState(false)
  const [showWorkoutPopup, setshowWorkoutPopup] = useState(false)

  const getDataForS1 = async () => {
    const token = localStorage.getItem('token');
    let url = '';

    if (pathname === '/report/Calorie%20Intake') {
      url = 'http://localhost:8080/calorie/getcalorieintakebylimit';
    } else if (pathname === '/report/Steps') {
      url = 'http://localhost:8080/step/getstepsbylimit';
    } else if(pathname==="/report/Weight"){
      url = "http://localhost:8080/weight/getweightbylimit";
    }else if(pathname==="/report/Workout"){
      url = "http://localhost:8080/workout/getworkoutsbylimit";
    }else {
      console.error('Error in getting path');
      return;
    }

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({ limit: 'all' }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data)
        if (data.ok) {
          // Handle calorie intake and steps separately
          if (pathname === '/report/Calorie%20Intake') {
            // Calorie Intake data handling
            setDataForCalorieGraphs(data.data, 10, setData10Days);
            setDataForCalorieGraphs(data.data, 30, setData30Days);
            setDataForCalorieGraphs(data.data, 365, setData365Days);
            setDataForCalorieGraphs(data.data, 'all', setDataAllTime);
          } else if (pathname === '/report/Steps') {
            // Steps data handling
            setDataForStepsGraphs(data.data, 10, setData10Days);
            setDataForStepsGraphs(data.data, 30, setData30Days);
            setDataForStepsGraphs(data.data, 365, setData365Days);
            setDataForStepsGraphs(data.data, 'all', setDataAllTime);
          } else if (pathname === '/report/Weight') {
            
            setDataForWeightsGraphs(data.data, 10, setData10Days);
            setDataForWeightsGraphs(data.data, 30, setData30Days);
            setDataForWeightsGraphs(data.data, 365, setData365Days);
            setDataForWeightsGraphs(data.data, 'all', setDataAllTime);
          }else if(pathname==="/report/Workout"){
            setDataForWorkoutsGraphs(data.data, 10, setData10Days);
            setDataForWorkoutsGraphs(data.data, 30, setData30Days);
            setDataForWorkoutsGraphs(data.data, 365, setData365Days);
            setDataForWorkoutsGraphs(data.data, 'all', setDataAllTime);

          }
        } else {
          console.error('Error in fetching data');
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  // Function to set data for calorie intake graphs
  const setDataForCalorieGraphs = (data, limit, setStateFunc) => {
    const limitedData = limit === 'all' ? data : data.slice(0, limit);
    const temp = limitedData.map((item) => ({
      date: item.date,
      value: item.calorieIntake, // Calorie intake value
      unit: 'kcal',
    }));

    const dataForLineChart = temp.map((item) => item.value);
    const dataForXAxis = temp.map((item) => new Date(item.date));

    setStateFunc({
      data: dataForLineChart,
      title: `${limit === 'all' ? 'All Time' : `Last ${limit} Days`} `,
      color,
      xAxis: {
        data: dataForXAxis,
        label: `${limit === 'all' ? 'All Time' : `Last ${limit} Days`}`,
        scaleType: 'time',
      },
    });
  };

  // Function to set data for steps graphs
  const setDataForStepsGraphs = (data, limit, setStateFunc) => {
    const limitedData = limit === 'all' ? data : data.slice(0, limit);
    const temp = limitedData.map((item) => ({
      date: item.date,
      value: item.steps, // Steps count value
      unit: 'steps',
    }));

    const dataForLineChart = temp.map((item) => item.value);
    const dataForXAxis = temp.map((item) => new Date(item.date));

    setStateFunc({
      data: dataForLineChart,
      title: `${limit === 'all' ? 'All Time' : `Last ${limit} Days`} `,
      color,
      xAxis: {
        data: dataForXAxis,
        label: `${limit === 'all' ? 'All Time' : `Last ${limit} Days`}`,
        scaleType: 'time',
      },
    });
  };
  const setDataForWeightsGraphs = (data, limit, setStateFunc) => {
    const limitedData = limit === 'all' ? data : data.slice(0, limit);
    const temp = limitedData.map((item) => ({
      date: item.date,
      value: item.weight, // Steps count value
      unit: 'kg',
    }));

    const dataForLineChart = temp.map((item) => item.value);
    const dataForXAxis = temp.map((item) => new Date(item.date));
    console.log("X-axis data:", dataForXAxis);
    console.log("Y-axis data:", dataForLineChart);
  
  
    setStateFunc({
      data: dataForLineChart,
      title: `${limit === 'all' ? 'All Time' : `Last ${limit} Days`} `,
      color,
      xAxis: {
        data: dataForXAxis,
        label: `${limit === 'all' ? 'All Time' : `Last ${limit} Days`}`,
        scaleType: 'time',
      },
    });
  };
  const setDataForWorkoutsGraphs = (data, limit, setStateFunc) => {
    const limitedData = limit === 'all' ? data : data.slice(0, limit);
    const temp = limitedData.map((item) => ({
      date: item.date,
      value: item.workouts, // Calorie intake value
      unit: 'kcal',
    }));

    const dataForLineChart = temp.map((item) => item.value);
    const dataForXAxis = temp.map((item) => new Date(item.date));

    setStateFunc({
      data: dataForLineChart,
      title: `${limit === 'all' ? 'All Time' : `Last ${limit} Days`} `,
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
  }, [pathname]);

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
          }else if(pathname == "/report/Weight"){
            setshowWeightPopup(true)
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
      {showWeightPopup && <Weight setshowWeightPopup={setshowWeightPopup}/>}
      {showWorkoutPopup && <Workout setshowWorkoutPopup = {setshowWorkoutPopup}/>}
     
    </div>
  );
};

export default Reports;
