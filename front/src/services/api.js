import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("Entrou no token", token);
  } else delete api.defaults.headers.common["Authorization"];
};
