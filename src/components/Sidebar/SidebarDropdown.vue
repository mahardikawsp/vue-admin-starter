<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar'
import { ref } from 'vue'

const sidebarStore = useSidebarStore()

const props = defineProps(['items', 'page'])
const items = ref(props.items)

const handleItemClick = (index: number) => {
  const pageName =
    sidebarStore.selected === props.items[index].label ? '' : props.items[index].label
  sidebarStore.selected = pageName
}
</script>

<template>
  <ul class="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
    <template v-for="(childItem, index) in items" :key="index">
      <li>
        <router-link
          :to="childItem.path"
          @click="handleItemClick(index)"
          class="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white"
          :class="{
            '!text-white': childItem.label === sidebarStore.selected
          }"
        >
          {{ childItem.label }}
        </router-link>
      </li>
    </template>
  </ul>
</template>

<!-- <script setup lang="ts">
const props = defineProps<{
  items: Array<{
    id: number;
    uid: number;
    nama: string;
    path: string;
    namaIkon: string;
    parentUid: number;
    status: {
      isTabs: boolean;
      isTampil: boolean;
      isExpanded: boolean;
    };
    hakAkses: string[];
  }>;
  currentPage: string;
  page: string;
}>();
</script>

<template>
  <ul>
    
    <li v-for="(child, index) in items" :key="child.id">
      <router-link
        :to="child.path"
        class="group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4"
        :class="{
          'bg-graydark dark:bg-meta-4': currentPage === child.nama
        }"
      >
        <span v-html="child.namaIkon"></span>
        {{ child.nama }}
      </router-link>
    </li>
  </ul>
</template> -->
