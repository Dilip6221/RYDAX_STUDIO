import axios from 'axios';

const SKIPPED_LOADER_ENDPOINTS = [
  "/auth/user",
  "/user/login",
  "/user/register",
  "/user/logout",
  "/user/forget-pass",
  "/auth/send-otp",
  "/auth/verify-otp",
  "/auth/complete-profile",
  "blog/like-toggle",
];

const shouldSkipGlobalLoader = (config = {}) => {
  const url = config.url || "";
  const explicitlySkipped = config.skipGlobalLoader === true;
  const matchesSkippedEndpoint = SKIPPED_LOADER_ENDPOINTS.some((endpoint) => url.includes(endpoint));

  return explicitlySkipped || matchesSkippedEndpoint;
};

export const attachGlobalLoader = (loaderApi) => {
  const requestInterceptor = axios.interceptors.request.use((config) => {
    if (shouldSkipGlobalLoader(config)) {
      return config;
    }

    const loaderText = config.loaderText || "Loading...";
    loaderApi.startRequest(loaderText);
    return config;
  });

  const responseInterceptor = axios.interceptors.response.use(
    (response) => {
      if (!shouldSkipGlobalLoader(response?.config)) {
        loaderApi.endRequest();
      }

      return response;
    },
    (error) => {
      if (!shouldSkipGlobalLoader(error?.config)) {
        loaderApi.endRequest();
      }

      return Promise.reject(error);
    }
  );

  return () => {
    axios.interceptors.request.eject(requestInterceptor);
    axios.interceptors.response.eject(responseInterceptor);
  };
};
