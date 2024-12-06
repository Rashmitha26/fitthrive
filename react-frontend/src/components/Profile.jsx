import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Alert
} from "@mui/material";
import { apiRequest, getInitials, stringToColor } from "../utils";
import loadingAnimation from "../assets/images/loading_animation.gif";


const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(
    () => {
      const fetchUserProfile = async () => {
        try {
          setLoading(true);
          const response = await apiRequest("/user");
          if (response) {
            setUser({
              name: response.name,
              email: response.email
            });
          } else {
            setAlert({
              state: "error",
              message:
                "There was an issue in fetching user details. Please try again later."
            });
          }
        } catch (err) {
          setAlert({ state: "error", message: err.message });
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
    },
    []
  );

  const handleUpdateProfile = async () => {
    try {
      const response = await apiRequest("/user", "PUT", { ...user, id: JSON.parse(localStorage.getItem("userDetails")).id })
      if (response) {
        setUser(user);
        setIsEditing(false);
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
      setAlert({
        state: "error",
        message: err.message
      });
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

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

  if (!user) return null;

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
                  bgcolor: stringToColor(user.name),
                  width: 100,
                  height: 100,
                  fontSize: 40,
                  marginBottom: 2
                }}
              >
                {getInitials(user.name)}
              </Avatar>
              <Typography variant="h4" gutterBottom>
                {isEditing ? "Edit Profile" : "Profile"}
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
                  value={user.name}
                  onChange={e => handleChange(e)}
                  disabled={!isEditing}
                  sx={{ marginBottom: 2 }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  variant="outlined"
                  type="email"
                  value={user.email}
                  onChange={e => handleChange(e)}
                  disabled={!isEditing}
                  sx={{ marginBottom: 2 }}
                />

                {isEditing
                  ? <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleUpdateProfile}
                  >
                    Save Changes
                  </Button>
                  : <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Profile;
