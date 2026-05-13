<template>
  <nav class="h-[40px] w-full flex items-center px-4">
    <button @click="goBack">
      <i class="pi pi-arrow-left text-color ml-2"></i>
    </button>
  </nav>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goBack() {
  router.back();
}
</script>