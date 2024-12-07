import { http } from "@/app/http";
import { defineStore } from "pinia";
import Cookies from "js-cookie";
import type { AuthResponse, Branch, StringOpt } from "@/app/type";
import { decodeJWT } from "@/app/helper";

type AuthState = {
	isPostingSignin: boolean;
	credentials?: AuthResponse;
	isSwitchingBranch: boolean;
	currentBranch?: StringOpt;
	branches?: StringOpt[];
	branch?: Branch;
	isRefreshingToken: boolean;
	isSigningOut: boolean;
};

const initialState: AuthState = {
	isPostingSignin: false,
	isSwitchingBranch: false,
	isRefreshingToken: false,
	isSigningOut: false,
};

export const useAuthStore = defineStore("auth", {
	state: () => ({
		...initialState,
	}),
	getters: {
		setCredentials(): boolean {
			const data = Cookies.get("token");
			if (data) {
				this.credentials = JSON.parse(data);
			} else {
				this.credentials = undefined; // Clear credentials if no token
			}
			return !!this.credentials;
		},
	},
	actions: {
		async login(userUnique: string, password: string) {
			try {
				const response = await http.post("/gate/auth/signin", {
					userUnique,
					password,
				});
				Cookies.set("token", JSON.stringify(response.data), {
					expires: decodeJWT(response.data.accessToken),
					path: "/",
				});
				Cookies.set("refreshToken", response.data.refreshToken, {
					expires: decodeJWT(response.data.refreshToken),
					path: "/",
				});
				const data = Cookies.get("token");
				this.credentials = JSON.parse(data);
				return true;
			} catch (error: any) {
				// this.errorMessage =
				// 	error.response?.data?.message || "Login failed. Please try again.";
				console.log(error);
				return false;
			}
		},
		async refreshSignin() {
			const refreshToken = Cookies.get("refreshToken");
			if (!refreshToken) {
				return false;
			}
			try {
				this.isRefreshingToken = true;
				const response = await http.post(
					"/gate/auth/refresh",
					{},
					{
						headers: { Authorization: `Bearer ${refreshToken}` },
					},
				);
				Cookies.set("token", JSON.stringify(response.data), {
					expires: decodeJWT(response.data.accessToken),
					path: "/",
				});
				Cookies.set("refreshToken", response.data.refreshToken, {
					expires: decodeJWT(response.data.refreshToken),
					path: "/",
				});
				const data = Cookies.get("token");
				this.credentials = JSON.parse(data);
				return true;
			} catch (error) {
				console.error("Failed to refresh token:", error);
				return false;
			} finally {
				this.isRefreshingToken = false;
			}
		},
		async signout(userId: number, authLogId: number) {
			try {
				await http.post("/gate/auth/signout", { userId, authLogId });
				localStorage.removeItem("menuGroups");
				Cookies.remove("token");
				Cookies.remove("refreshToken");
				this.isRefreshingToken = false;
				this.removeCredentials();
				return true;
			} catch (error: any) {
				return false;
			}
		},
		loadStoredCredentials() {
			const token = Cookies.get("token");
			const refreshToken = Cookies.get("refreshToken");

			if (token) {
				// If token exists, load it into the credentials
				this.credentials = JSON.parse(token);
				console.log("token masih ada");
			} else if (refreshToken) {
				console.log("token tidak ada, refrsh toekn");
				this.refreshSignin;
			}
		},
		removeCredentials() {
			this.credentials = {
				accessToken: "",
				refreshToken: "",
			} as AuthResponse;
		},
		reset() {
			Object.assign(this, this.$reset());
		},
	},
	persist: {
		enabled: true,
	},
});
