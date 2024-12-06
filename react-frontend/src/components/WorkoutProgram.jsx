import WorkoutProgramHeader from "./WorkoutProgramHeader";
import Workout from "./Workout";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import loadingAnimation from "../assets/images/loading_animation.gif";
import errorImage from "../assets/images/error.avif";
import { apiRequest, getTrainerId } from "../utils";

const WorkoutProgram = props => {
  const location = useLocation();
  const { id } = props;
  const navigate = useNavigate();
  const [program, setProgram] = useState(location.state?.workoutProgram || null);
  const [workouts, setWorkouts] = useState([]);
  const [enrolledPrograms, setEnrolledPrograms] = useState([]);
  const [createdPrograms, setCreatedPrograms] = useState([]);
  const [trainerId, setTrainerId] = useState("");
  const userId = JSON.parse(localStorage.userDetails).id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrainer = async () => {
      var response = await getTrainerId();
      if (response !== "") setTrainerId(response);
    };
    fetchTrainer();
  }, []);

  useEffect(
    () => {
      const getWorkoutProgramData = async () => {
        try {
          setLoading(true);

          // get workout program
          if (!program) {
            const response = await apiRequest(`/workout-program/${id}`)
            if (response) {
              setProgram(response);
            } else {
              setError("An error occurred while fetching workout program data. Please try again later.");
              return;
            }
          }

          // get program workouts
          const workoutResponse = await apiRequest(`/workout-program-workouts/${id}`);
          if (workoutResponse) {
            setWorkouts(workoutResponse);
          } else {
            setError("An error occurred while fetching workout program data. Please try again later.");
            return;
          }

          // get enrolled workout programs
          const enrolledProgramResponse = await apiRequest("/user-workout-program");
          if (enrolledProgramResponse) {
            const data = enrolledProgramResponse;
            data.forEach(program => {
              setEnrolledPrograms(prev => [...prev, program.id]);
            });
          }

          // get created workout programs
          const createdProgramResponse = await apiRequest(`/workout-programs-by-trainer/${userId}`);
          if (createdProgramResponse) {
            if (createdProgramResponse === "") {
              return;
            }
            createdProgramResponse.forEach(program => {
              setCreatedPrograms(prev => [...prev, program.id]);
            });
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      getWorkoutProgramData();
    },
    [id, userId]
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          margin: "auto"
        }}
      >
        <Box
          component="img"
          src={loadingAnimation}
          alt="Loading"
          sx={{
            width: "200px",
            height: "200px"
          }}
        />
        <Typography variant="h5">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          margin: "auto"
        }}
      >
        <Box
          component="img"
          src={errorImage}
          alt="An error occurred"
          sx={{
            width: "200px",
            height: "200px"
          }}
        />
        <Typography variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 2
        }}
      >
        {program &&
          trainerId === program.trainer_id &&
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={e => navigate(`/edit-workout-program/${id}`)}
          >
            Edit Workout Program
          </Button>}
      </Box>
      {program &&
        <WorkoutProgramHeader
          data={program}
          showEdit={false}
          showEnroll={
            enrolledPrograms.indexOf(program.id) === -1 &&
            createdPrograms.indexOf(program.id) === -1
          }
        />}
      {workouts.map(workout =>
        <Workout
          key={workout.id}
          id={workout.id}
          data={workout}
          showEdit={false}
        />
      )}
    </Box>
  );
};

export default WorkoutProgram;
