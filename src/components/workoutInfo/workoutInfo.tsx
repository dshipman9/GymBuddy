import { Workout } from '../../types';
import './workoutInfo.css'

interface WorkoutInfoProps {
  exercises: string[];
  workTime: number;
  restTime: number;
  numberOfRounds: number;
}

export const WorkoutInfo: React.FC<WorkoutInfoProps> = ({ 
  exercises, 
  workTime, 
  restTime, 
  numberOfRounds, 
}) => {
  return (
    <div className='sidebyside'>
      <div className='topInfo'>
        {numberOfRounds && (
          <div className='roundsWorkRest'>
            <h2 style={{margin: 0, fontSize: '2.2rem'}}>
              {numberOfRounds}
            </h2>
            <h3 style={{margin: 0, fontSize: '1.6rem'}}>
              {numberOfRounds === 1 ? 'Round' : 'Rounds'}
            </h3>
          </div>
        )}
        {workTime && (
          <div className='roundsWorkRest'>
            <h2 style={{margin: 0, fontSize: '2.2rem'}}>
              {workTime}s
            </h2>
            <h3 style={{margin: 0, fontSize: '1.6rem'}}>
              Work
            </h3>
          </div>
        )}
        {numberOfRounds && (
          <div className='roundsWorkRest'>
            <h2 style={{margin: 0, fontSize: '2.2rem'}}>
              {restTime}s
            </h2>
            <h3 style={{margin: 0, fontSize: '1.6rem'}}>
              Rest
            </h3>
          </div>
        )}
      </div>
      <div className='verticalLine'>
      </div>
      <div>
        {exercises.map((exercise, index) => {
          return (
            <div key={index} className='exercisesList'>
              <p className='exercises'>{exercise}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}