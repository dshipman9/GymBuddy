import React from "react";
import ReactDOM from "react-dom";
import './App.css';
import { Duration } from "./types";
import { calculateDuration } from "./calculateDuration";

interface CircleGraphicProps {
  progress: number;
  secondsRemaining?: number;
}

export const CircleGraphic: React.FC<CircleGraphicProps> = ({ progress, secondsRemaining }) => {
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <svg width="300" height="300">
      <circle
        cx="150"
        cy="150"
        r={radius}
        fill="none"
        stroke="#2c6dce"
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text x="150" y="170" textAnchor="middle" fill="white" font-size="75">
        {secondsRemaining}
      </text>
    </svg>
  );
};

class WorkoutTimer {
  rounds: number;
  exercises: String[];
  exerciseTime: number;
  restTime: number;
  currentRound: number;
  currentExerciseIndex: number;
  timer: NodeJS.Timeout | null;
  countdownElement: HTMLElement | null;
  restTimeReset: number;
  exerciseTimeReset: number;
  workoutDuration: number;

  constructor(rounds: number, exercises: String[], exerciseTime: number, restTime: number) {
    this.rounds = rounds;
    this.exercises = exercises;
    this.exerciseTime = exerciseTime;
    this.restTime = restTime;
    this.currentRound = 1;
    this.currentExerciseIndex = 0;
    this.timer = null;
    this.countdownElement = null;
    this.restTimeReset = restTime;
    this.exerciseTimeReset = exerciseTime;
    this.workoutDuration = calculateDuration(exerciseTime, restTime, exercises, rounds)[2]
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  displayWorkoutDuration() {
    const minutes = Math.floor(this.workoutDuration / 60);
    const seconds = this.workoutDuration % 60;
    return (<h1>{minutes}:{seconds.toString().padStart(2, '0')}</h1>);
  }

  updateCountdown() {
    if (!this.countdownElement) return;
    const workoutDurationDisplay = this.displayWorkoutDuration();
    if (this.exerciseTime >= 0) {
      const circleProgress = 1 - this.exerciseTime / this.exerciseTimeReset;
      ReactDOM.render(
        (
          <div className="workoutDisplay">
            <h1>Round {this.currentRound}</h1>
            <h2>{this.exercises[this.currentExerciseIndex]}</h2>
            <CircleGraphic progress={circleProgress} secondsRemaining={this.exerciseTime}/>
            <div>{workoutDurationDisplay}</div>
          </div>
        ),
        this.countdownElement
      );
      if (this.exerciseTime <= 3 && this.exerciseTime > 0) {
        this.playBeepSound(false);
      } else if (this.exerciseTime === 0) {
        this.playBeepSound(true);
      }
      this.exerciseTime--;
      this.workoutDuration--;
    } else if (this.restTime >= 0 && !(this.currentRound === this.rounds && this.currentExerciseIndex === this.exercises.length - 1)) {
      const circleProgress = 1 - this.restTime / this.restTimeReset;
      ReactDOM.render(
        (
          <div className="workoutDisplay">
            <h1>Round {this.currentRound}</h1>
            <h2>Rest!</h2>
            <CircleGraphic progress={circleProgress} secondsRemaining={this.restTime}/>
            <div>{workoutDurationDisplay}</div>
            <h3 className="nextUp">Next up: {this.exercises[this.currentExerciseIndex + 1 === this.exercises.length ? 0 : this.currentExerciseIndex + 1]}</h3>
          </div>
        ),
        this.countdownElement
      );
      if (this.restTime <= 3 && this.restTime > 0) {
        this.playBeepSound(false);
      } else if (this.restTime === 0) {
        this.playBeepSound(true);
      }
      this.restTime--;
      if (this.restTime + 1 !== this.restTimeReset) {
        this.workoutDuration--;
      }
    } else {
      this.moveToNextExercise();
    }
  }

  playBeepSound(long: boolean) {
    let beepSound;
    if (long) {
      beepSound = new Audio(require('./assets/long_beep.mp3'));
    } else {
      beepSound = new Audio(require('./assets/short_beep.mp3'));
    }
    beepSound.play();
  }

  moveToNextExercise() {
    this.currentExerciseIndex++;
    this.restTime = this.restTimeReset;
    this.workoutDuration++;

    if ((this.currentExerciseIndex + 1) > this.exercises.length) {
      this.currentExerciseIndex = 0;
      this.moveToNextRound();
    } else {
      this.exerciseTime = this.exerciseTimeReset;
    }
  }  

  moveToNextRound() {
    this.currentRound++;

    if (this.currentRound > this.rounds) {
      this.stopTimer();
      if (this.countdownElement) {
        this.countdownElement.innerText = "Workout complete!";
      }
    } else {
      this.currentExerciseIndex = 0;
      this.exerciseTime = this.exerciseTimeReset;
      this.restTime = this.restTimeReset;
    }
  }

  initializeCountdownElement(elementId: string) {
    this.countdownElement = document.getElementById(elementId);
  
    if (this.countdownElement) {
      this.countdownElement.addEventListener("click", () => {
        if (this.timer) {
          this.stopTimer();
        } else {
          this.startTimer();
        }
      });
    }
  }  
}

export default WorkoutTimer;