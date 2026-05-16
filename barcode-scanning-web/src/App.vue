<script setup>
import Toast from "primevue/toast";
</script>

<template>
  <Toast
    position="top-center"
    class="z-[9999]"
    :pt="{
      root: {
        class: `
        top-20 
        right-4
        w-[70vw]
        max-w-md
        mx-2
        sm:px-0
        mt-safe
      `,
      },
    }"
  />
  <router-view />
</template>
