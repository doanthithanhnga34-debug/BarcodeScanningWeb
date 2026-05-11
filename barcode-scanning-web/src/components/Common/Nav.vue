<template>
  <nav class="sticky top-0 h-[50px] w-full flex items-center px-4">
    <button @click="goBack"><i class="pi pi-arrow-left text-color"></i></button>
  </nav>
</template>
<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
function goBack() {
  router.back();
}
</script>
