import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import notFoundImage from "../assets/images/not_found.jpg";

const StyledContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  backgroundColor: theme.palette.background.default,
  textAlign: "center",
  padding: theme.spacing(2)
}));

const NotFoundImage = styled("img")({
  width: "300px",
  marginBottom: "20px"
});

const NotFound = () => {
  return (
    <StyledContainer>
      <NotFoundImage src={notFoundImage} alt="404 Not Found" />
      <Typography variant="h4" gutterBottom>
        We couldn’t find this page.
      </Typography>
      <Typography variant="body1" gutterBottom>
        Looks like it’s taking a permanent rest day!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        href="/"
        sx={{ marginTop: 2 }}
      >
        Go to Home
      </Button>
    </StyledContainer>
  );
};

export default NotFound;
