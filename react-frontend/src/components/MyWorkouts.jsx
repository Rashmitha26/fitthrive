import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Workout from "./Workout";
import { Box } from "@mui/material";
import { Button, Typography } from "@mui/material";
import { apiRequest, getTrainerId } from "../utils";
import loadingAnimation from "../assets/images/loading_animation.gif";
import errorImage from "../assets/images/error.avif";

const MyWorkouts = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
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
      const fetchWorkouts = async () => {
        try {
          setLoading(true);
          const response = await apiRequest(`/workouts-by-trainer/${userId}`);          
          if (response) {
            setWorkouts(response);
          } else {
            setError("Error occurred while fetching workouts. Please try again later.");
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      if (isTrainer)
        fetchWorkouts();
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
          <Button variant="contained" onClick={() => navigate("/workout")}>Add workout</Button>
        </Box>}
      {workouts.length > 0
        ? <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(25rem, 1fr))" }}>
            {workouts.map((workout, index) =>
              <Workout key={workout.id} id={workout.id} data={workout} showEdit={true} />
            )}
          </Box>
        : null}
    </Box>
  );
};

export default MyWorkouts;
