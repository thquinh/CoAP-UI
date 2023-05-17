import axios from "axios";

export const isAxiosError = axios.isAxiosError;

export default axios.create({
  baseURL: "//localhost:9999/api/v1/gateway",
  headers: {
    "Content-Type": "application/json",
  },
});