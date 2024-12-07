<script setup lang="ts">
import { RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { watch } from "vue";
import Cookie from "js-cookie";
// import { computed, provide } from "vue";
// const credentials = computed(() => authStore.credentials);
// provide("credentials", credentials);
const authStore = useAuthStore();
authStore.loadStoredCredentials();
// watch(
// 	() => Cookie.get("token"),
// 	(newToken) => {
// 		console.log("mantap gak", newToken);
// 		if (!newToken) {
// 			console.log("mantap", newToken);
// 			authStore.credentials = undefined; // Clear credentials if token is removed
// 		}
// 	},
// );
</script>

<template>
  <RouterView />
</template>
