<template>
  <div class="absolute left-4 right-4 bottom-20 fadeInUp">
    <div
      class="flex justify-around items-center rounded-3xl bg-white px-2 py-6 text-black shadow-lg z-50"
    >
      <div class="flex items-center justify-center bg-amber-300 w-20 h-20 rounded-xl">
        <i class="pi pi-image"></i>
      </div>
      <p class="text-sm text-gray-500 font-bold">{{ result }}</p>
      <button class="flex items-center justify-center bg-black p-4 rounded-4xl">
        <i class="pi pi-plus text-white"></i>
      </button>
      <!-- <p class="mt-1 break-all text-lg font-bold">{{ result }}</p> -->
    </div>
  </div>
</template>

<script setup>
defineProps({
  result: {
    type: String,
    required: true,
  },
});
</script>
