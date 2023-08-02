import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { EXERCISES } from './assets/exercises';
import { WORKTIMES } from './assets/workTimes';
import { RESTTIMES } from './assets/restTimes';
import { Button } from 'primereact/button';
import { Slider } from 'primereact/slider';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import WorkoutTimer, { CircleGraphic } from './timer';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import openAI from './openaiAPI';
import { Duration } from './types';
import { calculateDuration } from './calculateDuration';

function App() {
  const [exercises, setExercises] = useState<Array<String>>([])
  const [workTime, setWorkTime] = useState<number>();
  const [restTime, setRestTime] = useState<number>();
  const [numberOfRounds, setNumberOfRounds] = useState<number>();
  const [workoutGenerated, setWorkoutGenerated] = useState<boolean>(false);
  const [maxRounds, setMaxRounds] = useState(6);
  const [minRounds, setMinRounds] = useState(3);
  const [isWorkingOut, setIsWorkingOut] = useState<boolean>(false);
  const [isEditingWorkout, setIsEditingWorkout] = useState<boolean>(false);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [workoutDuration, setWorkoutDuration] = useState<Duration>();
  const [workout, setWorkout] = useState<WorkoutTimer>();
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const countdownRef = useRef<HTMLDivElement>(null);

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
  const handleGenerateWorkoutClick = () => {
    getRandomExercises();
    getWorkTime();
    getRestTime();
    getNumberOfRounds();
    setWorkoutGenerated(true);
  };
  const handleCustomWorkoutClick = () => {
    setIsEditingWorkout(true);
    setWorkTime(30);
    setRestTime(30);
    setNumberOfRounds(1);
    setWorkoutGenerated(true);
  };
  const handleCancelWorkoutClick = () => {
    setShowConfirmCancel(true)
  };
  const handleConfirmCancelWorkoutClick = () => {
    setShowConfirmCancel(false)
    setExercises([]);
    setWorkTime(undefined);
    setRestTime(undefined);
    setNumberOfRounds(undefined);
    setWorkoutGenerated(false);
    setIsWorkingOut(false);
    setIsEditingWorkout(false);
    workout?.stopTimer();
  }

  const startWorkout = () => {
    setIsWorkingOut(true);
    const countdownElement = document.getElementById("countdown");
    if (countdownElement) {
      countdownElement.innerHTML = "";
      const workout = new WorkoutTimer(
        numberOfRounds as number,
        exercises,
        workTime as number,
        restTime as number
      );
      workout.initializeCountdownElement("countdown");
      setWorkout(workout);
      workout.startTimer();
    }
  };
  const showMinExerciseWarning = () => {
    toast.current?.show({severity:'warn', summary: 'Exercise Limit Reached', detail:'Workouts have a minimum of 1 exercise', life: 3000});
  }
  const deleteExercise = (index: number) => {
      const splicedExercises = [...exercises];
      splicedExercises.splice(index, 1)
      if (splicedExercises.length === 0) {
        showMinExerciseWarning();
      }
      setExercises(splicedExercises);
  };
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
  const toast = useRef<Toast>(null);
  const showMaxExerciseWarning = () => {
    toast.current?.show({severity:'warn', summary: 'Exercise Limit Reached', detail:'Workouts have a maximum of 12 exercises', life: 3000});
  }
  const handleExerciseSelection = (event: DropdownChangeEvent) => {
    setSelectedExercise(event.value);
    if (exercises.length < 12) {
      setExercises([...exercises, event.value]);
    } else if (exercises.length >= 11) {
      showMaxExerciseWarning()
    }
  };
  const handleDragEnd = (result: { destination: any; source?: any; }) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const updatedExercises = Array.from(exercises);
    const [removed] = updatedExercises.splice(source.index, 1);
    updatedExercises.splice(destination.index, 0, removed);
    setExercises(updatedExercises);
  };
  const handleSaveWorkout = () => {
    setSelectedExercise('')
    setIsEditingWorkout(!isEditingWorkout)
  }
  
  useEffect(() => {
    setExercises(exercises);
    console.log(exercises);
  }, [exercises]);

  useEffect(() => {
    if (workTime && restTime && exercises && numberOfRounds) {
      const [workoutMinutes, workoutSeconds] = calculateDuration(workTime, restTime, exercises, numberOfRounds)
      setWorkoutDuration({minutes: workoutMinutes, seconds: workoutSeconds})
    }
  }, [workTime, restTime, numberOfRounds, exercises])
  
  async function optimiseOrder() {
    setIsLoading(true);
    try {
      const prompt = `
      Act as a personal trainer. I am creating a workout. I am going to provide the exercises in my workout and I want you to reorder them according to the following rule.
      You must ensure that two exercises that work the same muscle group must not be adjacent in the workout.
      For example, if I give you ["Sit-ups", "Plank", "Bicycle Crunches", "Squats", "Lunges"], then you should reorder it to ["Sit-ups", "Squats", "Plank", "Lunges", "Bicycle Crunches"].
      These are the exercises in my workout:
      ${exercises}
      Reorder these exercises into an optimal order and give the results back as an array.
      Your response must only be the array with no explanation.
      `;
      const response = await openAI.getGPTResponse(prompt);
      let parsedResponse;
      try {
        if (response) {
          const trimmedResponse = response.replace(/^Answer:\s*/, '');
          parsedResponse = JSON.parse(trimmedResponse);
        };
      } catch (error) {
        throw new Error("Invalid response format. Unable to parse the response as JSON.");
      }
      if (!Array.isArray(parsedResponse)) {
        throw new Error("Invalid response format. The response must be an array.");
      }
      setExercises(parsedResponse);
      console.log('GPT Response:', parsedResponse);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const renderFooter = () => {
    return (
        <div>
            <Button label="No" icon="pi pi-times" onClick={() => setShowConfirmCancel(false)} className="p-button-text" />
            <Button label="Yes" icon="pi pi-check" onClick={() => handleConfirmCancelWorkoutClick()} autoFocus />
        </div>
    );
  }
  return (
    <div className='app'>
      <Toast ref={toast} />
      <header className="App-header">
        <div className='headerButtons'>
          <Button onClick={workoutGenerated ?
            handleCancelWorkoutClick :
            handleGenerateWorkoutClick}
            icon={workoutGenerated ? "pi pi-times" : "pi pi-bolt"}
            label={workoutGenerated ? 'Cancel' : 'Random'}
          />
        </div>
        <Dialog header="Cancel workout?" visible={showConfirmCancel} style={{ width: '80%' }} footer={renderFooter()} onHide={() => setShowConfirmCancel(false)}>
            <p>Are you sure you want to end this workout early?</p>
        </Dialog>
        {!workoutGenerated && (
          <div className='headerButtons'>
            <Button
              onClick={handleCustomWorkoutClick}
              icon={"pi pi-file-edit"}
              label={'Custom'}
            />
          </div>
        )}
      </header>
      <div className='body'>
        {workoutGenerated && !isWorkingOut && exercises.length !== 0 && (
          <div className='workoutDuration'>
            <h2>
              {workoutDuration?.minutes}min {workoutDuration?.seconds}sec
            </h2>
          </div>
        )}
        {!isWorkingOut && numberOfRounds && (
          <div className='editRounds'>
            <h3 style={{margin: 0}}> {`Rounds: ${numberOfRounds}`}</h3>
            {isEditingWorkout && (
              <div>
                <Button
                  onClick={() => {minusRound()}} 
                  icon={'pi pi-minus'}
                  className="p-button-text p-button-rounded"
                />
                <Button
                  onClick={() => {addRound()}} 
                  icon={'pi pi-plus'}
                  className="p-button-text p-button-rounded"
                />
              </div>
            )}
          </div>
        )}
        <div>
          {!isWorkingOut && workTime && (
            <div>
              <h3>{`Work: ${workTime}s`}</h3>
              {isEditingWorkout && (
                <div>
                  <Slider
                    value={workTime}
                    onChange={(e) => setWorkTime(e.value as number)}
                    step={5}
                    min={10}
                    max={60}
                  />
                </div>
              )}
            </div>
          )}
          {!isWorkingOut && restTime && (
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
          )}
        </div>
        {isLoading && (
          <div className='reorderLoading'>
            <ProgressSpinner />
          </div>
        )}
        <div className='dragDropBlock'>
          {!isLoading && (
              <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="exercises">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {!isWorkingOut &&
                      exercises.map((exercise, index) => {
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
                                    <p>{exercise}</p>
                                    {isEditingWorkout && (
                                      <i className="pi pi-bars" style={{ color: 'var(--primary-color)' }}/>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        } else {
                          return (
                            <div key={index} className='exercisesList'>
                              <p className='exercises'>{exercise}</p>
                            </div>
                          );
                        }
                      })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
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
        <div className='optimiseButton'>
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
        </div>
        <div className='editButtons'>
        {workoutGenerated && !isWorkingOut && 
        <Button
          onClick={() => {handleSaveWorkout()}} 
          icon={isEditingWorkout ? 'pi pi-save' : 'pi pi-pencil'} 
          disabled={exercises.length === 0}
          label={isEditingWorkout ? 'Save' : 'Edit'}
        />}
        </div>
        {workoutGenerated && !isEditingWorkout && (
          <div ref={countdownRef} id='countdown' className='timer'>
            <Button
            onClick={startWorkout}
            label={'Start Workout'}
            />
            {isWorkingOut && (
              <CircleGraphic progress={0} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
