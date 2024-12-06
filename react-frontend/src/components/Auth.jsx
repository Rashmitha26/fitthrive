import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Tab,
  Tabs,
  TextField,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { alpha, styled } from "@mui/material/styles";
import logo from "../assets/images/logo.png";
import { isAuthenticated } from "../utils";

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  width: "70%",
  maxWidth: 1000,
  minHeight: 550,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
  overflow: "hidden"
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.85)
  },
  transition: "background-color 0.3s ease"
}));

const ResponsiveImg = styled("img")(({ theme }) => ({
  width: "100%",
  height: "100%",
  [theme.breakpoints.down("sm")]: {
    height: "150px"
  }
}));

const Auth = () => {
  const [tabValue, setTabValue] = useState(0); // 0 indicates login
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: ""
  });
  const [errors, setErrors] = useState({});
  const [formAlert, setFormAlert] = useState({ severity: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await isAuthenticated();
      setIsLoggedIn(authStatus);
      setIsAuthChecked(true);
    };
    checkAuth();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setFormData({ username: "", email: "", password: "", name: "" });
    setErrors({});
    setFormAlert({ severity: "", message: "" });
    setFormSubmitted(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (tabValue !== 0 && !formData.email)
      newErrors.email = "Email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormSubmitted(true);
    if (validateForm()) {
      if (tabValue === 0) {
        try {
          const response = await axios.post(
            "http://localhost:8090/api/auth/login",
            { username: formData.username, password: formData.password },
            { withCredentials: true}
          );

          if (response.status === 200) {
            localStorage.setItem("userDetails", response.data.user_details);
            navigate('/home', { replace: true });
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            setFormAlert({
              severity: "error",
              message: "Incorrect username or password. Please try again."
            });
          } else {
            setFormAlert({
              severity: "error",
              message: "Something went wrong. Please try again."
            });
          }
        }
      } else {
        try {
          const response = await axios.post("/register", {
            username: formData.username,
            password: formData.password,
            email: formData.email,
            name: formData.name
          }, {
            withCredentials: true
          });
          if (response.status === 201) {
            localStorage.setItem("userDetails", response.data.user_details);
            navigate('/home', { replace: true });
          }
        } catch (error) {
          if (error.response && error.response.status === 409) {
            setFormAlert({
              severity: "error",
              message:
                "Username already taken. Please choose a different username."
            });
          } else {
            setFormAlert({
              severity: "error",
              message: "Something went wrong. Please try again."
            });
          }
        }
      }
    }
  };

  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }

  function handleMouseDownPassword(event) {
    event.preventDefault();
  }

  if (isAuthChecked && isLoggedIn) {
    navigate('/home', { replace: true });
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        padding: 2
      }}
    >
      <StyledPaper
        elevation={10}
        sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
      >
        <Box
          sx={{
            flex: 1,
            background: "#FFFFFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ResponsiveImg
            src={logo}
            alt="FitThrive Logo"
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            padding: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#F0F0F0",
            transition: "all 0.5s ease"
          }}
        >
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Login" sx={{ fontWeight: "bold" }} />
            <Tab label="Register" sx={{ fontWeight: "bold" }} />
          </Tabs>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 3,
              gap: 2,
              display: "flex",
              flexDirection: "column",
              animation: "fadeIn 0.5s ease"
            }}
          >
            <Typography variant="h5" gutterBottom>
              {tabValue === 0 ? "Welcome Back!" : "Register"}
            </Typography>
            {tabValue === 1
              ? <TextField
                  required
                  label="Name"
                  variant="outlined"
                  name="name"
                  fullWidth
                  sx={{ transition: "border-color 0.3s ease" }}
                  InputProps={{
                    sx: { "&:hover": { borderColor: "#FFD700" } }
                  }}
                  onChange={e => handleChange(e)}
                  value={formData.name}
                  error={errors.name}
                />
              : null}
            <TextField
              required
              label="Username"
              variant="outlined"
              name="username"
              fullWidth
              sx={{ transition: "border-color 0.3s ease" }}
              InputProps={{
                sx: { "&:hover": { borderColor: "#FFD700" } }
              }}
              onChange={e => handleChange(e)}
              value={formData.username}
              error={errors.username}
            />
            {tabValue === 1
              ? <TextField
                  required
                  label="Email"
                  variant="outlined"
                  name="email"
                  fullWidth
                  sx={{ transition: "border-color 0.3s ease" }}
                  InputProps={{
                    sx: { "&:hover": { borderColor: "#FFD700" } }
                  }}
                  type="email"
                  onChange={e => handleChange(e)}
                  value={formData.email}
                  error={errors.email}
                />
              : null}
            <FormControl fullWidth required variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                name="password"
                onChange={e => handleChange(e)}
                value={formData.password}
                error={errors.password}
              />
            </FormControl>
            <StyledButton
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
            >
              {tabValue === 0 ? "Login" : "Register"}
            </StyledButton>
            {Object.keys(formAlert).length > 0
              ? <Alert severity={formAlert.severity}>
                  {formAlert.message}
                </Alert>
              : null}
          </Box>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default Auth;
