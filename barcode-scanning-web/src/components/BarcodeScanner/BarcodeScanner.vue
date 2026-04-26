

<template>
  <div class="p-5">
    <h2 class="mb-4 text-xl font-bold">Scan mã hàng sản phẩm</h2>

    <div class="mb-4 flex gap-2">
      <button
        class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
        :disabled="isScanning"
        @click="startScanner"
      >
        Bắt đầu quét
      </button>

      <button
        class="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 disabled:opacity-50"
        :disabled="!isScanning"
        @click="stopScanner"
      >
        Dừng
      </button>
    </div>

    <div
      v-if="showCamera"
      class="relative overflow-hidden rounded-xl bg-black"
      style="width: 100%; max-width: 420px"
    >
      <video
        ref="videoRef"
        autoplay
        muted
        playsinline
        class="w-full"
      ></video>

      <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div class="h-24 w-72 rounded-xl border-4 border-white"></div>
      </div>
    </div>

    <p v-if="errorMessage" class="mt-3 text-red-500">
      {{ errorMessage }}
    </p>

    <h3 class="mt-4 font-bold">Kết quả:</h3>

    <p
      v-if="result"
      class="mt-2 break-all rounded bg-gray-100 p-3 text-lg font-semibold"
    >
      {{ result }}
    </p>

    <p v-else class="mt-2 text-gray-500">
      Chưa có mã nào được quét.
    </p>
  </div>
</template>

<script setup>
import { useBarcodeScanner } from "../../composables/useBarcodeScanner";
const { videoRef,devices,showCamera, selectedDeviceId, result, isScanning,errorMessage, startScanner, stopScanner, loadDevices } = useBarcodeScanner();
</script>