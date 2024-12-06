import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Box,
  Chip,
  Stack,
  Button,
  Alert
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LabelIcon from "@mui/icons-material/Label";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/system";
import { stringToColor, getInitials, apiRequest } from "../utils";

const StyledCard = styled(Card)(({ theme }) => ({
  margin: "16px auto",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)",
  transition: "0.3s",
  "&:hover": {
    boxShadow: "0px 1px 20px rgba(0, 0, 0, 0.2)"
  },
  padding: "24px",
  display: "flex",
  flexDirection: "column"
}));

const EnrollButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "white",
  borderRadius: theme.shape.borderRadius * 2,
  fontWeight: "bold",
  padding: "10px 20px",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "scale(1.05)",
    transition: "0.3s"
  }
}));

const WorkoutProgramHeader = props => {
  const { showEnroll, data, showEdit } = props;

  const navigate = useNavigate();
  const difficultyMapping = ["Beginner", "Intermediate", "Advanced"];
  const [alert, setAlert] = useState({state: "", message: ""});

  const {
    id,
    name,
    description,
    trainer_name,
    trainer_id,
    duration,
    tags,
    equipment,
    difficulty,
    price
  } = data;

  const handleEnroll = async () => {
    try {
      const response = await apiRequest(`/enroll-workout/${id}`, "POST")
      if (response) {
        setAlert({state: "success", message: "Yayyy, you have been successfully enrolled into this workout program!"});
      } else {
        setAlert({state: "error", message: "An error occurred while enrolling for the workout program. Please try again later."});
      }
    } catch (err) {
      setAlert({state: "error", message: "An error occurred while enrolling for the workout program. Please try again later."});
    }
  };

  const handleClick = () => {
    navigate(`/workout-program/${id}`, {
      state: {
        workoutProgram: data
      }
    });
  };

  const navigateWorkoutProgram = e => {
    e.stopPropagation();
    navigate(`/edit-workout-program-details/${id}`);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {alert &&
        <Alert severity={alert.state}>
          {alert.message}
        </Alert>}
      <StyledCard style={{ cursor: "pointer" }} sx={{ flexGrow: 1, m: 0 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: stringToColor(trainer_name) }}>
              {getInitials(trainer_name)}
            </Avatar>
          }
          title={
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {name}
            </Typography>
          }
          subheader={
            <Typography
              variant="h6"
              sx={{ cursor: "pointer" }}
              onClick={e => navigate(`/trainer/${trainer_id}`)}
            >
              Trainer: {trainer_name}
            </Typography>
          }
          action={
            <Tooltip title="Workout Difficulty" arrow>
              <Chip
                label={difficultyMapping[difficulty]}
                sx={{ fontWeight: "bold", margin: "8px" }}
              />
            </Tooltip>
          }
        />
        <CardContent onClick={handleClick} sx={{ cursor: "pointer" }}>
          <Typography variant="body2" color="textSecondary" paragraph>
            {description}
          </Typography>

          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
            <Tooltip title="Duration" arrow>
              <Box display="flex" alignItems="center">
                <AccessTimeIcon color="action" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {duration} days
                </Typography>
              </Box>
            </Tooltip>

            <Tooltip title="Equipment Needed" arrow>
              <Box display="flex" alignItems="center" sx={{ ml: 2 }}>
                <FitnessCenterIcon color="action" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {equipment || "None"}
                </Typography>
              </Box>
            </Tooltip>

            <Tooltip title="Price" arrow>
              <Box display="flex" alignItems="center" sx={{ ml: 2 }}>
                <MonetizationOnIcon color="action" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {price ? `$${price}` : "Free"}
                </Typography>
              </Box>
            </Tooltip>
          </Stack>

          <Box display="flex" flexWrap="wrap" gap={0.5} sx={{ mt: 1, mb: 1 }}>
            {tags !== "" && tags
              .split(",")
              .map((tag, index) =>
                <Chip
                  key={index}
                  icon={<LabelIcon />}
                  label={tag}
                  color="secondary"
                  size="small"
                />
              )}
          </Box>
        </CardContent>

        {showEnroll || showEdit
          ? <Box
              display="flex"
              justifyContent="flex-end"
              sx={{ padding: "16px", gap: 2 }}
            >
              {showEdit &&
                <IconButton
                  aria-label="Edit Workout"
                  onClick={e => navigateWorkoutProgram(e)}
                >
                  <EditIcon />
                </IconButton>}
              {showEnroll &&
                <EnrollButton
                  onClick={e => {
                    e.stopPropagation();
                    handleEnroll();
                  }}
                >
                  Enroll Now
                </EnrollButton>}
            </Box>
          : null}
      </StyledCard>
    </Box>
  );
};

export default WorkoutProgramHeader;
