import { createRouter, createWebHistory } from "vue-router";

import SigninView from "@/views/Authentication/SigninView.vue";
import SignupView from "@/views/Authentication/SignupView.vue";
import CalendarView from "@/views/CalendarView.vue";
import BasicChartView from "@/views/Charts/BasicChartView.vue";
import ECommerceView from "@/views/Dashboard/ECommerceView.vue";
import FormElementsView from "@/views/Forms/FormElementsView.vue";
import FormLayoutView from "@/views/Forms/FormLayoutView.vue";
import SettingsView from "@/views/Pages/SettingsView.vue";
import ProfileView from "@/views/ProfileView.vue";
import TablesView from "@/views/TablesView.vue";
import AlertsView from "@/views/UiElements/AlertsView.vue";
import ButtonsView from "@/views/UiElements/ButtonsView.vue";
import { useAuthStore } from "@/stores/auth";
import { ref, watch } from "vue";
import Cookie from "js-cookie";

const routes = [
	{
		path: "/",
		name: "Dashboard",
		component: ECommerceView,
		meta: {
			requiresAuth: true,
			title: "Dashboard",
		},
	},
	{
		path: "/gate/apps",
		name: "gateApps",
		component: CalendarView,
		meta: {
			requiresAuth: true,
			title: "Apps",
		},
	},
	{
		path: "/gate/branch",
		name: "gateBranch",
		component: ProfileView,
		meta: {
			requiresAuth: true,
			title: "Branch",
		},
	},
	{
		path: "/gate/groupmenu",
		name: "gateGroupMenu",
		component: FormElementsView,
		meta: {
			requiresAuth: true,
			title: "Group Menu",
		},
	},
	{
		path: "/gate/employee",
		name: "gateEmployee",
		component: FormLayoutView,
		meta: {
			requiresAuth: true,
			title: "Karyawan",
		},
	},
	{
		path: "/gate/user",
		name: "gateUser",
		component: TablesView,
		meta: {
			requiresAuth: true,
			title: "User",
		},
	},
	{
		path: "/rme/pasien",
		name: "rmePasien",
		component: SettingsView,
		meta: {
			requiresAuth: true,
			title: "Pasien",
		},
	},
	{
		path: "/charts/basic-chart",
		name: "basicChart",
		component: BasicChartView,
		meta: {
			title: "Basic Chart",
		},
	},
	{
		path: "/ui-elements/alerts",
		name: "alerts",
		component: AlertsView,
		meta: {
			title: "Alerts",
		},
	},
	{
		path: "/ui-elements/buttons",
		name: "buttons",
		component: ButtonsView,
		meta: {
			title: "Buttons",
		},
	},
	{
		path: "/auth/signin",
		name: "signin",
		component: SigninView,
		meta: {
			title: "Signin",
		},
	},
	{
		path: "/auth/signup",
		name: "signup",
		component: SignupView,
		meta: {
			title: "Signup",
		},
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
	scrollBehavior(to, from, savedPosition) {
		return savedPosition || { left: 0, top: 0 };
	},
});

const token = Cookie.get("token");
console.log(token, " apa ini");

router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore();
	const isAuthenticated = authStore.credentials?.accessToken;

	const token = Cookie.get("token");
	const refreshToken = Cookie.get("refreshToken");

	// Check if the token is missing
	if (!token && refreshToken) {
		console.log("Access token is missing, attempting to refresh...");

		// Attempt to refresh the token
		const success = await authStore.refreshSignin();
		if (success) {
			console.log("Token refreshed successfully.");
			next(); // Proceed to the intended route
			return;
		} else {
			console.log("Failed to refresh token. Redirecting to signin...");
			authStore.removeCredentials();
			next({ name: "signin" }); // Redirect to sign-in
			return;
		}
	}

	console.log(isAuthenticated, " auth gak");
	if (to.path === "/auth/signin" && isAuthenticated) {
		next({ path: "/" });
	} else if (to.meta.requiresAuth && !isAuthenticated) {
		next({ name: "signin" });
	} else {
		document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`;
		next();
	}
});

export default router;
