import React from "react";
import ReactDOM from "react-dom";
import './App.css';

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
        stroke="#1c525d"
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text x="150" y="170" textAnchor="middle" fill="black" font-size="75">
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

  // pauseTimer() {

  // }

  updateCountdown() {
    if (!this.countdownElement) return;
    if (this.exerciseTime >= 0) {
      const circleProgress = 1 - this.exerciseTime / this.exerciseTimeReset;
      ReactDOM.render(
        (
          <div className="workoutDisplay">
            <h3>Round {this.currentRound}</h3>
            <h4>{this.exercises[this.currentExerciseIndex]}</h4>
            <CircleGraphic progress={circleProgress} secondsRemaining={this.exerciseTime}/>
          </div>
        ),
        this.countdownElement
      );
      this.exerciseTime--;
    } else if (this.restTime >= 0 && !(this.currentRound === this.rounds && this.currentExerciseIndex === this.exercises.length - 1)) {
      const circleProgress = 1 - this.restTime / this.restTimeReset;
      ReactDOM.render(
        (
          <div className="workoutDisplay">
            <h3>Round {this.currentRound}</h3>
            <h4>Rest!</h4>
            <CircleGraphic progress={circleProgress} secondsRemaining={this.restTime}/>
            <h5>Next up: {this.exercises[this.currentExerciseIndex + 1 === this.exercises.length ? 0 : this.currentExerciseIndex + 1]}</h5>
          </div>
        ),
        this.countdownElement
      );
      this.restTime--;
    } else {
      this.moveToNextExercise();
    }
  }

  moveToNextExercise() {
    this.currentExerciseIndex++;
    this.restTime = this.restTimeReset;
  
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