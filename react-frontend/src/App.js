import  { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Navigate
} from "react-router-dom";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import ProtectedLayout from "./components/ProtectedLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Trainer from "./components/Trainer";
import Journey from "./components/Journey";
import WorkoutProgram from "./components/WorkoutProgram";
import NotFound from "./components/NotFound";
import MyWorkoutPrograms from "./components/MyWorkoutPrograms";
import AddWorkoutProgram from "./components/AddWorkoutProgram";
import EditWorkout from "./components/EditWorkout";
import MyWorkouts from "./components/MyWorkouts";
import WorkoutPagination from "./components/WorkoutPagination";
import WorkoutProgramPagination from "./components/WorkoutProgramPagination";
import EditWorkoutProgramPagination from "./components/EditWorkoutProgramPagination";
import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { isAuthenticated } from "./utils";

const App = () => {
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

  const WorkoutProgramWrapper = () => {
    const { id } = useParams();
    return <WorkoutProgram id={id} />;
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/" element={<ProtectedLayout />}>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/trainer/:id" element={<Trainer />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/workout-programs" element={<WorkoutProgramPagination />} />
            <Route
              path="/workout-program/:id"
              element={<WorkoutProgramWrapper />}
            />
            <Route path="/workouts" element={<WorkoutPagination />} />
            <Route path="/my-workouts" element={<MyWorkouts />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/edit-workout-program/:id"
              element={<EditWorkoutProgramPagination />}
            />
            <Route
              path="/edit-workout-program-details/:id"
              element={<AddWorkoutProgram />}
            />
            <Route
              path="/create-workout-program"
              element={<AddWorkoutProgram />}
            />
            <Route path="/my-workout-programs" element={<MyWorkoutPrograms />} />
            <Route path="/workout/:id?" element={<EditWorkout />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route
            path="*"
            element={<Navigate to={isAuthChecked && isLoggedIn ? "/home" : "/login"} />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
