import axios from "axios";
import { ENV } from "./env";

export const API = axios.create({
  baseURL: `${ENV.BACKEND_URI}`,
});
