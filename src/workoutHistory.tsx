import { useQuery, gql } from '@apollo/client';
import { Workout, WorkoutDto } from './types';
import { Key } from 'react';
import { WorkoutCard } from './workoutCard';
import './workoutHistory.css'

const GET_WORKOUTS = gql`
  query Workouts {
    workouts {
      _id
      exercises
      workTime
      restTime
      numberOfRounds
      completedAt
    }
  }
`;

export const WorkoutHistory = () => {
  const { loading, error, data } = useQuery(GET_WORKOUTS);
  if (data) {
    return (
      <><h2 style={{'padding': '1rem'}}>
        Workout History
      </h2>
      <div className='workoutHistory'>
        {data.workouts.slice().reverse().map((workout: WorkoutDto, index: Key) => (
          <div key={index} className='workoutCard'>
            <WorkoutCard
              id={workout._id}
              workTime={workout.workTime}
              restTime={workout.restTime}
              numberOfRounds={workout.numberOfRounds}
              exercises={workout.exercises}
              completedAt={workout.completedAt} />
          </div>
        ))}
      </div></>
    );
  } else {
    return (
      <div>
        No exercise history
      </div>
    )
  }
}