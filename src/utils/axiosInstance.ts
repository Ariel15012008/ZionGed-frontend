// src/utils/axiosInstance.ts
import axios, {
  AxiosError,
  type AxiosResponse,
  type AxiosRequestConfig,
} from "axios";

/**
 * Runtime config (S3) + fallback para Vite env (dev/build)
 * IMPORTANTE: config.js deve setar window.__APP_CONFIG__ antes do bundle.
 *
 * Exemplo public/config.js:
 * window.__APP_CONFIG__ = {
 *   VITE_API_URL_PROD: "https://rh.ziondocs.com.br/",
 *   VITE_API_URL_DEV: "http://localhost:8000/",
 *   VITE_API_ENVIRONMENT: "dev",
 * };
 */
type RuntimeConfig = {
  VITE_API_URL_PROD?: string;
  VITE_API_URL_DEV?: string;
  VITE_API_ENVIRONMENT?: "dev" | "prod";
};

declare global {
  interface Window {
    __APP_CONFIG__?: RuntimeConfig;
  }
}

function getRuntimeConfig(): Required<RuntimeConfig> {
  const fromWindow = (typeof window !== "undefined" ? window.__APP_CONFIG__ : undefined) || {};

  // fallback para import.meta.env (build/dev)
  const VITE_API_URL_PROD =
    fromWindow.VITE_API_URL_PROD ||
    (import.meta.env.VITE_API_URL_PROD as string) ||
    "https://rh.ziondocs.com.br/";

  const VITE_API_URL_DEV =
    fromWindow.VITE_API_URL_DEV ||
    (import.meta.env.VITE_API_URL_DEV as string) ||
    "http://localhost:8000/";

  const VITE_API_ENVIRONMENT =
    fromWindow.VITE_API_ENVIRONMENT ||
    (import.meta.env.VITE_API_ENVIRONMENT as "dev" | "prod") ||
    "dev";

  return {
    VITE_API_URL_PROD,
    VITE_API_URL_DEV,
    VITE_API_ENVIRONMENT,
  };
}

const cfg = getRuntimeConfig();

const baseURL =
  cfg.VITE_API_ENVIRONMENT === "prod" ? cfg.VITE_API_URL_PROD : cfg.VITE_API_URL_DEV;

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

const api = axios.create({
  baseURL,
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
        if (authFailedHandler) authFailedHandler();
        return Promise.reject(refreshError);
      }
    }

    if (status === 401 && !shouldSkipRefresh(requestUrl)) {
      if (authFailedHandler) authFailedHandler();
    }

    return Promise.reject(error);
  }
);

export default api;
