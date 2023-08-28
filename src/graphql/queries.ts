/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getWorkout = /* GraphQL */ `
  query GetWorkout($id: ID!) {
    getWorkout(id: $id) {
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
export const listWorkouts = /* GraphQL */ `
  query ListWorkouts(
    $filter: ModelWorkoutFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWorkouts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
