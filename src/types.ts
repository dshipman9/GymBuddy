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
  id: string | undefined,
  userId: string | undefined,
  exercises: (string | null)[] | undefined;
  workTime: number | undefined;
  restTime: number | undefined;
  numberOfRounds: number | undefined;
  completedAt: string | undefined;
}