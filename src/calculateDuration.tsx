export const calculateDuration = (
  workTime: number,
  restTime: number,
  exercises: String[],
  numberOfRounds: number,
  ): [number, string, number] => {
    const workoutDurationInSeconds = ((workTime + restTime)*(exercises.length)*numberOfRounds) - restTime
    const workoutMinutes = Math.floor(workoutDurationInSeconds / 60);
    const workoutSeconds = workoutDurationInSeconds % 60;
    const formattedSeconds = workoutSeconds.toString().padStart(2, '0');
    return (
      [workoutMinutes, formattedSeconds, workoutDurationInSeconds]
    )
}
