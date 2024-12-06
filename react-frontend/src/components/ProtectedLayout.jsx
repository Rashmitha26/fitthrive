import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Typography}  from "@mui/material";
import Header from './Header';
import { isAuthenticated } from "../utils";
import loadingAnimation from "../assets/images/loading_animation.gif";

const ProtectedLayout = () => {
  const ResponsiveMain = styled('main')(({ theme }) => ({
    padding: '32px 64px',
    flexGrow: 1, 
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      padding: '16px',
    },
  }));

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await isAuthenticated();
      setIsLoggedIn(authStatus);
      setIsAuthChecked(true);
    };
    checkAuth();
  }, []);

  if (!isAuthChecked) {
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

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
      <Header />
      <ResponsiveMain>
        <Outlet />
      </ResponsiveMain>
    </div>
  );
};

export default ProtectedLayout;
