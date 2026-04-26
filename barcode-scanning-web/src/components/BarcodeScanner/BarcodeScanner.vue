<script setup>
import { useBarcodeScanner } from "@/composables/useBarcodeScanner";

const { videoRef,devices, selectedDeviceId, result, isScanning,errorMesage, startScanner, stopScanner } = useBarcodeScanner();
</script>

<template>
  <div style="padding: 20px">
    <h2>Scan Barcode</h2>
<select v-model="selectedDeviceId" v-if="devices.length > 1">
      <option
        v-for="device in devices"
        :key="device.deviceId"
        :value="device.deviceId"
      >
        {{ device.label || "Camera" }}
      </option>
    </select>
    <video
      ref="videoRef"
      style="width: 100%; max-width: 400px"
    ></video>

    <br /><br />

    <button @click="startScanner">
      {{ isScanning ? "Đang quét..." : "Bắt đầu quét" }}
    </button>
     <button @click="stopScanner">Dừng</button>

    <h3>Kết quả:</h3>
    <p>{{ result }}</p>

     <p style="color:red">{{ errorMessage }}</p>
  </div>
</template>