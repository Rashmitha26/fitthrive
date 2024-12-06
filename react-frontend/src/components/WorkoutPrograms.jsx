import WorkoutProgramHeader from "./WorkoutProgramHeader";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { apiRequest } from "../utils";
import loadingAnimation from "../assets/images/loading_animation.gif";
import errorImage from "../assets/images/error.avif";

const WorkoutPrograms = () => {
  const [workoutPrograms, setWorkoutPrograms] = useState([]);
  const userId = JSON.parse(localStorage.userDetails).id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    () => {
      const fetchWorkoutPrograms = async () => {
        try {
          setLoading(true);

          // get all workout programs
          const programResponse = await apiRequest("/workout-programs");
          if (programResponse) {
            setWorkoutPrograms(programResponse);
          } else {
            setError("There might be no programs available at the moment, or something went wrong while fetching them. Please try again later.")
            return;
          }
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false);
        }
      };
      fetchWorkoutPrograms();
    },
    [userId]
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
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {workoutPrograms.length > 0
        ? <Box sx={{display: "flex", gap: 2, flexDirection: "column"}}>
            {workoutPrograms.map((workoutProgram, index) =>
              <WorkoutProgramHeader
                data={workoutProgram}
                key={workoutProgram.id}
                showEnroll={false}
              />
            )}
          </Box>
        : null}
    </Box>
  );
};

export default WorkoutPrograms;
