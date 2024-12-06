import { useState, useEffect } from "react";
import Workout from "./Workout";
import { Box, Typography } from "@mui/material";
import { apiRequest } from "../utils";
import loadingAnimation from "../assets/images/loading_animation.gif";
import errorImage from "../assets/images/error.avif";

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    () => {
      const fetchWorkouts = async () => {
        try {
          setLoading(true);
          const response = await apiRequest("/workouts");
          if (response) {
            setWorkouts(response);
          }
        } catch (err) {
          setError("Error while fetching workouts: " + err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchWorkouts();
    },
    []
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
      {workouts.length > 0
        ? <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(25rem, 1fr))" }}>
            {workouts.map((workout, index) =>
              <Workout key={workout.id} data={workout} showEdit={false}/>
            )}
          </Box>
        : null}
    </Box>
  );
};

export default Workouts;
