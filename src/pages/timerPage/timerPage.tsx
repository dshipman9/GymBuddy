import React, { useEffect, useRef, useState } from 'react';
import WorkoutTimer, { CircleGraphic } from '../../components/timer';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Workout } from '../../types';

function TimerPage() {
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [exercises, setExercises] = useState<Array<String>>([])
  const [workTime, setWorkTime] = useState<number>();
  const [restTime, setRestTime] = useState<number>();
  const [numberOfRounds, setNumberOfRounds] = useState<number>();
  const [workout, setWorkout] = useState<Workout>();
  const [workoutComplete, setWorkoutComplete] = useState<boolean>(false);
  const countdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const location = useLocation();

  const handleCancelWorkoutClick = () => {
    setShowConfirmCancel(true)
    // workout?.stopTimer()
  };

  const handleConfirmCancelWorkoutClick = () => {
    setShowConfirmCancel(false)
    setExercises([]);
    setWorkTime(undefined);
    setRestTime(undefined);
    setNumberOfRounds(undefined);
    // workout?.stopTimer();
    navigate('/');
  }

  const returnHome = () => {
    navigate('/');
  }

  const renderFooter = () => {
    return (
        <div>
            <Button label="No" icon="pi pi-times" onClick={() => {setShowConfirmCancel(false); }} className="p-button-text" />
            <Button label="Yes" icon="pi pi-check" onClick={() => handleConfirmCancelWorkoutClick()} autoFocus />
        </div>
    );
  }
  
  const buttonLabel = workoutComplete ? 'Home' : 'Cancel';

  return (
    <>
      {!workoutComplete && 
      <Dialog header="Cancel workout?" visible={showConfirmCancel} style={{ width: '80%' }} footer={renderFooter()} onHide={() => setShowConfirmCancel(false)}>
        <p>Are you sure you want to end this workout early?</p>
      </Dialog>}
      <header className="App-header">
        <div className='headerButtons'>
          <Button onClick={workoutComplete ? returnHome : handleCancelWorkoutClick}
            icon={`pi ${workoutComplete ? 'pi-home' : 'pi-times'}`}
            label={buttonLabel} />
        </div>
      </header>
      <div ref={countdownRef} id='countdown' className='timer'>
        <WorkoutTimer numberOfRounds={location.state.numberOfRounds as number} workTime={location.state.workTime as number} restTime={location.state.restTime as number} exercises={location.state.exercises as string[]}/>
      </div>
    </>
  );
}

export default TimerPage;