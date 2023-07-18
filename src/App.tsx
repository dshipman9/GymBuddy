import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { EXERCISES } from './exercises';
import { WORKTIMES } from './workTimes';
import { RESTTIMES } from './restTimes';
import { Button, Dropdown } from '@carbon/react';
import { Edit, Fire, Add, Save, TrashCan, Subtract, Shuffle, Close } from "@carbon/icons-react";
import WorkoutTimer, { CircleGraphic } from './timer';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
  const [showNoExerciseMesssage, setShowNoExerciseMessage] = useState<boolean>(false);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [workout, setWorkout] = useState<WorkoutTimer>();
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
    setExercises([]);
    setWorkTime(undefined);
    setRestTime(undefined);
    setNumberOfRounds(undefined);
    setWorkoutGenerated(false);
    setIsWorkingOut(false);
    setIsEditingWorkout(false);
    workout?.stopTimer();
  };

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
  const deleteExercise = (index: number) => {
      const splicedExercises = [...exercises];
      splicedExercises.splice(index, 1)
      if (splicedExercises.length === 0) {
        setShowNoExerciseMessage(true);
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
  const addExercise = () => {
    if (selectedExercise && exercises.length < 12) {
      setShowNoExerciseMessage(false);
      setExercises([...exercises, selectedExercise]);
    } else if (exercises.length >= 11) {
      alert('Workouts have a maximum of 12 exercises.')
    }
  };
  const handleExerciseSelection = (event: {
    selectedItem: string;
  }) => {
    setSelectedExercise(event.selectedItem);
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
  }, [exercises]);
  
  return (
    <div className='app'>
      <header className="App-header">
        <div className='headerButtons'>
          <Button onClick={workoutGenerated ?
            handleCancelWorkoutClick :
            handleGenerateWorkoutClick}
            size='sm'
            kind='tertiary'
            style={{'width': '51%'}}
            renderIcon={workoutGenerated ? Close : Shuffle}
          >
            {workoutGenerated ? 'Cancel' : 'Random'}
          </Button>
        </div>
        {!workoutGenerated && (
          <div className='headerButtons'>
            <Button
              onClick={handleCustomWorkoutClick}
              size='sm'
              kind='tertiary'
              style={{'width': '51%'}}
              renderIcon={Edit}
            >
              Build Custom
            </Button>
          </div>
        )}
      </header>
      <div className='body'>
        <div className='timesAndRounds'>
          {!isWorkingOut && workTime && (
            <div className='workTime'>
              <h4 id='workTime'>{`Work: ${workTime}s`}</h4>
              {isEditingWorkout && (
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={String(workTime)}
                  className='slider'
                  onChange={(e) => setWorkTime(parseInt(e.target.value))}
                />
              )}
            </div>
          )}
          {!isWorkingOut && restTime && (
            <div className='restTime'>
              <h4 id='restTime'>{`Rest: ${restTime}s`}</h4>
              {isEditingWorkout && (
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={String(restTime)}
                  className='slider'
                  onChange={(e) => setRestTime(parseInt(e.target.value))}
                />
              )}
            </div>
          )}
          {!isWorkingOut && numberOfRounds && (
            <div className='editRounds'>
              <h4 id='numberOfRounds'>{`Rounds: ${numberOfRounds}`}</h4>
              {isEditingWorkout && (
                <>
                  <Button
                    onClick={() => {minusRound()}} 
                    size='sm'
                    renderIcon={Subtract}
                    kind='ghost'
                  />
                  <Button
                    onClick={() => {addRound()}} 
                    size='sm'
                    renderIcon={Add}
                    kind='ghost'
                  />

                </>
              )}
            </div>
          )}
        </div>
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
                              <p>{exercise}</p>
                              {isEditingWorkout && (
                                <Button 
                                  onClick={() => deleteExercise(index)} 
                                  size='sm' 
                                  renderIcon={TrashCan}
                                  style={{'width': '20%'}}
                                  kind='ghost'
                                />
                              )}
                            </div>
                          )}
                        </Draggable>
                      );
                    } else {
                      return (
                        <div key={index} className='exercises'>
                          <p>{exercise}</p>
                        </div>
                      );
                    }
                  })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {workoutGenerated && isEditingWorkout && showNoExerciseMesssage && <p>Nice try... your workout must include at least one exercise!</p>}
        <div className='addExercise'>
          {isEditingWorkout && (
            <>
            <Dropdown
              items={EXERCISES}
              label='Select exercise'
              id='exerciseDropdown'
              onChange={handleExerciseSelection}
              size='sm'
            />
            <Button
              size='sm' 
              renderIcon={Add} 
              onClick={addExercise}
              kind='tertiary'
              disabled={!selectedExercise}
            >
              Add Exercise
            </Button>
            </>
          )}
        </div>
        <div className='editButtons'>
        {workoutGenerated && !isWorkingOut && 
        <Button
          onClick={() => {handleSaveWorkout()}} 
          size='sm' 
          renderIcon={isEditingWorkout ? Save : Edit} 
          disabled={exercises.length === 0}
          kind='tertiary'
        >
          {isEditingWorkout ? 'Save' : 'Edit'} Workout
        </Button>}
        </div>
        {workoutGenerated && !isEditingWorkout && (
          <div ref={countdownRef} id='countdown' className='timer'>
            <Button onClick={startWorkout} renderIcon={Fire} size='sm'>
              Start Workout
            </Button>
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
