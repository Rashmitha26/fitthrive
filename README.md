# FitThrive

## Introduction
**FitThrive** is a web application built with **Spring Boot** (Java) for the backend and **React** for the frontend. The application allows users to:

- **Register** and **Login** to their accounts.
- **Enroll in workout programs** and track their workout programs.
- **Trainers** can create workout programs and manage workouts.

The application uses **JWT tokens** for secure authentication.

## Features

### For Users:
- **Registration & Login**: Users can create an account and log in.
- **Workout Program Enrollment**: Users can browse and enroll in available workout programs.
- **Program Tracking**: Users can track the programs they are enrolled in.

### For Trainers:
- **Workout Program Creation**: Trainers can create new workout programs.
- **Workout Creation**: Trainers can add and manage individual workouts within their programs.

## Tech Stack

- **Backend**: 
  - **Spring Boot** (Java)
  - **JWT Authentication** for secure login and authorization
  - **Spring Data JPA** with **PostgreSQL** database

- **Frontend**:
  - **React.js**
  - **Axios** for API calls
  - **React Router** for navigation
