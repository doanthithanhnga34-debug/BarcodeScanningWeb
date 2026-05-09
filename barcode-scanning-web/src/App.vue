<script setup>
import Toast from "primevue/toast";
</script>

<template>
  <Toast
    position="top-right"
    class="z-[9999]"
    :pt="{
      root: {
        class: `
        w-[92vw]
        max-w-md
        px-2
        sm:px-0
        mt-safe
      `,
      },
    }"
  />
  <router-view />
</template>
