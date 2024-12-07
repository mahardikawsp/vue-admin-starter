<script setup lang="ts">
const props = defineProps({
  modelValue: [String, Number], // The value passed by v-model
  label: String,
  type: String,
  placeholder: String,
});

const emit = defineEmits(['update:modelValue']); // Emits the value update

function updateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value); // Emit updated value
}
</script>

<template>
  <div class="mb-4">
    <label class="mb-2.5 block font-medium text-black dark:text-white">{{ label }}</label>
    <div class="relative">
      <input
        :value="props.modelValue" 
        @input="updateValue"
        :type="props.type"
        :placeholder="props.placeholder"
        class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"
      />

      <span class="absolute right-4 top-4">
        <slot></slot>
      </span>
    </div>
  </div>
</template>
