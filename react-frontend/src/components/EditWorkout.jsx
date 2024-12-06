import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert
} from "@mui/material";
import { styled } from "@mui/system";
import notFoundImage from "../assets/images/not_found.jpg";
import loadingAnimation from "../assets/images/loading_animation.gif";
import errorImage from "../assets/images/error.avif";
import { apiRequest } from "../utils";

const EditWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const youtubeRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

  const [workout, setWorkout] = useState({
    id: "",
    name: "",
    description: "",
    duration: "",
    url: "",
    trainer_id: "",
    trainer_name: ""
  });
  const [trainerId, setTrainerId] = useState("");
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [urlError, setUrlError] = useState("");
  const [durationError, setDurationError] = useState("");

  useEffect(
    () => {
      const fetchWorkoutTrainer = async () => {
        try {
          setLoading(true);
          const url = id ? `/workout-trainer-info/${id}` : "/get-trainer";
          const response = await apiRequest(url);
          if (response) {
            if (id) {
              setWorkout(response.workout);
              setTrainerId(response.trainerId);
              setIsAllowed(response.isAllowed);
            } else {
              const trainer = response;
              if (trainer !== null) {
                setIsAllowed(true);
                setTrainerId(trainer);
              }
            }
          } else {
            setError(
              "An error occurred while fetching information. Please try again later"
            );
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchWorkoutTrainer();
    },
    [id]
  );

  const CustomImage = styled("img")({
    width: "300px",
    height: "300px",
    marginBottom: "20px"
  });

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === "url") {
      if (value === "") {
        setUrlError("");
      } else if (!youtubeRegex.test(value)) {
        setUrlError("Please enter a valid YouTube video URL.");
        return;
      } else {
        setUrlError("");
      }
    }

    if (name === "duration" && value <= 0) {
      setDurationError("Duration must be greater than 0");
      return;
    } else {
      setDurationError("");
    }

    setWorkout({
      ...workout,
      [name]: value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (id) {
      try {
        const response = await apiRequest("/edit-workout", "PUT", workout);
        if (response) {
          setEmptyWorkout();
          setSuccess("Successfully updated workout.");
        } else {
          setError("Failed updating the workout");
        }
      } catch (err) {
        setError(err.message);
      }
    } else {
      const { id, ...workoutWithoutId } = workout;
      try {
        const response = await apiRequest(
          "/create-workout",
          "POST",
          workoutWithoutId
        );
        if (response) {
          setSuccess("Successfully created workout.");
          setEmptyWorkout();
        } else {
          setError("Failed creating the workout");
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const setEmptyWorkout = () => {
    setWorkout({
      id: "",
      name: "",
      description: "",
      duration: "",
      url: "",
      trainer_id: "",
      trainer_name: ""
    });
  };

  const navigateWorkouts = () => {
    setEmptyWorkout();
    navigate("/my-workouts");
  };

  const handleDelete = async () => {
    try {
      const response = await apiRequest(`/delete-workout/${id}`, "DELETE");
      if (response === "") {
        navigate("/my-workouts");
      } else {
        setError(
          "An error occurred in deleting the workout. Please try again later."
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!trainerId) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          alignItems: "center"
        }}
      >
        <CustomImage src={notFoundImage} alt="Insufficient access" />
        <Typography variant="h4" gutterBottom>
          Looks like you’re still in the trainee zone.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Creating workouts is a trainer’s gig!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="/"
          sx={{ marginTop: 2 }}
        >
          Go to Home
        </Button>
      </Box>
    );
  }

  if (!isAllowed) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          alignItems: "center"
        }}
      >
        <CustomImage src={notFoundImage} alt="Insufficient access" />
        <Typography variant="h4" gutterBottom>
          Sorry, this workout isn’t yours to tweak.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Each trainer has their own creations!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="/"
          sx={{ marginTop: 2 }}
        >
          Go to Home
        </Button>
      </Box>
    );
  }

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
    <Container maxWidth="sm">
      {success &&
        <Alert
          severity="success"
          action={
            <Button color="inherit" size="small" onClick={navigateWorkouts}>
              View your Workouts
            </Button>
          }
        >
          {success}
        </Alert>}
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          {id ? "Edit Workout" : "Add Workout"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={workout.name}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={workout.description}
            onChange={handleChange}
            required
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={workout.duration}
            onChange={handleChange}
            required
            margin="normal"
            error={durationError}
            helperText={durationError}
          />
          <TextField
            fullWidth
            label="Video URL"
            name="url"
            value={workout.url}
            onChange={handleChange}
            required
            margin="normal"
            error={urlError}
            helperText={urlError}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              alignItems: "center"
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              disabled={urlError || durationError}
            >
              {id ? "Update Workout" : "Add Workout"}
            </Button>
            {id &&
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={handleDelete}
              >
                Delete Workout
              </Button>}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EditWorkout;
