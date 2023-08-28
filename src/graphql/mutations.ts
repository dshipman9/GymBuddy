/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createWorkout = /* GraphQL */ `
  mutation CreateWorkout(
    $input: CreateWorkoutInput!
    $condition: ModelWorkoutConditionInput
  ) {
    createWorkout(input: $input, condition: $condition) {
      id
      userId
      workTime
      restTime
      numberOfRounds
      completedAt
      exercises
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateWorkout = /* GraphQL */ `
  mutation UpdateWorkout(
    $input: UpdateWorkoutInput!
    $condition: ModelWorkoutConditionInput
  ) {
    updateWorkout(input: $input, condition: $condition) {
      id
      userId
      workTime
      restTime
      numberOfRounds
      completedAt
      exercises
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteWorkout = /* GraphQL */ `
  mutation DeleteWorkout(
    $input: DeleteWorkoutInput!
    $condition: ModelWorkoutConditionInput
  ) {
    deleteWorkout(input: $input, condition: $condition) {
      id
      userId
      workTime
      restTime
      numberOfRounds
      completedAt
      exercises
      createdAt
      updatedAt
      __typename
    }
  }
`;
