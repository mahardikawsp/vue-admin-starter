<script setup lang="ts">
import { useSidebarStore } from "@/stores/sidebar";
import { onClickOutside } from "@vueuse/core";
import { onMounted, ref, watch } from "vue";
import SidebarItem from "./SidebarItem.vue";
import { http } from "@/app/http";
import { useAuthStore } from "@/stores/auth";
import Cookie from "js-cookie";

const target = ref(null);

const sidebarStore = useSidebarStore();
const authStore = useAuthStore();

onClickOutside(target, () => {
	sidebarStore.isSidebarOpen = false;
});

const menuGroups = ref<any[]>([]);

const fetchMenu = async () => {
	const cachedMenu = localStorage.getItem("menuGroups");
	if (!cachedMenu) {
		try {
			const response = await http.get("gate/usermenu/mylv/SB2");
			const mapped = response.data.map((data: any) => {
				return {
					...data,
					label: data.nama,
					route: data.path,
					childs: data.childs?.map((child: any) => ({
						...child,
						label: child.nama,
						route: child.path,
					})), //
				};
			});
			menuGroups.value = mapped || [];
			localStorage.setItem("menuGroups", JSON.stringify(menuGroups.value));
		} catch (error) {
			console.error("Error fetching menu:", error);
			const cachedMenu = localStorage.getItem("menuGroups");
			if (cachedMenu) {
				menuGroups.value = JSON.parse(cachedMenu);
			}
		}
	} else {
		menuGroups.value = JSON.parse(cachedMenu);
	}
};

// watch(
// 	() => Cookie.get("token"),
// 	(newToken) => {
// 		if (!newToken) {
//       console.log('mantap', token)
// 			authStore.credentials = undefined; // Clear credentials if token is removed
// 		}
// 	},
// );

onMounted(() => {
	console.log("is token is there", authStore.credentials?.accessToken);
	if (authStore.credentials?.accessToken) {
		// Check if the user is authenticated
		fetchMenu();
	} else {
		// const cachedMenu = localStorage.getItem("menuGroups");
		// if (cachedMenu) {
		// 	menuGroups.value = JSON.parse(cachedMenu);
		// }
	}
});
</script>

<template>
  <aside
    class="absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0"
    :class="{
      'translate-x-0': sidebarStore.isSidebarOpen,
      '-translate-x-full': !sidebarStore.isSidebarOpen
    }"
    ref="target"
  >
    <!-- SIDEBAR HEADER -->
    <div class="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
      <router-link to="/">
        <img src="@/assets/images/logo/logo.svg" alt="Logo" />
      </router-link>

      <button class="block lg:hidden" @click="sidebarStore.isSidebarOpen = false">
        <svg
          class="fill-current"
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
            fill=""
          />
        </svg>
      </button>
    </div>
    <!-- SIDEBAR HEADER -->

    <div class="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
      <!-- Sidebar Menu -->
      <nav class="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
        <!-- <template v-for="menuGroup in menuGroups" :key="menuGroup.nama"> -->
          <div>
            <!-- <h3 class="mb-4 ml-4 text-sm font-medium text-bodydark2">{{ menuGroup.nama }}</h3> -->

            <ul class="mb-6 flex flex-col gap-1.5">
              <SidebarItem
                v-for="(menuGroup, index) in menuGroups"
                :item="menuGroup"
                :key="index"
                :index="index"
              />
            </ul>
          </div>
        <!-- </template> -->
      </nav>
      <!-- Sidebar Menu -->

      <!-- Promo Box -->
      <div
        class="mx-auto mb-10 w-full max-w-60 rounded-sm border border-strokedark bg-boxdark py-6 px-4 text-center shadow-default"
      >
        <h3 class="mb-1 font-semibold text-white">TailAdmin Pro</h3>
        <p class="mb-4 text-xs">Get All Dashboards and 300+ UI Elements</p>
        <a
          href="https://tailadmin.com/pricing"
          target="_blank"
          rel="nofollow"
          class="flex items-center justify-center rounded-md bg-primary p-2 font-medium text-white hover:bg-opacity-90"
        >
          Purchase Now
        </a>
      </div>
      <!-- Promo Box -->
    </div>
  </aside>
</template>
