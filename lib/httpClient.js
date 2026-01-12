"use client";

const API_FRONTEND_PATH = `${
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}/api`;

import axios from "axios";

const httpClient = axios.create({
  baseURL: API_FRONTEND_PATH,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // send cookies
});

export default httpClient;
