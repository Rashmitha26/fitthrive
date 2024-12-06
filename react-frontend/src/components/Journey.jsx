import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WorkoutProgramHeader from "./WorkoutProgramHeader";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import noEnrolledPrograms from "../assets/images/no_enrolled_programs.avif";
import errorImage from "../assets/images/error.avif";
import loadingAnimation from "../assets/images/loading_animation.gif";
import { apiRequest } from "../utils";

const Journey = () => {
  const [enrolledWorkoutPrograms, setEnrolledWorkoutPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const NoEnrolledWorkoutsImage = styled("img")({
    width: "300px",
    height: "300px",
    marginBottom: "20px"
  });

  useEffect(
    () => {
      const fetchUserWorkouts = async () => {
        try {
          setLoading(true);
          const response = await apiRequest("/user-workout-program");
          if (response) {
            setEnrolledWorkoutPrograms(response);
          }
        } catch (err) {
          setError(
            "Oops! An error occurred while fetching your workouts."
          );
        } finally {
          setLoading(false);
        }
      };
      fetchUserWorkouts();
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
        <Typography variant="h6">{error}</Typography>
      </Box>
    )
  }

  return (
    <Box>
      {enrolledWorkoutPrograms.length > 0
        ? <Box>
          <Typography variant="h4" sx={{mb: 2}}>Enrolled Workouts</Typography>
          <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>
            {enrolledWorkoutPrograms.map((workout, index) =>
              <WorkoutProgramHeader
                key={workout.id}
                showEnroll={false}
                data={workout}
              />
            )}
          </Box>
        </Box>
        : <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: 1
          }}
        >
          <NoEnrolledWorkoutsImage
            src={noEnrolledPrograms}
            alt="No enrolled programs"
          />
          <Typography variant="h5">
            Uh-oh! Looks like you haven't enrolled into any program yet.
          </Typography>
          <Typography variant="h6">
            But every journey starts somewhere! Check out our exciting options
            to get started!
          </Typography>
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            onClick={e => navigate("/workout-programs")}
          >
            Explore Programs
          </Button>
        </Box>}
    </Box>
  );
};

export default Journey;
