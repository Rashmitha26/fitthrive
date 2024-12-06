import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
	Box,
	Container,
	Paper,
	Typography,
	TextField,
	Button,
	Chip,
	IconButton,
	InputAdornment,
	FormControl,
	InputLabel,
	Select,
	MenuItem
} from "@mui/material";
import { styled } from "@mui/system";
import CancelIcon from "@mui/icons-material/Cancel";
import notFoundImage from "../assets/images/not_found.jpg";
import loadingAnimation from "../assets/images/loading_animation.gif";
import errorImage from "../assets/images/error.avif";
import { apiRequest } from "../utils";

const AddWorkoutProgram = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [workoutProgram, setWorkoutProgram] = useState({
		id: "",
		name: "",
		description: "",
		trainer_id: "",
		trainer_name: "",
		duration: "",
		tags: "",
		equipment: "",
		difficulty: "",
		price: "",
		workoutIds: []
	});
	const [trainerId, setTrainerId] = useState({});
	const [isAllowed, setIsAllowed] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [equipmentInput, setEquipmentInput] = useState("");
	const [tagInput, setTagInput] = useState("");
	const [formError, setFormError] = useState({});

	useEffect(
		() => {
			const fetchWorkoutProgramTrainer = async () => {
				setLoading(true);
				try {
					const url = id
						? `/workout-program-trainer-info/${id}`
						: `/get-trainer`;
					const response = await apiRequest(url, "GET");
					if (response) {
						if (id) {
							setWorkoutProgram(response.workoutProgram);
							setTrainerId(response.trainerId);
							setIsAllowed(response.isAllowed);
						} else {
							const trainer = response;
							if (trainer !== null) {
								setIsAllowed(true);
								setTrainerId(trainer);
							}
						}
					} else {
						setError(
							"An error occurred while fetching information. Please try again later"
						);
					}
				} catch (err) {
					setError(err.message);
				} finally {
					setLoading(false);
				}
			};
			fetchWorkoutProgramTrainer();
		},
		[id]
	);

	const CustomImage = styled("img")({
		width: "300px",
		marginBottom: "20px"
	});

	const handleAddEquipment = event => {
		if (event.key === "Enter") {
			event.preventDefault();
			if (equipmentInput.trim()) {
				const currentEquipment = workoutProgram.equipment;
				if (!currentEquipment.includes(equipmentInput.trim())) {
					const updatedEquipment = currentEquipment === "" ? equipmentInput.trim() : currentEquipment + "," + equipmentInput.trim();
					setWorkoutProgram(prevProgram => ({
						...prevProgram,
						equipment: updatedEquipment
					}));
				} else {
					setFormError({
						...formError,
						equipment: "Equipment already added."
					});
				}
				setEquipmentInput("");
				setFormError({
					...formError,
					equipment: ""
				});
			}
		} else if (event.key === "Enter" && !equipmentInput.trim()) {
			setFormError({
				...formError,
				equipment: "Please type a value."
			});
		}
	};

	const handleDeleteEquipment = equipmentToDelete => {
		setWorkoutProgram(prevProgram => ({
			...prevProgram,
			equipment: prevProgram.equipment
				.split(",")
				.filter(equipment => equipment !== equipmentToDelete).join(",")
		}));
	};

	const handleAddTag = event => {
		if (event.key === "Enter") {
			event.preventDefault();
			if (tagInput.trim()) {
				const currentTags = workoutProgram.tags;
				if (!currentTags.includes(tagInput.trim())) {
					const updatedTags = currentTags === "" ? tagInput.trim() : currentTags + "," + tagInput.trim();
					setWorkoutProgram(prevProgram => ({
						...prevProgram,
						tags: updatedTags
					}));
				} else {
					setFormError({
						...formError,
						tags: "Tag already added."
					});
				}
			}
			setTagInput("");
			setFormError({
				...formError,
				tags: ""
			});
		} else if (event.key === "Enter" && !equipmentInput.trim()) {
			setFormError({
				...formError,
				tags: "Please type a value."
			});
		}
	};

	const handleDeleteTag = tagToDelete => {
		setWorkoutProgram(prevProgram => ({
			...prevProgram,
			tags: prevProgram.tags.split(",").filter(tag => tag !== tagToDelete).join(",")
		}));
	};

	const handleChange = e => {
		const { name, value } = e.target;
		if (name === "duration") {
			if (value <= 0) {
				setFormError({...formError, duration: "Duration should be greater than 0"});
			} else {
				setFormError({...formError, duration: ""});
			}
		} else if (name === "price") {
			if (value < 0) {
				setFormError({...formError, price: "Price cannot be less than 0"});
			} else {
				setFormError({...formError, price: ""});
			}
		}
		setWorkoutProgram({ ...workoutProgram, [name]: value });
	};

	const handleSubmit = async e => {
		e.preventDefault();

		try {
			let response;
			if (id) {
				response = await apiRequest(
					"/edit-workout-program",
					"PUT",
					workoutProgram
				);
			} else {
				const programData = {
					...workoutProgram,
					equipment: workoutProgram.equipment,
					tags: workoutProgram.tags,
					trainer_id: trainerId
				};
				response = await apiRequest(
					"/create-workout-program",
					"POST",
					programData
				);
			}

			if (response) {
				if (id) {
					navigate(`/workout-program/${id}`);
				} else {
					navigate(`/workout-program/${response.id}`);
				}
			} else {
				setError("An error occurred. Please try again later.");
			}
		} catch (err) {
			setError(err.message);
		}
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

	if (error) {
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
					src={errorImage}
					alt="An error occurred"
					sx={{
						width: "200px",
						height: "200px"
					}}
				/>
				<Typography variant="h6">
					{error}
				</Typography>
			</Box>
		);
	}

	if (!trainerId) {
		return (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 1,
					alignItems: "center"
				}}
			>
				<CustomImage src={notFoundImage} alt="Insufficient access" />
				<Typography variant="h4" gutterBottom>
					Looks like you’re still in the trainee zone.
				</Typography>
				<Typography variant="body1" gutterBottom>
					Creating workout programs is a trainer’s gig!
				</Typography>
				<Button
					variant="contained"
					color="primary"
					href="/"
					sx={{ marginTop: 2 }}
				>
					Go to Home
				</Button>
			</Box>
		);
	}

	if (!isAllowed) {
		return (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 1,
					alignItems: "center"
				}}
			>
				<CustomImage src={notFoundImage} alt="Insufficient access" />
				<Typography variant="h4" gutterBottom>
					Sorry, this workout isn’t yours to tweak.
				</Typography>
				<Typography variant="body1" gutterBottom>
					Each trainer has their own creations!
				</Typography>
				<Button
					variant="contained"
					color="primary"
					href="/"
					sx={{ marginTop: 2 }}
				>
					Go to Home
				</Button>
			</Box>
		);
	}

	return (
		<Container maxWidth="sm">
			<Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
				<Typography variant="h5" gutterBottom>
				{id ? "Edit Workout Program" : "Add Workout Program"}
				</Typography>
				<form onSubmit={handleSubmit}>
					<TextField
						fullWidth
						label="Name"
						name="name"
						value={workoutProgram.name}
						onChange={handleChange}
						required
						margin="normal"
					/>
					<TextField
						fullWidth
						label="Description"
						name="description"
						value={workoutProgram.description}
						onChange={handleChange}
						required
						margin="normal"
						multiline
						rows={4}
					/>
					<TextField
						fullWidth
						label="Duration (days)"
						name="duration"
						type="number"
						value={workoutProgram.duration}
						onChange={handleChange}
						required
						margin="normal"
						error={formError.duration}
						helperText={formError.duration}
					/>
					<TextField
						fullWidth
						label="Equipment"
						name="equipment"
						variant="outlined"
						value={equipmentInput}
						onChange={e => setEquipmentInput(e.target.value)}
						onKeyDown={handleAddEquipment}
						margin="normal"
						error={!!formError.equipment}
						helperText={formError.equipment}
					/>
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
						{workoutProgram &&
							workoutProgram.equipment !== "" &&
							workoutProgram.equipment.split(",").map((equipment, index) =>
								<Chip
									key={index}
									label={equipment}
									onDelete={() => handleDeleteEquipment(equipment)}
									deleteIcon={
										<IconButton size="small">
											<CancelIcon />
										</IconButton>
									}
								/>
							)}
					</Box>
					<TextField
						fullWidth
						label="Tags"
						name="tags"
						variant="outlined"
						value={tagInput}
						onChange={e => setTagInput(e.target.value)}
						onKeyDown={handleAddTag}
						margin="normal"
						error={!!formError.tags}
						helperText={formError.tags}
					/>
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
						{workoutProgram &&
							workoutProgram.tags !== "" &&
							workoutProgram.tags.split(",").map((tag, index) =>
								<Chip
									key={index}
									label={tag}
									onDelete={() => handleDeleteTag(tag)}
									deleteIcon={
										<IconButton size="small">
											<CancelIcon />
										</IconButton>
									}
								/>
							)}
					</Box>
					<TextField
						fullWidth
						label="Price (INR)"
						name="price"
						type="number"
						value={workoutProgram.price}
						onChange={handleChange}
						required
						margin="normal"
						InputProps={{
							startAdornment: <InputAdornment position="start">₹</InputAdornment>,
						}}
						error={formError.price}
						helperText={formError.price}
					/>
					<FormControl fullWidth margin="normal">
						<InputLabel>Difficulty</InputLabel>
						<Select
							name="difficulty"
							value={workoutProgram.difficulty}
							onChange={handleChange}
							required
						>
							<MenuItem value={0}>Beginner</MenuItem>
							<MenuItem value={1}>Intermediate</MenuItem>
							<MenuItem value={2}>Advanced</MenuItem>
						</Select>
					</FormControl>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						sx={{ marginTop: 2 }}
						disabled={formError.duration || formError.price}
					>
						{id ? "Save Workout Program" : "Add Workout Program"}
					</Button>
				</form>
			</Paper>
		</Container>
	);
};

export default AddWorkoutProgram;
