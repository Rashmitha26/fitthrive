import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import WorkoutProgramHeader from "./WorkoutProgramHeader";
import loadingAnimation from "../assets/images/loading_animation.gif";
import errorImage from "../assets/images/error.avif";
import { apiRequest } from "../utils";

const Home = () => {
  const navigate = useNavigate();
  const username = JSON.parse(localStorage.getItem("userDetails")).name;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [workoutPrograms, setWorkoutPrograms] = useState([]);

  useEffect(() => {
    const fetchRecentWorkoutPrograms = async () => {
      try {
        setLoading(true);
        const response = await apiRequest(
          "/recent-workout-programs-in-pages",
          "GET",
          null,
          { page: 0, size: 3 }
        );
        if (response) {
          setWorkoutPrograms(response.content);
        } else {
          setError(
            "An error occurred while fetching the recent workout programs. Please try again later!"
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentWorkoutPrograms();
  }, []);

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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {username}!
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Typography variant="h5">Recent Workout Programs</Typography>
        <Button onClick={e => navigate("/workout-programs")}>
          View all Workout Programs
        </Button>
      </Box>
      {error
        ? <Box>
          {error}
        </Box>
        : <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(auto-fit, minmax(25rem, 1fr))"
          }}
        >
          {workoutPrograms &&
            workoutPrograms.map((workoutProgram, index) =>
              <WorkoutProgramHeader
                key={workoutProgram.id}
                data={workoutProgram}
                showEnroll={false}
                showEdit={false}
              />
            )}
        </Box>}
    </Box>
  );
};

export default Home;
