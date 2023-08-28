import { WorkoutDto } from '../../types';
import { Key, useEffect, useState } from 'react';
import { WorkoutCard } from '../workoutCard/workoutCard';
import './workoutHistory.css'
import { listWorkouts } from '../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLQuery, GraphQLSubscription } from '@aws-amplify/api';
import { ListWorkoutsQuery, OnDeleteWorkoutSubscription } from '../../API';
import * as subscriptions from '../../graphql/subscriptions';

interface WorkoutHistoryProps {
  userId: string | undefined;
}

export const WorkoutHistory: React.FC<WorkoutHistoryProps>= ({ userId }) => {
  const [workouts, setWorkouts] = useState<Array<WorkoutDto>>()

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const input = {
          userId: userId
        };
        const response = await API.graphql<GraphQLQuery<ListWorkoutsQuery>>(graphqlOperation(listWorkouts, { filter: { userId: { eq: userId } } }));
        if (response.data && response.data.listWorkouts) {
          const transformedWorkouts: WorkoutDto[] = response.data.listWorkouts.items.map(item => ({
            id: item?.id,
            userId: item?.userId,
            exercises: item?.exercises,
            workTime: item?.workTime,
            restTime: item?.restTime,
            numberOfRounds: item?.numberOfRounds,
            completedAt: item?.completedAt,
            createdAt: item?.createdAt,
            updatedAt: item?.updatedAt,
          }));
        
          setWorkouts(transformedWorkouts);
        }
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
      const sub = API.graphql<GraphQLSubscription<OnDeleteWorkoutSubscription>>(
        graphqlOperation(subscriptions.onDeleteWorkout)
      ).subscribe({
        next: ({ provider, value }: { provider: OnDeleteWorkoutSubscription, value: OnDeleteWorkoutSubscription }) => {fetchWorkouts();
      },
        error: (error: any) => console.warn(error)
      });
    };

    fetchWorkouts();
  }, []);
  if (workouts && workouts.length !== 0) {
    return (
      <><h2 className='workoutHistoryTitle'>
        Workout History
      </h2>
      <div className='workoutHistory'>
        {workouts.slice().reverse().map((workout: WorkoutDto, index: Key) => {
          const exercisesArray = workout.exercises
          ? workout.exercises.filter(exercise => exercise !== null)[0]?.split(',').map(exercise => exercise.trim().replace('[', '').replace(']', '')) || []
          : [];
          return (
            <div key={index} className='workoutCard'>
              <WorkoutCard
                id={workout.id || ''}
                workTime={workout.workTime || 0}
                restTime={workout.restTime || 0}
                numberOfRounds={workout.numberOfRounds || 0}
                exercises={exercisesArray}
                completedAt={workout.completedAt || ''} />
            </div>
          )
        })}
      </div>
      </>
    );
  } else {
    return (
      <div className='workoutHistoryTitle'>
        <h2>
          Workout History
        </h2>
        Your workout history is empty
      </div>
    )
  }
}