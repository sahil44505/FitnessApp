import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';



const WorkoutDetail = () => {
    const { type } = useParams(); // Extracts 'type' from the URL
    const [workout, setworkout] = useState(null);
    const getworkout = async () => {
        let data = [{
            type: "Chest",
            imageUrl: "https://gymvisual.com/videos/19853-barbell-explosive-bench-press.html?search_query=barbell+bench+press&results=5",
            durationInMin: 30,
            exercises: [
                {
                    exercise: 'Flat Bench Press',
                    videoUrl: 'https://gymvisual.com/img/p/1/7/5/5/2/17552.gif',
                    sets: 3,
                    reps: 10,
                    rest: 60,
                    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.'
                },
                {
                    exercise: 'Incline Bench Press',
                    videoUrl: 'https://gymvisual.com/img/p/1/0/3/9/8/10398.gif',
                    sets: 3,
                    reps: 10,
                    rest: 60,
                    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.'

                },
                {
                    exercise: 'Decline Bench Press',
                    videoUrl: 'https://gymvisual.com/img/p/6/5/2/3/6523.gif',
                    sets: 3,
                    reps: 10,
                    rest: 60,
                    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.'

                }
            ]
        },
        {
            type: "Back",
            imageUrl:"https://gymvisual.com/videos/1382-barbell-deadlift.html",
            durationInMin: 35,
            exercises: [
                {
                    exercise: 'Deadlift',
                    videoUrl: "https://gymvisual.com/img/p/2/9/2/6/4/29264.gif",
                    sets: 4,
                    reps: 8,
                    rest: 90,
                    description: 'A full-body movement that strengthens the entire back.'
                },
                {
                    exercise: 'Bent Over Row',
                    videoUrl: 'https://gymvisual.com/img/p/1/0/6/1/7/10617.gif',
                    sets: 4,
                    reps: 10,
                    rest: 75,
                    description: 'Focuses on the lats and rhomboids for a wider back.'
                },
                {
                    exercise: ' Archer Pull-Up',
                    videoUrl: 'https://gymvisual.com/img/p/1/3/1/4/2/13142.gif',
                    sets: 3,
                    reps: 12,
                    rest: 60,
                    description: 'A bodyweight exercise that targets the upper back .'
                }
            ]
        },
        
        {
            type: 'Triceps',
            imageUrl: 'https://gymvisual.com/videos/19851-skull-crusher.html?search_query=skull+crusher&results=5',
            durationInMin: 25,
            exercises: [
                {
                    exercise: 'Assisted Dips',
                    videoUrl: 'https://gymvisual.com/img/p/1/0/2/8/7/10287.gif',
                    sets: 3,
                    reps: 10,
                    rest: 60,
                    description: 'A great tricep builder that emphasizes the long head of the muscle.'
                },
                {
                    exercise: 'Barbell Decline Pullover',
                    videoUrl: 'https://gymvisual.com/img/p/6/5/2/2/6522.gif',
                    sets: 3,
                    reps: 12,
                    rest: 60,
                    description: 'A barbell exercise that targets the triceps effectively.'
                },
                {
                    exercise: 'Knell Pushups',
                    videoUrl: 'https://gymvisual.com/img/p/2/2/8/6/3/22863.gif',
                    sets: 3,
                    reps: 10,
                    rest: 60,
                    description: 'Focuses on the long head of the triceps for overall development.'
                }
            ]
        },
        {
            type: 'Shoulder',
            imageUrl: 'https://gymvisual.com/videos/19845-barbell-military-press.html?search_query=military+press&results=5',
            durationInMin: 30,
            exercises: [
                {
                    exercise: 'Overhead Press',
                    videoUrl: 'https://gymvisual.com/img/p/4/8/2/0/4820.gif',
                    sets: 4,
                    reps: 8,
                    rest: 60,
                    description: 'Builds strength and size in the shoulders and upper chest.'
                },
                {
                    exercise: 'Upright rows',
                    videoUrl: 'https://gymvisual.com/img/p/2/4/9/6/2/24962.gif',
                    sets: 3,
                    reps: 12,
                    rest: 60,
                    description: 'Isolates the lateral head of the deltoid for broader shoulders.'
                },
                {
                    exercise: 'Rear Delt Raise',
                    videoUrl: 'https://gymvisual.com/img/p/4/8/0/6/4806.gif',
                    sets: 3,
                    reps: 12,
                    rest: 60,
                    description: 'Targets the rear deltoids for balanced shoulder development.'
                }
            ]
        },
        {
            type: 'Abs',
            imageUrl: 'https://gymvisual.com/videos/19859-plank.html?search_query=plank&results=5',
            durationInMin: 20,
            exercises: [
                {
                    exercise: '3/4 Situps',
                    videoUrl: 'https://gymvisual.com/img/p/4/7/3/1/4731.gif',
                    sets: 3,
                    reps: 'Hold for 1 min',
                    rest: 60,
                    description: 'Strengthens the core and improves overall stability.'
                },
                {
                    exercise: 'Alternate Heal Touchers',
                    videoUrl: 'https://gymvisual.com/img/p/1/4/6/6/0/14660.gif',
                    sets: 3,
                    reps: 20,
                    rest: 60,
                    description: 'Works the obliques and enhances core rotation strength.'
                },
                {
                    exercise: 'Leg Raise',
                    videoUrl: 'https://gymvisual.com/img/p/1/8/7/0/4/18704.gif',
                    sets: 3,
                    reps: 15,
                    rest: 60,
                    description: 'Targets the lower abs and improves core strength.'
                }
            ]
        },
        {
            type: 'Legs',
            imageUrl: 'https://gymvisual.com/videos/19834-barbell-squat.html?search_query=squat&results=5',
            durationInMin: 40,
            exercises: [
                {
                    exercise: 'Bulgarian Split Squat',
                    videoUrl: 'https://gymvisual.com/img/p/2/1/6/9/1/21691.gif',
                    sets: 4,
                    reps: 10,
                    rest: 90,
                    description: 'A fundamental exercise for building leg strength and muscle mass.'
                },
                {
                    exercise: 'Squats',
                    videoUrl: 'https://gymvisual.com/img/p/4/7/7/4/4774.gif',
                    sets: 4,
                    reps: 12,
                    rest: 75,
                    description: 'A fundamental exercise for building leg strength and muscle mass.'
                },
                {
                    exercise: 'Lunges',
                    videoUrl: 'https://gymvisual.com/img/p/2/1/6/6/1/21661.gif',
                    sets: 3,
                    reps: 12,
                    rest: 60,
                    description: 'Great for developing leg strength, balance, and coordination.'
                }
            ]
        },
        {
            type: 'Cardio',
            imageUrl: 'https://gymvisual.com/videos/19842-treadmill-run.html?search_query=treadmill+run&results=5',
            durationInMin: 30,
            exercises: [
                {
                    exercise: 'Treadmill Run',
                    videoUrl: 'https://gymvisual.com/img/p/1/8/6/8/8/18688.gif',
                    sets: 1,
                    reps: '30 min',
                    rest: 'N/A',
                    description: 'An excellent way to improve cardiovascular health and burn calories.'
                },
                {
                    exercise: 'Jump Rope',
                    videoUrl: 'https://gymvisual.com/img/p/2/2/9/8/7/22987.gif',
                    sets: 1,
                    reps: '15 min',
                    rest: 'N/A',
                    description: 'A full-body cardio workout that also improves coordination.'
                },
                {
                    exercise: 'Cycling',
                    videoUrl: 'https://gymvisual.com/img/p/1/8/4/4/3/18443.gif',
                    sets: 1,
                    reps: '30 min',
                    rest: 'N/A',
                    description: 'A low-impact cardio exercise that strengthens the legs and improves endurance.'
                }
            ]
        },
        {
            type: 'Forearms',
            imageUrl: 'https://gymvisual.com/videos/19844-barbell-wrist-curl.html?search_query=wrist+curl&results=5',
            durationInMin: 20,
            exercises: [
                {
                    exercise: 'Wrist Curl',
                    videoUrl: 'https://gymvisual.com/img/p/5/7/2/9/5729.gif',
                    sets: 3,
                    reps: 15,
                    rest: 60,
                    description: 'Strengthens the forearms and improves grip strength.'
                },
                {
                    exercise: 'Reverse Curl',
                    videoUrl: 'https://gymvisual.com/img/p/4/8/4/8/4848.gif',
                    sets: 3,
                    reps: 12,
                    rest: 60,
                    description: 'Targets both the forearms and biceps for balanced arm development.'
                },
                {
                    exercise: 'Brachiallis Pullups',
                    videoUrl: 'https://gymvisual.com/img/p/4/8/7/6/4876.gif',
                    sets: 3,
                    reps: 'Hold for 1 min',
                    rest: 60,
                    description: 'A full-body exercise that also enhances grip and forearm strength.'
                }
            ]
        }
        ]
        const selectedWorkout = data.find(w => w.type === type);


        setworkout(selectedWorkout);

    }
    useEffect(() => {
        getworkout()
    }, [])



    return (
        <div className='workout'>
            <h1 className='mainhead1'>{workout?.type} Day</h1>
            <div className='workout__exercises'>
                {
                    workout?.exercises.map((item, index) => (
                        <div key={index} className={index % 2 === 0 ? 'workout__exercise' : 'workout__exercise workout__exercise--reverse'}>
                            <h3>{index + 1}</h3>
                            <div className='workout__exercise__image'>
                                <img src={item.videoUrl} alt={item.exercise} />
                            </div>
                            <div className='workout__exercise__content'>
                                <h2>{item.exercise}</h2>
                                <span>{item.sets} sets X {item.reps} reps</span>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default WorkoutDetail;
