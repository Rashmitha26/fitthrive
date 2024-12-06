import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  Avatar,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { getInitials, stringToColor, formatMinutesToMMSS, apiRequest } from "../utils";
import loadingAnimation from "../assets/images/loading_animation.gif";

const Workout = props => {
  const { id, data, showEdit } = props;
  const youtubeRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
  const [workoutData, setWorkoutData] = useState(data || {});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const numericId = parseInt(id, 10);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  useEffect(
    () => {
      if (data) {
        setWorkoutData(data);
        setThumbnailUrl(getImage(data.url));
      } else if (!data && id) {
        const fetchWorkoutData = async () => {
          try {
            setLoading(true);
            const response = await apiRequest(`/workout/${numericId}`);
            if (response) {
              setWorkoutData(response);
              setThumbnailUrl(getImage(response.url));
            } else {
              console.err("An error occurred while fetching the workout. Please try again later");
            }
          } catch (err) {
            console.err(err.message);
          } finally {
            setLoading(false);
          }
        };
        fetchWorkoutData();
      }
    },
    [data, id]
  );

  const navigateWorkout = () => {
    navigate(`/workout/${id}`);
  };

  const getImage = url => {
    const match = url.match(youtubeRegex);
    if (match && match[5]) {
      const videoIdFromUrl = match[5];
      return `https://img.youtube.com/vi/${videoIdFromUrl}/maxresdefault.jpg`;
    }
    return null;
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

  return (
    <Card
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: 2,
        p: 3,
        my: 2
      }}
    >
      <CardActionArea onClick={e => window.open(workoutData.url, "_blank")}>
        <CardMedia
          component="img"
          sx={{ objectFit: "fill", height: "200px" }}
          image={thumbnailUrl}
          alt={workoutData.name}
        />
        <Box
          component="div"
          sx={{
            p: 0.5,
            backgroundColor: "black",
            color: "white",
            borderRadius: 0.5,
            position: "absolute",
            right: "8px",
            bottom: "8px",
            fontSize: "12px"
          }}
        >
          {formatMinutesToMMSS(workoutData.duration)}
        </Box>
      </CardActionArea>
      <CardContent
        sx={{
          flex: "1 0 auto",
          display: "flex",
          gap: 1,
          flexDirection: "column",
          "&:last-child": { p: 0 }
        }}
      >
        <Typography component="div" variant="h4">
          {workoutData.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" component="div">
          {workoutData.description}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}>
          <Box
            onClick={e => navigate(`/trainer/${workoutData.trainer_id}`)}
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <Avatar
              sx={{
                bgcolor: stringToColor(workoutData.trainer_name),
                width: 36,
                height: 36,
                fontSize: 16
              }}
            >
              {getInitials(workoutData.trainer_name)}
            </Avatar>
            <Typography variant="subtitle1" component="div" sx={{ m: 0 }}>
              {workoutData.trainer_name}
            </Typography>
          </Box>
          <CardActions disableSpacing sx={{ p: 0 }}>
            <IconButton aria-label="Add to favorites">
              <FavoriteBorderOutlinedIcon />
            </IconButton>
            {showEdit &&
              <IconButton aria-label="Edit Workout" onClick={navigateWorkout}>
                <EditIcon />
              </IconButton>}
          </CardActions>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Workout;
