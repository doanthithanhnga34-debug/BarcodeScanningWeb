<template>
  <div class="absolute bottom-0 left-0 right-0 p-4 bg-black/70">
    <button
      v-if="!isScanning"
      class="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black"
      @click="$emit('start')"
    >
      Start Scanner
    </button>

    <button
      v-else
      class="w-full rounded-xl bg-red-500 px-4 py-3 font-semibold text-white"
      @click="$emit('stop')"
    >
      Stop Scanner
    </button>
  </div>
</template>

<script setup>
defineProps({
  isScanning: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['start', 'stop'])
</script>