<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import Header from "./Common/Header.vue";
import BranchSelectionPage from "../pages/BranchSelectionPage.vue";
import { syncOfflineExpiryQueue } from "../services/offlineExpirySync";


function handleOnline(){
  syncOfflineExpiryQueue();
}
onMounted(()=>{
  window.addEventListener("online", handleOnline);
  syncOfflineExpiryQueue();
})

onUnmounted(()=>{
  window.removeEventListener("online", handleOnline);
})


</script>

<template>
  <Header />
  <BranchSelectionPage />
</template>

