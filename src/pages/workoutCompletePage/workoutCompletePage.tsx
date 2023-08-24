import { Button } from 'primereact/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { calculateDuration } from '../../calculateDuration';
import './workoutCompletePage.css';
import { Motion, spring } from 'react-motion';
import { WorkoutInfo } from '../../components/workoutInfo/workoutInfo';

export const WorkoutCompletePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const numberOfRounds = location.state.numberOfRounds;
  const exercises = location.state.exercises;
  const restTime = location.state.restTime;
  const workTime = location.state.workTime
  const workoutDurationInSeconds = calculateDuration(workTime, restTime, exercises, numberOfRounds)[2]
  const minutes = Math.floor(workoutDurationInSeconds / 60);

  const returnHomeClick = () => {
    navigate('/');
  }

  return (
    <Motion defaultStyle={{ y: -100 }} style={{ y: spring(0, { stiffness: 50, damping: 10 }) }}>
      {interpolatingStyle => (
        <div style={{ transform: `translateY(${interpolatingStyle.y}%)` }}>
          <header className="App-header">
            <div className='headerButtons'>
              <Button onClick={returnHomeClick}
                icon={"pi pi-home"}
                label={'Home'}
              />
            </div>
          </header>
          <div className='workoutCompleteBody'>
            <h1 style={{margin: 0}}>Well done!</h1>
            <h3>{minutes}min workout complete</h3>
          </div>
          <div className='workoutSummary'>
            <h2 style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>Workout Summary</h2>
            <WorkoutInfo exercises={exercises} workTime={workTime} restTime={restTime} numberOfRounds={numberOfRounds}/>
          </div>
        </div>
      )}
    </Motion>
  );
}

export default WorkoutCompletePage;