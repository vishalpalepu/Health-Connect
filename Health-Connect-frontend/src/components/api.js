import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000", // Your backend base URL
//   withCredentials: true, // Send cookies if required
// });

const api = axios.create({
  baseURL:
    "https://eca8-2409-40f2-1030-4480-4817-3284-2374-9a23.ngrok-free.app", // Your backend base URL
  withCredentials: true, // Send cookies if required
});

export default api;
