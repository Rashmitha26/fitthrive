import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  TextField,
  Button,
  Alert
} from "@mui/material";
import { apiRequest, getInitials, stringToColor } from "../utils";

const Trainer = () => {
  const { id } = useParams();
  const loggedInUserId = Number(JSON.parse(localStorage.getItem("userDetails")).id);
  const [canEdit, setCanEdit] = useState(false);

  const [trainer, setTrainer] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(
    () => {
      const getTrainerProfile = async id => {
        try {
          const response = await apiRequest(`/trainer/${id}`)
          if (response) {
            setTrainer(response);
            setCanEdit(loggedInUserId === response.userId);
          } else {
            setAlert({state: "error", message: "An error occurred while fetching the trainer profile. Please try again later"});
          }
        } catch (err) {
          setAlert({state: "error", message: err.message})
        }
      };
      getTrainerProfile(id);
    },
    [id, loggedInUserId]
  );

  if (trainer == null) {
    return <p>No trainer found with this ID!</p>;
  }

  if (!canEdit) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ padding: 3 }}
      >
        <Avatar
          sx={{
            bgcolor: stringToColor(trainer.name),
            width: 100,
            height: 100,
            fontSize: 40,
            marginBottom: 2
          }}
        >
          {getInitials(trainer.name)}
        </Avatar>
        <Typography variant="h4" gutterBottom>
          {"Profile"}
        </Typography>
        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
          <Typography variant="h6">Name: </Typography>
          <Typography variant="h5">
            {trainer.name}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
          <Typography variant="h6">Bio: </Typography>
          <Typography variant="h5">
            {trainer.bio}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
          <Typography variant="h6">Expertise: </Typography>
          <Typography variant="h5">
            {trainer.expertise}
          </Typography>
        </Box>
      </Box>
    );
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setTrainer({ ...trainer, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await apiRequest("/trainer", "PUT", trainer);
      if (response) {
        setTrainer(trainer);
        setAlert({
          state: "success",
          message: "Successfully updated your profile"
        });
      } else {
        setAlert({
          state: "error",
          message:
            "There was an issue updating your profile. Please try again later."
        });
      }
    } catch (err) {
      setAlert({ state: "error", message: err.message });
    }
  };

  return (
    <Box>
      {alert &&
        <Alert severity={alert.state}>
          {alert.message}
        </Alert>}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ backgroundColor: "#f0f2f5", padding: 3 }}
      >
        <Card sx={{ maxWidth: 600, width: "100%", padding: 3 }}>
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                sx={{
                  bgcolor: stringToColor(trainer.name),
                  width: 100,
                  height: 100,
                  fontSize: 40,
                  marginBottom: 2
                }}
              >
                {getInitials(trainer.name)}
              </Avatar>
              <Typography variant="h4" gutterBottom>
                {"Profile"}
              </Typography>
              <Box
                component="form"
                noValidate
                autoComplete="off"
                sx={{ mt: 2, width: "100%" }}
              >
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  variant="outlined"
                  value={trainer.name}
                  onChange={e => handleChange(e)}
                  disabled
                  sx={{ marginBottom: 2 }}
                />

                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  variant="outlined"
                  value={trainer.bio}
                  onChange={e => handleChange(e)}
                  disabled={!canEdit}
                  sx={{ marginBottom: 2 }}
                />

                <TextField
                  fullWidth
                  label="Expertise"
                  name="expertise"
                  variant="outlined"
                  value={trainer.expertise}
                  onChange={e => handleChange(e)}
                  disabled={!canEdit}
                  sx={{ marginBottom: 2 }}
                />

                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={handleUpdate}
                >
                  Save Profile
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Trainer;
