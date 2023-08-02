export const calculateDuration = (
  workTime: number,
  restTime: number,
  exercises: String[],
  numberOfRounds: number,
  ): [number, number, number] => {
    const workoutDurationInSeconds = ((workTime + restTime)*(exercises.length)*numberOfRounds) - restTime
    const workoutMinutes = Math.floor(workoutDurationInSeconds / 60);
    const workoutSeconds = workoutDurationInSeconds % 60;
    return (
      [workoutMinutes, workoutSeconds, workoutDurationInSeconds]
    )
}
