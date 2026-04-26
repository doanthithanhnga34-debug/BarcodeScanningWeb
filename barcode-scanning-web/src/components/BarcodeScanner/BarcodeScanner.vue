<script setup>
import { useBarcodeScanner } from "../../composables/useBarcodeScanner";
const { videoRef,devices,showCamera, selectedDeviceId, result, isScanning,errorMessage, startScanner, stopScanner } = useBarcodeScanner();
</script>

<template>
  <div style="padding:20px">
    <h2>Scan Barcode</h2>

    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="startScanner">Bắt đầu quét</button>
    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full" @click="stopScanner">Dừng</button>

    <!-- 🔥 CHỈ HIỆN KHI showCamera = true -->
    <video
      v-if="showCamera"
      ref="videoRef"
      autoplay
      muted
      playsinline
      style="width:100%; max-width:400px"
    ></video>

    <h3>Kết quả:</h3>
    <p>{{ result }}</p>
  </div>
</template>