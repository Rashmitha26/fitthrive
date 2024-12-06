import axios from "axios";

export const getInitials = name => {
  const initials = name.split(" ").map(word => word[0]).join("");
  return initials.toUpperCase();
};

export const stringToColor = name => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

export const formatMinutesToMMSS = totalMinutes => {
  const totalSeconds = Math.floor(totalMinutes * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
};

export const isAuthenticated = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/auth/check-session', { withCredentials: true });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export const getTrainerId = async () => {
  try {
    return apiRequest("/get-trainer");
  } catch (err) {
    throw err;
  }
};

export const apiRequest = async (
  url,
  method = "GET",
  data = null,
  params = null
) => {
  try {
    const response = await axios({
      method,
      url: `http://localhost:8090${url}`,
      headers: {
        "Content-Type": "application/json"
      },
      data,
      params,
      withCredentials: true
    });
    if (
      (response.status === 200 && (method === "GET" || method === "PUT")) ||
      (response.status === 201 && method === "POST") ||
      (response.status === 204 && method === "DELETE") ||
      (url === "/get-trainer" &&
        method === "GET" &&
        (response.status === 200 || response.status === 204))
    ) {
      return response.data;
    }
    throw new Error(`Unexpected status code: ${response.status}`);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        const refreshResponse = await axios.post(
          "http://localhost:8090/api/auth/refresh-token",
          {},
          {
            withCredentials: true
          }
        );
        console.log(refreshResponse);
        const retryResponse = await axios({
          method,
          url: `http://localhost:8090${url}`,
          headers: {
            "Content-Type": "application/json"
          },
          data,
          params,
          withCredentials: true
        });
        if (
          (retryResponse.status === 200 &&
            (method === "GET" || method === "PUT")) ||
          (retryResponse.status === 201 && method === "POST") ||
          (retryResponse.status === 204 && method === "DELETE") ||
          (url === "/get-trainer" &&
            method === "GET" &&
            (refreshResponse.status === 200 || refreshResponse.status === 204))
        ) {
          return retryResponse.data;
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        window.location.href = "/login";
        throw refreshError;
      }
    }
    throw error;
  }
};
