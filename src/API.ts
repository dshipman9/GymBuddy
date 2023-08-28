/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateWorkoutInput = {
  id?: string | null,
  userId: string,
  workTime: number,
  restTime: number,
  numberOfRounds: number,
  completedAt: string,
  exercises: Array< string | null >,
};

export type ModelWorkoutConditionInput = {
  userId?: ModelStringInput | null,
  workTime?: ModelIntInput | null,
  restTime?: ModelIntInput | null,
  numberOfRounds?: ModelIntInput | null,
  completedAt?: ModelStringInput | null,
  exercises?: ModelStringInput | null,
  and?: Array< ModelWorkoutConditionInput | null > | null,
  or?: Array< ModelWorkoutConditionInput | null > | null,
  not?: ModelWorkoutConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Workout = {
  __typename: "Workout",
  id: string,
  userId: string,
  workTime: number,
  restTime: number,
  numberOfRounds: number,
  completedAt: string,
  exercises: Array< string | null >,
  createdAt: string,
  updatedAt: string,
};

export type UpdateWorkoutInput = {
  id: string,
  userId?: string | null,
  workTime?: number | null,
  restTime?: number | null,
  numberOfRounds?: number | null,
  completedAt?: string | null,
  exercises?: Array< string | null > | null,
};

export type DeleteWorkoutInput = {
  id: string,
};

export type ModelWorkoutFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelStringInput | null,
  workTime?: ModelIntInput | null,
  restTime?: ModelIntInput | null,
  numberOfRounds?: ModelIntInput | null,
  completedAt?: ModelStringInput | null,
  exercises?: ModelStringInput | null,
  and?: Array< ModelWorkoutFilterInput | null > | null,
  or?: Array< ModelWorkoutFilterInput | null > | null,
  not?: ModelWorkoutFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelWorkoutConnection = {
  __typename: "ModelWorkoutConnection",
  items:  Array<Workout | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionWorkoutFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionStringInput | null,
  workTime?: ModelSubscriptionIntInput | null,
  restTime?: ModelSubscriptionIntInput | null,
  numberOfRounds?: ModelSubscriptionIntInput | null,
  completedAt?: ModelSubscriptionStringInput | null,
  exercises?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionWorkoutFilterInput | null > | null,
  or?: Array< ModelSubscriptionWorkoutFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type CreateWorkoutMutationVariables = {
  input: CreateWorkoutInput,
  condition?: ModelWorkoutConditionInput | null,
};

export type CreateWorkoutMutation = {
  createWorkout?:  {
    __typename: "Workout",
    id: string,
    userId: string,
    workTime: number,
    restTime: number,
    numberOfRounds: number,
    completedAt: string,
    exercises: Array< string | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateWorkoutMutationVariables = {
  input: UpdateWorkoutInput,
  condition?: ModelWorkoutConditionInput | null,
};

export type UpdateWorkoutMutation = {
  updateWorkout?:  {
    __typename: "Workout",
    id: string,
    userId: string,
    workTime: number,
    restTime: number,
    numberOfRounds: number,
    completedAt: string,
    exercises: Array< string | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteWorkoutMutationVariables = {
  input: DeleteWorkoutInput,
  condition?: ModelWorkoutConditionInput | null,
};

export type DeleteWorkoutMutation = {
  deleteWorkout?:  {
    __typename: "Workout",
    id: string,
    userId: string,
    workTime: number,
    restTime: number,
    numberOfRounds: number,
    completedAt: string,
    exercises: Array< string | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetWorkoutQueryVariables = {
  id: string,
};

export type GetWorkoutQuery = {
  getWorkout?:  {
    __typename: "Workout",
    id: string,
    userId: string,
    workTime: number,
    restTime: number,
    numberOfRounds: number,
    completedAt: string,
    exercises: Array< string | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListWorkoutsQueryVariables = {
  filter?: ModelWorkoutFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListWorkoutsQuery = {
  listWorkouts?:  {
    __typename: "ModelWorkoutConnection",
    items:  Array< {
      __typename: "Workout",
      id: string,
      userId: string,
      workTime: number,
      restTime: number,
      numberOfRounds: number,
      completedAt: string,
      exercises: Array< string | null >,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateWorkoutSubscriptionVariables = {
  filter?: ModelSubscriptionWorkoutFilterInput | null,
};

export type OnCreateWorkoutSubscription = {
  onCreateWorkout?:  {
    __typename: "Workout",
    id: string,
    userId: string,
    workTime: number,
    restTime: number,
    numberOfRounds: number,
    completedAt: string,
    exercises: Array< string | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateWorkoutSubscriptionVariables = {
  filter?: ModelSubscriptionWorkoutFilterInput | null,
};

export type OnUpdateWorkoutSubscription = {
  onUpdateWorkout?:  {
    __typename: "Workout",
    id: string,
    userId: string,
    workTime: number,
    restTime: number,
    numberOfRounds: number,
    completedAt: string,
    exercises: Array< string | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteWorkoutSubscriptionVariables = {
  filter?: ModelSubscriptionWorkoutFilterInput | null,
};

export type OnDeleteWorkoutSubscription = {
  onDeleteWorkout?:  {
    __typename: "Workout",
    id: string,
    userId: string,
    workTime: number,
    restTime: number,
    numberOfRounds: number,
    completedAt: string,
    exercises: Array< string | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};
