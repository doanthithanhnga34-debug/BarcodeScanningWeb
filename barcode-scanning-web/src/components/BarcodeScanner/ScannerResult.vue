<template>
  <div class="absolute left-4 right-4 top-4 rounded-xl bg-white p-4 text-black shadow-lg">
    <p class="text-sm text-gray-500">Scanned Barcode</p>
    <p class="mt-1 break-all text-lg font-bold">{{ result }}</p>
  </div>
</template>

<script setup>
defineProps({
  result: {
    type: String,
    required: true,
  },
})
</script>