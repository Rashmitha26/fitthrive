import React, { useState, useEffect } from "react";
import { Box, Pagination, TextField, Typography } from "@mui/material";
import Workout from "./Workout";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from '@mui/icons-material/Cancel';
import loadingAnimation from "../assets/images/loading_animation.gif";
import { apiRequest } from "../utils";

const WorkoutPagination = () => {
  const [workouts, setWorkouts] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchedTerm, setSearchedTerm] = useState("");

  useEffect(
    () => {
      fetchWorkouts(page, pageSize);
    },
    [page, pageSize]
  );

  const fetchWorkouts = async (page, size) => {
    try {
      setLoading(true);
      const response = await apiRequest("/workouts-in-pages", "GET", null, { page: page - 1, size: size });
      if (response) {
        setWorkouts(response.content);
        setTotalPages(response.totalPages);
      } else {
        setError("An error occurred while fetching workouts. Please try again later.");
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

  const handleKeyDown = async e => {
    if (e.key === "Enter" && searchTerm.trim()) {
      search(searchTerm.trimEnd());
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
      const response = await apiRequest("/search-workout-in-pages", "GET", null, {
        search: term,
        page: page - 1,
        size: pageSize
      });
      if (response === "") {
        setError("Looks like there aren't any workouts that match the search. Please refine your search.");
      } else {
        setWorkouts(response.content);
        setTotalPages(response.totalPages);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  const clearSearch = () => {
    setSearchTerm("");
    setSearchedTerm("");
    fetchWorkouts(1, pageSize);
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
      <h1>Workouts</h1>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <TextField
          variant="outlined"
          placeholder="Search Workouts"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ marginBottom: 2 }}
          InputProps={{
            endAdornment: searchedTerm === "" ? (
              <SearchIcon onClick={handleClick} sx={{ cursor: 'pointer' }}/>
            ) : (
              <CancelIcon onClick={clearSearch} sx={{ cursor: 'pointer' }} />
            ),
          }}
        />
      </Box>
      {workouts.length > 0
        ? <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(25rem, 1fr))" }}>
          {workouts.map((workout, index) =>
            <Workout key={workout.id} data={workout} showEdit={false} />
          )}
        </Box>
        : null}
      {workouts.length === 0 || error
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

export default WorkoutPagination;
