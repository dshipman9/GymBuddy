import { Workout } from './types';
import './workoutCard.css'
import { calculateDuration } from './calculateDuration';
import { WorkoutModal } from './workoutModal';
import { useEffect, useState } from 'react';

export const WorkoutCard = ({ 
  id,
  exercises, 
  workTime, 
  restTime, 
  numberOfRounds, 
  completedAt 
}: Workout) => {
  const renderedExercises = Array.from(new Set(exercises)).join(', ');
  const workoutDurationInSeconds = calculateDuration(workTime, restTime, exercises, numberOfRounds)[2]
  const minutes = Math.floor(workoutDurationInSeconds / 60);
  const seconds = workoutDurationInSeconds % 60;
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleModalHide = () => {
    setShowModal(false);
  };

  return (
    <>
      <WorkoutModal
        id={id}
        visible={showModal}
        completedAt={completedAt}
        workTime={workTime}
        restTime={restTime}
        numberOfRounds={numberOfRounds}
        exercises={exercises}
        onHide={handleModalHide} />
      <div
      className='workoutCard'
      onClick={() => setShowModal(true)}
      >
        <div className='workoutCardTitle'>
          <h3 style={{ margin: '3px 0' }}>
            <i className='pi pi-calendar' />
            &nbsp;{completedAt}
          </h3>
          <h3 style={{ margin: '3px 0' }}>
            <i className='pi pi-stopwatch' />
            &nbsp;{minutes}:{seconds.toString().padStart(2, '0')}
          </h3>
        </div>
        <p style={{ margin: '3px 0' }}>
          {renderedExercises}
        </p>
      </div>
    </>
  );
}