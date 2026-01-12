"use client";

import httpClient from "./httpClient";
import { useLoaderStore } from "@/stores/loaderStore";

if (!httpClient.__loaderAttached) {
  httpClient.__loaderAttached = true;

  httpClient.interceptors.request.use((config) => {
    useLoaderStore.getState().showLoader();
    return config;
  });

  httpClient.interceptors.response.use(
    (res) => {
      useLoaderStore.getState().hideLoader();
      return res;
    },
    (err) => {
      useLoaderStore.getState().hideLoader();
      return Promise.reject(err);
    }
  );
}
