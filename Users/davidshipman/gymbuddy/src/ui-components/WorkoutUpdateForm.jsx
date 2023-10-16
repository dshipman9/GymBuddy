/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { fetchByPath, validateField } from "./utils";
import { API } from "aws-amplify";
import { getWorkout } from "../../../../../src/graphql/queries";
import { updateWorkout } from "../../../../../src/graphql/mutations";
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function WorkoutUpdateForm(props) {
  const {
    id: idProp,
    workout: workoutModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    userId: "",
    workTime: "",
    restTime: "",
    numberOfRounds: "",
    completedAt: "",
    exercises: [],
  };
  const [userId, setUserId] = React.useState(initialValues.userId);
  const [workTime, setWorkTime] = React.useState(initialValues.workTime);
  const [restTime, setRestTime] = React.useState(initialValues.restTime);
  const [numberOfRounds, setNumberOfRounds] = React.useState(
    initialValues.numberOfRounds
  );
  const [completedAt, setCompletedAt] = React.useState(
    initialValues.completedAt
  );
  const [exercises, setExercises] = React.useState(initialValues.exercises);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = workoutRecord
      ? { ...initialValues, ...workoutRecord }
      : initialValues;
    setUserId(cleanValues.userId);
    setWorkTime(cleanValues.workTime);
    setRestTime(cleanValues.restTime);
    setNumberOfRounds(cleanValues.numberOfRounds);
    setCompletedAt(cleanValues.completedAt);
    setExercises(cleanValues.exercises ?? []);
    setCurrentExercisesValue("");
    setErrors({});
  };
  const [workoutRecord, setWorkoutRecord] = React.useState(workoutModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await API.graphql({
              query: getWorkout.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getWorkout
        : workoutModelProp;
      setWorkoutRecord(record);
    };
    queryData();
  }, [idProp, workoutModelProp]);
  React.useEffect(resetStateValues, [workoutRecord]);
  const [currentExercisesValue, setCurrentExercisesValue] = React.useState("");
  const exercisesRef = React.createRef();
  const validations = {
    userId: [{ type: "Required" }],
    workTime: [{ type: "Required" }],
    restTime: [{ type: "Required" }],
    numberOfRounds: [{ type: "Required" }],
    completedAt: [{ type: "Required" }],
    exercises: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          userId,
          workTime,
          restTime,
          numberOfRounds,
          completedAt,
          exercises: exercises ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await API.graphql({
            query: updateWorkout.replaceAll("__typename", ""),
            variables: {
              input: {
                id: workoutRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "WorkoutUpdateForm")}
      {...rest}
    >
      <TextField
        label="User id"
        isRequired={true}
        isReadOnly={false}
        value={userId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userId: value,
              workTime,
              restTime,
              numberOfRounds,
              completedAt,
              exercises,
            };
            const result = onChange(modelFields);
            value = result?.userId ?? value;
          }
          if (errors.userId?.hasError) {
            runValidationTasks("userId", value);
          }
          setUserId(value);
        }}
        onBlur={() => runValidationTasks("userId", userId)}
        errorMessage={errors.userId?.errorMessage}
        hasError={errors.userId?.hasError}
        {...getOverrideProps(overrides, "userId")}
      ></TextField>
      <TextField
        label="Work time"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={workTime}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              userId,
              workTime: value,
              restTime,
              numberOfRounds,
              completedAt,
              exercises,
            };
            const result = onChange(modelFields);
            value = result?.workTime ?? value;
          }
          if (errors.workTime?.hasError) {
            runValidationTasks("workTime", value);
          }
          setWorkTime(value);
        }}
        onBlur={() => runValidationTasks("workTime", workTime)}
        errorMessage={errors.workTime?.errorMessage}
        hasError={errors.workTime?.hasError}
        {...getOverrideProps(overrides, "workTime")}
      ></TextField>
      <TextField
        label="Rest time"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={restTime}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              userId,
              workTime,
              restTime: value,
              numberOfRounds,
              completedAt,
              exercises,
            };
            const result = onChange(modelFields);
            value = result?.restTime ?? value;
          }
          if (errors.restTime?.hasError) {
            runValidationTasks("restTime", value);
          }
          setRestTime(value);
        }}
        onBlur={() => runValidationTasks("restTime", restTime)}
        errorMessage={errors.restTime?.errorMessage}
        hasError={errors.restTime?.hasError}
        {...getOverrideProps(overrides, "restTime")}
      ></TextField>
      <TextField
        label="Number of rounds"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={numberOfRounds}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              userId,
              workTime,
              restTime,
              numberOfRounds: value,
              completedAt,
              exercises,
            };
            const result = onChange(modelFields);
            value = result?.numberOfRounds ?? value;
          }
          if (errors.numberOfRounds?.hasError) {
            runValidationTasks("numberOfRounds", value);
          }
          setNumberOfRounds(value);
        }}
        onBlur={() => runValidationTasks("numberOfRounds", numberOfRounds)}
        errorMessage={errors.numberOfRounds?.errorMessage}
        hasError={errors.numberOfRounds?.hasError}
        {...getOverrideProps(overrides, "numberOfRounds")}
      ></TextField>
      <TextField
        label="Completed at"
        isRequired={true}
        isReadOnly={false}
        value={completedAt}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userId,
              workTime,
              restTime,
              numberOfRounds,
              completedAt: value,
              exercises,
            };
            const result = onChange(modelFields);
            value = result?.completedAt ?? value;
          }
          if (errors.completedAt?.hasError) {
            runValidationTasks("completedAt", value);
          }
          setCompletedAt(value);
        }}
        onBlur={() => runValidationTasks("completedAt", completedAt)}
        errorMessage={errors.completedAt?.errorMessage}
        hasError={errors.completedAt?.hasError}
        {...getOverrideProps(overrides, "completedAt")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              userId,
              workTime,
              restTime,
              numberOfRounds,
              completedAt,
              exercises: values,
            };
            const result = onChange(modelFields);
            values = result?.exercises ?? values;
          }
          setExercises(values);
          setCurrentExercisesValue("");
        }}
        currentFieldValue={currentExercisesValue}
        label={"Exercises"}
        items={exercises}
        hasError={errors?.exercises?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("exercises", currentExercisesValue)
        }
        errorMessage={errors?.exercises?.errorMessage}
        setFieldValue={setCurrentExercisesValue}
        inputFieldRef={exercisesRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Exercises"
          isRequired={false}
          isReadOnly={false}
          value={currentExercisesValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.exercises?.hasError) {
              runValidationTasks("exercises", value);
            }
            setCurrentExercisesValue(value);
          }}
          onBlur={() => runValidationTasks("exercises", currentExercisesValue)}
          errorMessage={errors.exercises?.errorMessage}
          hasError={errors.exercises?.hasError}
          ref={exercisesRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "exercises")}
        ></TextField>
      </ArrayField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || workoutModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || workoutModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
