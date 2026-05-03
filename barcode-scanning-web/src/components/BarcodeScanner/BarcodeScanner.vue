<script setup>
import { useBarcodeScanner } from "../../composables/useBarcodeScanner";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ScannerControl from "./ScannerControl.vue";
import ScannerResult from "./ScannerResult.vue";
const {
  videoRef,
  devices,
  showCamera,
  selectedDeviceId,
  result,
  isScanning,
  errorMessage,
  startScanner,
  stopScanner,
  loadDevices,
} = useBarcodeScanner();

const route = useRoute();
const router = useRouter();

const selectedBranch = computed(() => {
  const branch = sessionStorage.getItem("selectedBranch");
  if (!branch) return null;

  try {
    return JSON.parse(branch);
  } catch {
    return null;
  }
});

onMounted(async () => {
  if (route.query.autoStart == "1") {
    await startScanner();
  }
});

function goBackToBranch() {
  stopScanner();
  router.push("/");
}
</script>
<template>
  <div class="h-screen overflow-hidden flex flex-col">
    <div
      class="flex w-full bg-transparent absolute top-0 left-0 right-0 p-4 z-50"
    >
      <button
        class="w-12 h-12 flex items-center justify-center rounded-full bg-black/10"
        @click="goBackToBranch"
      >
        <i class="pi pi-angle-left !text-xl text-white"></i>
        <!-- <p>Scanner Barcode</p>
      <button>

      </button> -->
      </button>
      <span
        v-if="selectedBranch"
        class="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600"
      >
        {{ selectedBranch.name }}
      </span>
    </div>

    <div
      v-if="showCamera"
      class="relative w-full h-[100vh] bg-black overflow-hidden"
    >
      <video
        ref="videoRef"
        autoplay
        muted
        playsinline
        class="h-full w-full object-cover"
      ></video>

      <div
        class="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div class="relative w-3/4 h-28">
          <!-- TL -->
          <div
            class="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white"
          ></div>

          <!-- TR -->
          <div
            class="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white"
          ></div>

          <!-- BL -->
          <div
            class="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white"
          ></div>

          <!-- BR -->
          <div
            class="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white"
          ></div>
        </div>
      </div>
    </div>

    <!-- <p
      v-if="result"
      class="mt-2 break-all rounded bg-gray-100 p-3 text-lg font-semibold"
    >
      {{ result }}
    </p>
  -->

    <ScannerResult v-if="result" :result ="result" />
    <!-- <p v-else class="mt-2 text-gray-500">Chưa có mã nào được quét.</p> -->
  </div>
</template>
