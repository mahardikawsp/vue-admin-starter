import axios from "axios";
import type { AxiosResponse } from "axios";
import { useAuthStore } from "@/stores/auth"; // Assuming you have an auth Pinia store
// import { useAppStore } from '@/stores/app'; // Assuming you have an app Pinia store
// import { sleeper } from '@/utils/sleeper'; // Utility for delays
import type { GetParam } from "./type";
import Cookies from "js-cookie";
import type { BaseGetAllResponse, BaseResponse } from "./http.type";

// Axios instance for general requests
export const http = axios.create({
	baseURL: "http://192.168.60.41/api/",
	headers: { "Content-Type": "application/json" },
});

// Axios instance for file-related requests
export const httpFile = axios.create({
	baseURL: import.meta.env.VITE_BE_SERVER,
	timeout: 3000,
	headers: { "Content-Type": "multipart/form-data" },
});

// HTTP Methods
export const useHttpGet = async <T>(endpoint: string, params?: any) => {
	return http.get<any, BaseResponse<T>>(endpoint, { params });
};

export const useHttpPost = async <T>(endpoint: string, body?: any) => {
	return http.post<any, BaseResponse<T>>(endpoint, body);
};

export const useHttpPut = async <T>(endpoint: string, body?: any) => {
	return http.put<any, BaseResponse<T>>(endpoint, body);
};

export const useHttpDelete = async <T>(endpoint: string) => {
	return http.delete<any, BaseResponse<T>>(endpoint);
};

export const useHttpPatch = async <T>(endpoint: string, body?: any) => {
	return http.patch<any, BaseResponse<T>>(endpoint, body);
};

export const useHttpGetAll = async <T>(endpoint: string, params?: GetParam) => {
	return http.get<any, BaseGetAllResponse<T>>(endpoint, { params });
};

// File-related Methods
export const useHttpFile = async (path: string) => {
	return httpFile.get<any, File>(path, { responseType: "blob" });
};

export const useHttpPostFile = async <T>(endpoint: string, body?: any) => {
	return httpFile.post<any, T>(endpoint, body);
};

// Axios Interceptors
// http.interceptors.request.use(
// 	(config) => {
// 		const authStore = useAuthStore();
// 		if (authStore.credentials?.accessToken) {
// 			const { accessToken, refreshToken } = authStore.credentials;

// 			if (config.url === "gate/auth/refresh") {
// 				config.headers.Authorization = `Bearer ${refreshToken}`;
// 			} else {
// 				config.headers.Authorization = `Bearer ${accessToken}`;
// 			}
// 		}

// 		// if (config.url === "gate/auth/signin") return config;

// 		// const { accessToken, refreshToken } = authStore.credentials;

// 		// if (config.url === "gate/auth/refresh") {
// 		// 	config.headers.Authorization = `Bearer ${refreshToken}`;
// 		// } else {
// 		// 	config.headers.Authorization = `Bearer ${accessToken}`;
// 		// }

// 		return config;
// 	},
// 	(error) => Promise.reject(error),
// );

http.interceptors.request.use((config) => {
	const authStore = useAuthStore();
	const data = Cookies.get("token");
	const token = data ? JSON.parse(data).accessToken : null;

	if (token) {
		config.headers["Authorization"] = `Bearer ${token}`;
	}
	console.log(config, "apa config");

	return config;
});

async function waitForTokenRefresh() {
	const authStore = useAuthStore();
	//   await sleeper(0.1);
	if (!authStore.isRefreshingToken) return;
	await waitForTokenRefresh();
}

http.interceptors.response.use(
	(response: AxiosResponse) => response.data,
	async (error) => {
		const authStore = useAuthStore();
		// const appStore = useAppStore();

		const { status } = error.response || {};
		console.log(status, "apa ya isinya");
		const originalRequest = error.config;

		if (status === 401) {
			const whitelist = ["gate/auth/signin", "gate/auth/refresh"];

			if (originalRequest.retry || whitelist.includes(originalRequest.url)) {
				authStore.removeCredentials();
				// appStore.setSidebarMenu([]);
				return Promise.reject(error);
			}

			originalRequest.retry = true;

			if (authStore.isRefreshingToken) {
				await waitForTokenRefresh();
				originalRequest.headers.Authorization = `Bearer ${authStore.credentials?.refreshToken}`;
				return http(originalRequest);
			}

			const result = await authStore.refreshSignin();
			if (!result) {
				authStore.removeCredentials();
				// appStore.setSidebarMenu([]);
				return Promise.reject(error);
			}

			originalRequest.headers.Authorization = `Bearer ${authStore.credentials?.accessToken}`;
			return http(originalRequest);
		}

		return Promise.reject(error);
	},
);

// http.interceptors.response.use(
// 	(response) => response,
// 	async (error) => {
// 	  const authStore = useAuthStore();

// 	  // If accessToken is expired and refreshToken exists, try refreshing
// 	  if (error.response?.status === 401 && Cookies.get("refreshToken")) {
// 		const success = await authStore.refreshSignin();

// 		if (success) {
// 		  // Retry the failed request with new accessToken
// 		  const originalRequest = error.config;
// 		  originalRequest.headers["Authorization"] = `Bearer ${Cookies.get("token")}`;
// 		  return axios(originalRequest);
// 		}
// 	  }

// 	  // If refreshSignin fails, logout the user
// 	  if (error.response?.status === 401) {
// 		authStore.signOut();
// 	  }

// 	  return Promise.reject(error);
// 	}
//   );
