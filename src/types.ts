export type Duration = {
  minutes: number;
  seconds: string;
}

export type Workout = {
  id: string,
  exercises: string[];
  workTime: number;
  restTime: number;
  numberOfRounds: number;
  completedAt: string;
}

export type WorkoutDto = {
  _id: string,
  exercises: string[];
  workTime: number;
  restTime: number;
  numberOfRounds: number;
  completedAt: string;
}