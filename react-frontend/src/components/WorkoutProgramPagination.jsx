import React, { useState, useEffect } from "react";
import { Box, Pagination, Typography, TextField } from "@mui/material";
import WorkoutProgramHeader from "./WorkoutProgramHeader";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import { apiRequest } from "../utils";
import loadingAnimation from "../assets/images/loading_animation.gif";


const WorkoutProgramPagination = () => {
  const [workoutPrograms, setWorkoutPrograms] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchedTerm, setSearchedTerm] = useState("");

  useEffect(
    () => {
      fetchWorkoutPrograms(page, pageSize);
    },
    [page, pageSize]
  );

  const fetchWorkoutPrograms = async (page, size) => {
    try {
      setLoading(true);
      const response = await apiRequest("/workout-programs-in-pages", "GET", null, { page: page - 1, size: size });
      if (response) {
        setWorkoutPrograms(response.content);
        setTotalPages(response.totalPages);
      } else {
        setError("An error occurred while fetching the workout programs. Please try again later.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchedTerm("");
    fetchWorkoutPrograms(1, pageSize);
  };

  const handleKeyDown = async e => {
    if (e.key === "Enter" && searchTerm.trim()) {
      search(searchTerm.trim());
    }
  };

  const handleClick = async e => {
    if (searchTerm.trim()) {
      search(searchTerm.trim());
    }
  }

  const search = async term => {
    setSearchedTerm(term);
    try {
      const response = await apiRequest("/search-workout-programs-in-pages", "GET", null, {
        search: term,
        page: page - 1,
        size: pageSize
      });
      if (response === "") {
        setError("Looks like there aren't any workout programs that match the search. Please refine your search.");
      } else {
        setWorkoutPrograms(response.content);
        setTotalPages(response.totalPages);
      }
    } catch (err) {
      setError(err.message);
    }
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

  return (
    <div>
      <h1>Workout Programs</h1>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <TextField
          variant="outlined"
          placeholder="Search Workouts"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ marginBottom: 2 }}
          InputProps={{
            endAdornment:
              searchedTerm === ""
                ? <SearchIcon onClick={handleClick} sx={{ cursor: "pointer" }} />
                : <CancelIcon
                  onClick={clearSearch}
                  sx={{ cursor: "pointer" }}
                />
          }}
        />
      </Box>
      {workoutPrograms.length > 0
        ? <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(auto-fit, minmax(25rem, 1fr))",
            mb: 2
          }}
        >
          {workoutPrograms.map((workoutProgram, index) =>
            <WorkoutProgramHeader
              key={workoutProgram.id}
              data={workoutProgram}
              showEnroll={false}
              showEdit={false}
            />
          )}
        </Box>
        : null}
      {workoutPrograms.length === 0 || error
        ? <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 4 }}>
          <Typography variant="h5">
            {error}
          </Typography>
        </Box>
        : null}

      <Pagination
        showFirstButton
        showLastButton
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        shape="rounded"
        variant="outlined"
      />
    </div>
  );
};

export default WorkoutProgramPagination;
