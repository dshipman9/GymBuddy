import { Button } from 'primereact/button';
import React, { useEffect, useRef, useState } from 'react';
import { EXERCISES } from '../../assets/exercises';
import { WORKTIMES } from '../../assets/workTimes';
import { RESTTIMES } from '../../assets/restTimes';
import { calculateDuration } from '../../calculateDuration';
import { Duration } from '../../types';
import { Slider } from 'primereact/slider';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Toast } from 'primereact/toast';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { useLocation, useNavigate } from 'react-router-dom';
import './workoutDetailsPage.css'
import { WorkoutInfo } from '../../components/workoutInfo/workoutInfo';

function WorkoutDetailsPage() {
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [exercises, setExercises] = useState<Array<string>>([])
  const [workTime, setWorkTime] = useState<number>();
  const [restTime, setRestTime] = useState<number>();
  const [numberOfRounds, setNumberOfRounds] = useState<number>();
  const [tempExercises, setTempExercises] = useState<Array<string>>([])
  const [tempWorkTime, setTempWorkTime] = useState<number>();
  const [tempRestTime, setTempRestTime] = useState<number>();
  const [tempNumberOfRounds, setTempNumberOfRounds] = useState<number>();
  const [isEditingWorkout, setIsEditingWorkout] = useState<boolean>(false);
  const [workoutDuration, setWorkoutDuration] = useState<Duration>();
  const toast = useRef<Toast>(null);
  const [selectedExercise, setSelectedExercise] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const maxRounds = 6
  const minRounds = 3

  const getRandomExercises = () => {
    const shuffledExercises = [...EXERCISES].sort(() => Math.random() - 0.5);
    setExercises(shuffledExercises.slice(0, 5));
  };
  const getWorkTime = () => {
    const randomWorkTime = WORKTIMES[Math.floor(Math.random() * WORKTIMES.length)];
    setWorkTime(randomWorkTime);
  };
  const getRestTime = () => {
    const randomRestTime = RESTTIMES[Math.floor(Math.random() * RESTTIMES.length)];
    setRestTime(randomRestTime);
  };
  const getNumberOfRounds = () => {
    setNumberOfRounds(Math.floor((Math.random() * (maxRounds - minRounds)) + minRounds));
  };

  useEffect(() => {
    if (location.state.random === true) {
      getRandomExercises();
      getWorkTime();
      getRestTime();
      getNumberOfRounds();
    } else {
      setIsEditingWorkout(true)
      setWorkTime(30);
      setRestTime(30);
      setNumberOfRounds(1);
    }
  }, []);

  const handleCancelWorkoutClick = () => {
    setShowConfirmCancel(true)
  };

  const handleConfirmCancelWorkoutClick = () => {
    setShowConfirmCancel(false)
    setExercises([]);
    setWorkTime(undefined);
    setRestTime(undefined);
    setNumberOfRounds(undefined);
    setIsEditingWorkout(false);
    navigate('/');
  }

  const addRound = () => {
    if (numberOfRounds && numberOfRounds < 10) {
      setNumberOfRounds(numberOfRounds + 1)
    }
  }

  const minusRound = () => {
    if (numberOfRounds && numberOfRounds > 1) {
      setNumberOfRounds(numberOfRounds - 1)
    }
  }

  const deleteExercise = (index: number) => {
    const splicedExercises = [...exercises];
    splicedExercises.splice(index, 1)
    if (splicedExercises.length === 0) {
      showMinExerciseWarning();
    }
    setExercises(splicedExercises);
  };

  const showMinExerciseWarning = () => {
    toast.current?.show({severity:'warn', summary: 'Exercise Limit Reached', detail:'Workouts have a minimum of 1 exercise', life: 3000});
  }

  const showMaxExerciseWarning = () => {
    toast.current?.show({severity:'warn', summary: 'Exercise Limit Reached', detail:'Workouts have a maximum of 12 exercises', life: 3000});
  }

  const handleDragEnd = (result: { destination: any; source?: any; }) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const updatedExercises = Array.from(exercises);
    const [removed] = updatedExercises.splice(source.index, 1);
    updatedExercises.splice(destination.index, 0, removed);
    setExercises(updatedExercises);
  };

  const handleExerciseSelection = (event: DropdownChangeEvent) => {
    setSelectedExercise(event.value);
    if (exercises.length < 12) {
      setExercises([...exercises, event.value]);
    } else if (exercises.length >= 11) {
      showMaxExerciseWarning()
    }
  };

  const handleSaveWorkout = () => {
    setSelectedExercise('');
    setIsEditingWorkout(false);
  };

  const handleEditWorkout = () => {
    setTempExercises(exercises);
    setTempNumberOfRounds(numberOfRounds);
    setTempRestTime(restTime);
    setTempWorkTime(workTime);
    setIsEditingWorkout(true);
  }

  const handleCancelEdit = () => {
    setExercises(tempExercises);
    setNumberOfRounds(tempNumberOfRounds);
    setRestTime(tempRestTime);
    setWorkTime(tempWorkTime);
    setIsEditingWorkout(false);
  }

  const startWorkout = () => {
    navigate('/timer-page', { state: { numberOfRounds, exercises, workTime, restTime } });
  };

  const renderFooter = () => {
    return (
        <div>
            <Button label="No" icon="pi pi-times" onClick={() => setShowConfirmCancel(false)} className="p-button-text" />
            <Button label="Yes" icon="pi pi-check" onClick={() => handleConfirmCancelWorkoutClick()} autoFocus />
        </div>
    );
  }

  useEffect(() => {
    if (workTime && restTime && exercises && numberOfRounds) {
      const [workoutMinutes, workoutSeconds] = calculateDuration(workTime, restTime, exercises, numberOfRounds)
      setWorkoutDuration({minutes: workoutMinutes, seconds: workoutSeconds})
    }
  }, [workTime, restTime, numberOfRounds, exercises])

  return (
      <div>
      <Toast ref={toast} />
      <Dialog header="Cancel workout?" visible={showConfirmCancel} style={{ width: '80%' }} footer={renderFooter()} onHide={() => setShowConfirmCancel(false)}>
        <p>Are you sure you want to end this workout early?</p>
      </Dialog>
      <header className="App-header">
        <div className='headerButtons'>
          <Button onClick={handleCancelWorkoutClick}
            icon={"pi pi-times"}
            label={'Cancel'}
          />
        </div>
      </header>
      <div className='body'>
        {exercises.length !== 0 && (
          <div className='workoutDuration'>
            <h1 style={{ fontSize: '2.5rem' }}>
              <i className='pi pi-stopwatch' style={{ fontSize: '2.5rem' }} />
              &nbsp;
              {workoutDuration?.minutes}:{workoutDuration?.seconds}
            </h1>
          </div>
        )}
        {!isEditingWorkout && workTime && restTime && numberOfRounds &&(
          <WorkoutInfo exercises={exercises} workTime={workTime} restTime={restTime} numberOfRounds={numberOfRounds}/>
        )}
        {isEditingWorkout && (
          <>
            <div className='editRounds'>
              <h3 style={{ margin: 0 }}> {`Rounds: ${numberOfRounds}`}</h3>
              <div>
                <Button
                  onClick={() => { minusRound(); } }
                  icon={'pi pi-minus'}
                  className="p-button-text p-button-rounded" />
                <Button
                  onClick={() => { addRound(); } }
                  icon={'pi pi-plus'}
                  className="p-button-text p-button-rounded" />
              </div>
            </div>
            <div>
              <h3>{`Work: ${workTime}s`}</h3>
              {isEditingWorkout && (
                <div>
                  <Slider
                    value={workTime}
                    onChange={(e) => setWorkTime(e.value as number)}
                    step={5}
                    min={5}
                    max={60} />
                </div>
              )}
            </div>
            <div className='restTime'>
              <h3>{`Rest: ${restTime}s`}</h3>
              {isEditingWorkout && (
                <div>
                  <Slider
                    value={restTime}
                    onChange={(e) => setRestTime(e.value as number)}
                    step={5}
                    min={5}
                    max={45}
                  />
                </div>
              )}
            </div>
          </>
        )}
        <div className='dragDropBlock'>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="exercises">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {exercises.map((exercise, index) => {
                      if (isEditingWorkout) {
                        return (
                          <Draggable key={index} draggableId={`exercise-${index}`} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className='editexercises'
                              >
                                {isEditingWorkout && (
                                  <div>
                                    <Button
                                      onClick={() => deleteExercise(index)}
                                      icon={'pi pi-times'}
                                      className="p-button-text" />
                                  </div>
                                )}
                                <div className='dragExercise'>
                                  <p style={{fontSize: '1.1rem'}}>{exercise}</p>
                                  {isEditingWorkout && (
                                    <i className="pi pi-bars" style={{ color: 'var(--primary-color)', fontSize: '1.1rem'}}/>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      }
                    })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className='addExercise'>
          {isEditingWorkout && (
            <>
            <Dropdown
              value={selectedExercise}
              options={EXERCISES}
              placeholder='Add exercise'
              onChange={handleExerciseSelection}
              style={{'width': '80%'}}
            />
            </>
          )}
        </div>
        {/* <div className='optimiseButton'>
          {isEditingWorkout && (
            <>
            <Button
              icon={'pi pi-sliders-h'} 
              onClick={optimiseOrder}
              disabled={exercises.length === 0}
              label={'Optimise Order'}
            />
            </>
          )}
        </div> */}
        <div className='editButtons'>
          {isEditingWorkout && (<Button
            onClick={() => handleCancelEdit()}
            icon={'pi pi-times'}
            label={'Cancel'}
          />)}
          <Button
            onClick={() => {isEditingWorkout ? handleSaveWorkout() : handleEditWorkout()}} 
            icon={isEditingWorkout ? 'pi pi-save' : 'pi pi-pencil'} 
            disabled={exercises.length === 0}
            label={isEditingWorkout ? 'Save' : 'Edit'}
          />
        </div>
        {!isEditingWorkout && (
          <div className='editButtons'>
            <Button
              onClick={startWorkout}
              label={'Start Workout'}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkoutDetailsPage;
