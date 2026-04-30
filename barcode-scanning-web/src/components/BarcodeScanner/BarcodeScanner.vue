<script setup>
import { useBarcodeScanner } from "../../composables/useBarcodeScanner";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
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

const selectedBranch = computed(()=>{
  const branch = sessionStorage.getItem("selectedBranch");
  if (!branch) return null;

  try {
    return JSON.parse(branch);
  } catch {
    return null;
  }
})

onMounted(async ()=>{
  if(route.query.autoStart =="1"){
    await startScanner();
  }
})

function goBackToBranch(){
  stopScanner();
  router.push('/')
}
</script>
<template>
  <div class="p-5">

    <div class="mb-4 flex gap-2">
      <button
        class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
        @click="goBackToBranch"
      >
        ← Branches
      </button>
      <!-- <button
        class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
        :disabled="isScanning"
        @click="startScanner"
      >
        Bắt đầu quét
      </button> -->
      <span
        v-if="selectedBranch"
        class="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600"
      >
        {{ selectedBranch.name }}
      </span>
    </div>
    <div class="mb-5">
      <h2 class="text-2xl font-extrabold text-slate-950">
        Scan mã hàng sản phẩm
      </h2>

      <p class="mt-1 text-sm text-slate-500">
        Đưa mã vạch sản phẩm vào khung để quét.
      </p>
    </div>

    <div
      v-if="showCamera"
      class="relative w-full overflow-hidden rounded-3xl bg-black shadow-lg"
  style="aspect-ratio: 4 / 3"
    >
      <video
        ref="videoRef"
        autoplay
        muted
        playsinline
        class="h-full w-full object-contain"
      ></video>

      <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div class="w-3/4 h-24 border-4 border-white rounded-xl"></div>
      </div>
    </div>

    <p
      v-if="result"
      class="mt-2 break-all rounded bg-gray-100 p-3 text-lg font-semibold"
    >
      {{ result }}
    </p>

    <p v-else class="mt-2 text-gray-500">Chưa có mã nào được quét.</p>
  </div>
</template>
