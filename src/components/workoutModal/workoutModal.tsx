import { Dialog } from "primereact/dialog";
import './workoutModal.css'
import { useState } from "react";
import { Button } from "primereact/button";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_WORKOUTS } from '../workoutHistory/workoutHistory'

interface WorkoutModalProps {
  id: string,
  workTime: number;
  restTime: number;
  numberOfRounds: number;
  exercises: string[];
  completedAt: string;
  onHide: () => void;
  visible: boolean;
}

export const WorkoutModal: React.FC<WorkoutModalProps> = ({
  id,
  workTime,
  restTime,
  numberOfRounds,
  exercises,
  completedAt,
  onHide,
  visible,
}) => {
  const [isFavourited, setIsFavourited] = useState<boolean>(false);
  const DELETE_WORKOUT = gql`
    mutation DeleteWorkout($deleteWorkoutId: ID!) {
      deleteWorkout(id: $deleteWorkoutId)
    }
  `;
  const [deleteWorkoutMutation] = useMutation(DELETE_WORKOUT, {
    refetchQueries: [
      GET_WORKOUTS,
      'Workouts'
    ],
  });
  const navigate = useNavigate();

  const handleStartWorkout = () => {
    navigate('/timer-page', { state: { numberOfRounds, exercises, workTime, restTime } });
  }

  const handleDelete = () => {
    deleteWorkoutMutation({
      variables: {
        deleteWorkoutId: id,
      },
    })
      .then((response) => {
        console.log('Workout deleted successfully', response);
      })
      .catch((error) => {
        console.error('Error deleting workout', error);
      });
    onHide();
  }
  const handleFavourite = () => {
    setIsFavourited(!isFavourited)
    //TODO: send the (un)favourite mutation from here
  }
  return (
    <>
    <Dialog header={completedAt} visible={visible} style={{ width: '80%' }} onHide={onHide} className="oswald-font">
      <div className='modalHeaderAndFooter'>
        <h3 style={{margin: 0}}>{numberOfRounds} {numberOfRounds === 1 ? 'Round' : 'Rounds'}</h3>
        <i
          className={isFavourited ? "pi pi-star-fill" : "pi pi-star"}
          style={{ fontSize: '1.7rem' }}
          onClick={handleFavourite}
        />
      </div>
      <h4>{workTime}s of work, with {restTime}s of rest</h4>
      {exercises.map((exercise, index) => (
        <p key={index}>{exercise}</p>
      ))}
      <div className="modalHeaderAndFooter">
        <Button icon='pi pi-trash' onClick={handleDelete}/>
        <Button label='Start Workout' onClick={handleStartWorkout}/>
      </div>
    </Dialog>
    </>
  )
}