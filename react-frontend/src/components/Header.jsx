import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Snackbar,
  Alert
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { getInitials, stringToColor } from "../utils";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { getTrainerId } from "../utils";

const Header = () => {
  const settings = [
    {
      title: "Profile",
      href: "/profile"
    },
    {
      title: "Dashboard",
      href: "/dashboard"
    },
    {
      title: "Logout",
      href: "/logout"
    }
  ];
  const [pages, setPages] = useState([
    {
      title: "Journey",
      href: "/journey"
    },
    {
      title: "Workout Programs",
      href: "/workout-programs"
    },
    {
      title: "Workouts",
      href: "/workouts"
    }
  ]);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const username = JSON.parse(localStorage.getItem("userDetails")).username;
  const [isTrainer, setIsTrainer] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrainer = async () => {
      var response = await getTrainerId();
      setIsTrainer(response !== "");
      if (response) {
        setPages(prevPages => {
          const newPages = [...prevPages];
          if (!newPages.some(page => page.title === "My Workout Programs")) {
            newPages.push({
              title: "My Workout Programs",
              href: "/my-workout-programs"
            });
          }
          if (!newPages.some(page => page.title === "My Workouts")) {
            newPages.push({
              title: "My Workouts",
              href: "/my-workouts"
            });
          }

          return newPages;
        });
      }
    };
    fetchTrainer();
  }, [isTrainer]);

  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSettingClicked = async (setting, e) => {
    handleCloseUserMenu();
    if (setting.title === "Logout") {
      try {
        const response = await axios.post('http://localhost:8090/api/auth/logout', {}, { withCredentials: true });
    
        if (response.status === 200) {
          localStorage.clear();
          navigate("/login");
        } else {
          setError("Logout failed");
        }
      } catch (err) {
        console.error(err);
        setError("Logout failed");
      }
    } else {
      navigate(setting.href);
    }
  };

  return (
    <AppBar position="static">
      {error && <Snackbar open={true} autoHideDuration={5000} onClose={(e) => setError("")} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert
          onClose={(e) => setError("")}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>}
      <Box sx={{ px: { xs: 0, md: 4 } }}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            px: { xs: 0 }
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <FitnessCenterIcon
              sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/home"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none"
              }}
            >
              FitThrive
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left"
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left"
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {pages.map(page =>
                  <MenuItem
                    key={page.title}
                    onClick={e => {
                      handleCloseNavMenu();
                      navigate(page.href);
                    }}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {page.title}
                    </Typography>
                  </MenuItem>
                )}
              </Menu>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <FitnessCenterIcon
                sx={{ display: { xs: "flex", md: "none" }, mr: 2 }}
              />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none"
                }}
              >
                FitThrive
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {pages.map(page =>
              <Button
                key={page.title}
                onClick={e => {
                  handleCloseNavMenu();
                  navigate(page.href);
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.title}
              </Button>
            )}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 1.5 }}>
                <Avatar
                  sx={{
                    bgcolor: stringToColor(username),
                    width: 36,
                    height: 36,
                    fontSize: 16
                  }}
                >
                  {getInitials(username)}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map(setting =>
                <MenuItem
                  key={setting.title}
                  onClick={e => {
                    handleSettingClicked(setting, e);
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {setting.title}
                  </Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default Header;
