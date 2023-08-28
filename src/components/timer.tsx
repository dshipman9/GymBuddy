import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { CreateWorkoutMutation } from '../API';
import { GraphQLQuery } from '@aws-amplify/api';
import { createWorkout } from '../graphql/mutations';

interface CircleGraphicProps {
  progress: number;
  secondsRemaining?: number;
}

export const CircleGraphic: React.FC<CircleGraphicProps> = ({ progress, secondsRemaining }) => {
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <svg width="300" height="300">
      <circle
        cx="150"
        cy="150"
        r={radius}
        fill="none"
        stroke="#2c6dce"
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text x="150" y="170" textAnchor="middle" fill="white" fontSize="75">
        {secondsRemaining}
      </text>
    </svg>
  );
};

interface WorkoutTimerProps {
  userId: string | undefined;
  numberOfRounds: number;
  exercises: string[];
  workTime: number;
  restTime: number;
  isPaused: boolean;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
    userId,
    numberOfRounds,
    exercises,
    workTime,
    restTime,
    isPaused,
  }) => {
  const calculateTimeLeft = () => {
    const totalTimeInSeconds = (((workTime + restTime + 2) * exercises.length * numberOfRounds) - restTime - (exercises.length));
    const currentTime = new Date().getTime();
    const endTime = currentTime + totalTimeInSeconds * 1000;
    const timeLeft = endTime - currentTime;

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(workTime * 1000);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [isWorking, setIsWorking] = useState(true);
  const [workoutDuration, setWorkoutDuration] = useState(calculateTimeLeft());
  const [isTimerPaused, setIsTimerPaused] = useState(isPaused);
  const navigate = useNavigate()
  useEffect(() => {
    const postWorkout = async () => {
      try {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString("en-GB");
        const input = {
          userId: userId,
          exercises: exercises,
          workTime: workTime,
          restTime: restTime,
          numberOfRounds: numberOfRounds,
          completedAt: formattedDate
        };
        await API.graphql<GraphQLQuery<CreateWorkoutMutation>>(graphqlOperation(createWorkout, { input }));
      } catch (error) {
        console.error('Error posting workout:', error);
      }
    };
    if (timeLeft < 0) {
      if (isWorking) {
        if (currentExercise === exercises.length - 1) {
          if (currentRound === numberOfRounds) {
            postWorkout();
            navigate('/workout-complete', {state: {numberOfRounds, exercises, workTime, restTime}});
            return;
          } else {
            setCurrentRound(currentRound + 1);
            setCurrentExercise(0);
          }
        } else {
          setCurrentExercise(currentExercise + 1);
        }
      }
  
      setIsWorking(!isWorking);
      setTimeLeft(isWorking ? restTime * 1000 : workTime * 1000);
    }
  
    const playBeepSound = (long: boolean) => {
      let beepSound;
      if (long) {
        beepSound = new Audio(require('../assets/long_beep.mp3'));
      } else {
        beepSound = new Audio(require('../assets/short_beep.mp3'));
      }
      beepSound.play();
    }
    
    const interval = setInterval(() => {
      if (!isPaused) {
        setTimeLeft(prevTimeLeft => {
          if (prevTimeLeft <= 4000 && prevTimeLeft > 1000) {
            playBeepSound(false);
          } else if (prevTimeLeft === 1000) {
            playBeepSound(true);
          }
          return prevTimeLeft - 1000;
        });
        setWorkoutDuration(prevWorkoutDuration => {
          return prevWorkoutDuration - 1000;
        });
      }
    }, 1000);
  
    return () => {
      clearInterval(interval);
    };
  }, [timeLeft, isWorking, currentExercise, currentRound, isPaused]);
  

  const displayWorkoutDuration = () => {
    const minutes = Math.floor(workoutDuration / 60000);
    const seconds = (workoutDuration % 60000) / 1000;
    return (<h1>{minutes}:{seconds.toString().padStart(2, '0')}</h1>);
  };

  const handleTimerClick = () => {
    setIsTimerPaused(prevPaused => !prevPaused);
  };

  return (
    <div className='timer' onClick={handleTimerClick}>
      <div className="workoutDisplay">
        <h1>Round {currentRound}</h1>
        <h2>{isWorking ? exercises[currentExercise] : 'Rest!'}</h2>
        <CircleGraphic progress={timeLeft / ((isWorking ? workTime : restTime) * 1000)} secondsRemaining={timeLeft / 1000}/>
        <div>{displayWorkoutDuration()}</div>
      </div>
    </div>
  );
};

export default WorkoutTimer;
