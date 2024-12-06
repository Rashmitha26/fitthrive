import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { Button, Typography } from "@mui/material";
import { apiRequest, getTrainerId } from "../utils";
import WorkoutProgramHeader from "./WorkoutProgramHeader";
import loadingAnimation from "../assets/images/loading_animation.gif";
import errorImage from "../assets/images/error.avif";

const MyWorkoutPrograms = () => {
  const navigate = useNavigate();
  const [workoutPrograms, setWorkoutPrograms] = useState([]);
  const [isTrainer, setIsTrainer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = JSON.parse(localStorage.getItem("userDetails")).id;

  useEffect(() => {
    const fetchTrainer = async () => {
      var response = await getTrainerId();
      setIsTrainer(response !== "");
    };
    fetchTrainer();
  }, []);

  useEffect(
    () => {
      const fetchWorkoutPrograms = async () => {
        try {
          setLoading(true);
          const response = await apiRequest(`/workout-programs-by-trainer/${userId}`);
          if (response) {
            setWorkoutPrograms(response);
          } else {
            setError("Error while fetching workout programs. Please try again later.");
          }
        } catch (err) {
          console.error(err.message);
        } finally {
          setLoading(false);
        }
      };
      if (isTrainer)
        fetchWorkoutPrograms();
    },
    [isTrainer, userId]
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
    <Box sx={{ display: "flex", gap: 3, flexDirection: "column" }}>
      {isTrainer &&
        <Box sx={{ display: "flex", gap: 3, justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={() => navigate("/create-workout-program")}>Add workout Program</Button>
        </Box>}
      {workoutPrograms.length > 0
        ? <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(25rem, 1fr))" }}>
          {workoutPrograms.map((workout, index) =>
            <WorkoutProgramHeader key={workout.id} showEnroll={false} data={workout} showEdit={false} />
          )}
        </Box>
        : null}
        {workoutPrograms.length === 0 && <Box>
          <Typography variant="h4">Seems like you havent created any workout programs yet!</Typography>
          </Box>}
    </Box>
  );
};

export default MyWorkoutPrograms;
