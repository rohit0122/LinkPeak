"use client";

import httpClient from "./httpClient";
import { useLoaderStore } from "@/stores/loaderStore";

if (!httpClient.__loaderAttached) {
  httpClient.__loaderAttached = true;

  httpClient.interceptors.request.use((config) => {
    if (!config.skipLoader) {
      useLoaderStore.getState().showLoader();
    }
    return config;
  });

  httpClient.interceptors.response.use(
    (res) => {
      if (!res.config.skipLoader) {
        useLoaderStore.getState().hideLoader();
      }
      return res;
    },
    (err) => {
      if (!err.config?.skipLoader) {
        useLoaderStore.getState().hideLoader();
      }
      return Promise.reject(err);
    }
  );
}
