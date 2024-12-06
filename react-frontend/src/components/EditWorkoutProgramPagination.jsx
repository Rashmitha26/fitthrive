import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  IconButton,
  Paper,
  Pagination,
  Alert
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from '@mui/icons-material/Cancel';
import WorkoutProgramHeader from "./WorkoutProgramHeader";
import { styled } from "@mui/system";
import notFoundImage from "../assets/images/not_found.jpg";
import loadingAnimation from "../assets/images/loading_animation.gif";
import errorImage from "../assets/images/error.avif";
import { useParams } from "react-router-dom";
import { apiRequest } from "../utils";

const EditWorkoutProgramPagination = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [workoutProgram, setWorkoutProgram] = useState({
    id: "",
    name: "",
    description: "",
    trainer_id: "",
    trainer_name: "",
    duration: "",
    tags: "",
    equipment: "",
    difficulty: "",
    price: "",
    workoutIds: []
  });
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [trainerId, setTrainerId] = useState("");
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(12);
  const [alert, setAlert] = useState("");
  const [searchedTerm, setSearchedTerm] = useState("");

  const navigate = useNavigate();
  const youtubeRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

  useEffect(
    () => {
      const fetchWorkoutProgramTrainer = async () => {
        try {
          setLoading(true);
          const response = await apiRequest(
            `/workout-program-trainer-info/${id}`
          );
          if (response) {
            setWorkoutProgram(response.workoutProgram);
            setTrainerId(response.trainerId);
            setIsAllowed(response.isAllowed);
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
      if (id) {
        fetchWorkoutProgramTrainer();
      }
    },
    [id]
  );

  useEffect(
    () => {
      const fetchWorkouts = async id => {
        try {
          const response = await apiRequest(`/workout-program-workouts/${id}`);
          if (response) {
            setSelectedWorkouts(response);
          } else {
            setError(
              "Oops! An error occurred while fetching the workout program details. Please try again later."
            );
          }
        } catch (err) {
          console.log(err);
        }
      };
      if (id) {
        fetchWorkouts(id);
      }
    },
    [id]
  );

  const handleSelectWorkout = workout => {
    if (!selectedWorkouts.find(w => w.id === workout.id)) {
      setSelectedWorkouts(prev => [...prev, workout]);
    }
    setFilteredWorkouts(
      filteredWorkouts.filter(
        currentWorkout => currentWorkout.id !== workout.id
      )
    );
  };

  const handleDeleteWorkout = id => {
    setSelectedWorkouts(prev => prev.filter(workout => workout.id !== id));
  };

  const handleDragStart = index => {
    const dragWorkout = selectedWorkouts[index];
    setSelectedWorkouts(prev => {
      const newSelectedWorkouts = [...prev];
      newSelectedWorkouts.splice(index, 1);
      return [dragWorkout, ...newSelectedWorkouts];
    });
  };

  const handleDrop = index => {
    setSelectedWorkouts(prev => {
      const newSelectedWorkouts = [...prev];
      const draggedWorkout = newSelectedWorkouts.shift();
      newSelectedWorkouts.splice(index, 0, draggedWorkout);
      return newSelectedWorkouts;
    });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await apiRequest(`/set-workouts/${id}`, "PUT", selectedWorkouts)
      if (!response) {
        setError(
          "An error occurred while saving the workout program. Please try again later"
        );
      } else {
        setAlert("Workouts successfully added to the program.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const CustomImage = styled("img")({
    width: "300px",
    marginBottom: "20px"
  });

  const getImage = url => {
    const match = url.match(youtubeRegex);
    if (match && match[5]) {
      const videoIdFromUrl = match[5];
      return `https://img.youtube.com/vi/${videoIdFromUrl}/maxresdefault.jpg`;
    }
    return null;
  };

  const handleKeyDown = async e => {
    if (e.key === "Enter" && searchTerm.trim()) {
      search(searchTerm.trim());
    }
  };

  const handleClick = async e => {
    if (searchTerm.trim()) {
      search(searchTerm.trim);
    }
  }

  const search = async (term) => {
    setSearchedTerm(term);
    const selectedWorkoutIDs = selectedWorkouts.map(workout => workout.id);
    try {
      const response = await apiRequest("/search-workout-to-add", "GET", null, {
        search: term,
        excludeIds: selectedWorkoutIDs.join(","),
        page: page - 1,
        size: pageSize
      });
      if (response) {
        setFilteredWorkouts(response.content);
        setTotalPages(response.totalPages);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  const deleteWorkoutProgram = async () => {
    try {
      const response = await apiRequest(`/delete-workout-program/${id}`, "DELETE");
      if (response === "") {
        navigate("/my-workout-programs");
      } else {
        setError(
          "An error occurred while deleting the workout program. Please try again later."
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchedTerm("");
    setFilteredWorkouts([]);
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
          Creating workout programs is a trainer’s gig!
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

  return (
    <Box sx={{ padding: 2 }}>
      {alert && <Alert severity="success">{alert}</Alert>}
      <WorkoutProgramHeader
        id={workoutProgram.id}
        showEnroll={false}
        data={workoutProgram}
        showEdit={true}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search Workouts"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ marginBottom: 2 }}
          InputProps={{
            endAdornment: searchedTerm === "" ? (
              <SearchIcon onClick={handleClick} sx={{ cursor: 'pointer' }} />
            ) : (
              <CancelIcon onClick={clearSearch} sx={{ cursor: 'pointer' }} />
            ),
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center"
        }}
      >
        <Grid container spacing={2}>
          {filteredWorkouts.length > 0 && filteredWorkouts.map(workout =>
            <Grid item xs={12} sm={6} md={4} key={workout.id}>
              <Card variant="outlined">
                <CardContent
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <img
                    src={getImage(workout.url)}
                    alt={workout.name}
                    style={{ width: "100%", height: "auto" }}
                  />
                  <Typography variant="h6">
                    {workout.name}
                  </Typography>
                  <Typography variant="body2">
                    {workout.description}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => handleSelectWorkout(workout)}
                  >
                    Add to Program
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
          {filteredWorkouts.length === 0 && searchedTerm !== "" && <Box>
            <Typography>No workouts found with the search term {searchedTerm}. Try refining your search with different keywords or a more specific term.</Typography>
          </Box>}
        </Grid>
        {filteredWorkouts.length > 0 &&
          <Pagination
            showFirstButton
            showLastButton
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            variant="outlined"
          />}
      </Box>

      <Typography variant="h5" sx={{ marginTop: 4 }}>
        Workouts
      </Typography>

      {selectedWorkouts.length > 0
        ? <Paper sx={{ padding: 2, marginTop: 2 }}>
          <Stack spacing={2}>
            {selectedWorkouts.map((workout, index) =>
              <Box
                key={workout.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDrop={() => handleDrop(index)}
                onDragOver={e => e.preventDefault()}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f5f5f5",
                  padding: 2,
                  borderRadius: 1
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton size="small" sx={{ marginRight: 1 }}>
                    <DragIndicatorIcon />
                  </IconButton>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start"
                    }}
                  >
                    <Typography variant="h6">
                      {workout.name}
                    </Typography>
                    <Typography variant="subtitle1">
                      {workout.description}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteWorkout(workout.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Stack>
        </Paper>
        : <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          sx={{
            textAlign: "center",
            gap: 3,
            backgroundColor: "background.default"
          }}
        >
          <Box>
            <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
              Empty program? Let’s fix that!
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Add workouts to create a perfect training schedule.
            </Typography>
          </Box>
        </Box>}

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          alignItems: "center"
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveChanges}
          sx={{ marginTop: 2 }}
          disabled={selectedWorkouts.length === 0}
        >
          Save Changes
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={deleteWorkoutProgram}
          sx={{ marginTop: 2 }}
        >
          Delete Workout Program
        </Button>
      </Box>
    </Box>
  );
};

export default EditWorkoutProgramPagination;
