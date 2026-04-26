<script setup>
import { useBarcodeScanner } from "../../composables/useBarcodeScanner";
const { videoRef,devices, selectedDeviceId, result, isScanning,errorMessage, startScanner, stopScanner } = useBarcodeScanner();
</script>

<template>
  <div style="padding:20px">
    <h2>Scan Barcode</h2>

    <button v-if="!isScanning" @click="startScanner">
      Bắt đầu quét
    </button>

    <video
      v-if="isScanning"
      ref="videoRef"
      autoplay
      muted
      playsinline
      style="width:100%; max-width:400px"
    ></video>

    <p>{{ result }}</p>
    <p style="color:red">{{ errorMessage }}</p>
  </div>
</template>