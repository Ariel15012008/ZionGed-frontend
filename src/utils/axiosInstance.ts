// src/utils/axiosInstance.ts
import axios, {
  AxiosError,
  type AxiosResponse,
  type AxiosRequestConfig,
} from "axios";

const url =
  import.meta.env.VITE_API_ENVIRONMENT === "prod"
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL_DEV;

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

const api = axios.create({
  baseURL: url,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

function shouldSkipRefresh(requestUrl?: string) {
  if (!requestUrl) return true;
  const u = requestUrl.toLowerCase();
  return (
    u.includes("/auth/refresh") ||
    u.includes("/auth/login") ||
    u.includes("/auth/logout")
  );
}

let authFailedHandler: (() => void) | null = null;

export function setAuthFailedHandler(handler: () => void) {
  authFailedHandler = handler;
}

let refreshPromise: Promise<AxiosResponse<any>> | null = null;

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig | undefined;
    const status = error.response?.status;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || "";
    const canAttemptRefresh =
      status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh(requestUrl);

    if (canAttemptRefresh) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = api.post("/auth/refresh").finally(() => {
          refreshPromise = null;
        });
      }

      try {
        await refreshPromise;
        return api(originalRequest);
      } catch (refreshError) {
        if (authFailedHandler) {
          authFailedHandler();
        }
        return Promise.reject(refreshError);
      }
    }

    if (status === 401 && !shouldSkipRefresh(requestUrl)) {
      if (authFailedHandler) {
        authFailedHandler();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
