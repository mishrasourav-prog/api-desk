import axios from "axios";

const api = axios.create({
  // hardcoded url to be changed 
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export default api;