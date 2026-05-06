<script setup>
import { useBarcodeScanner } from "../../composables/useBarcodeScanner";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ScannerControl from "./ScannerControl.vue";
import ScannerResult from "./ScannerResult.vue";
import { findProductById } from "../../services/appScriptService";
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
  scanAgain,
} = useBarcodeScanner();

const route = useRoute();
const router = useRouter();
const product = ref(null);
const isLoadingProduct = ref(false);
const productError = ref("");

const selectedBranch = computed(() => {
  const branch = sessionStorage.getItem("selectedBranch");
  if (!branch) return null;

  try {
    return JSON.parse(branch);
  } catch {
    return null;
  }
  console.log(selectedBranch)
});

onMounted(async () => {
  if (route.query.autoStart == "1") {
    await startScanner();
  }
});

watch(
  () => result.value?.text,
  async (barcode) => {
    product.value = null;
    productError.value = "";

    if (!barcode) return;

    isLoadingProduct.value = true;
    if (!selectedBranch.value) {
      productError.value = "Chưa chọn chi nhánh";
      return;
    }
    isLoadingProduct.value = true;

    try {
      const foundProduct = await findProductById(barcode, selectedBranch.value.name);

      if (!foundProduct) {
        productError.value = "Không tìm thấy sản phẩm trong Google Sheet";
        return;
      }

      product.value = foundProduct;
    } catch (error) {
      console.error(error);
      productError.value = "Không thể lấy thông tin sản phẩm";
    } finally {
      isLoadingProduct.value = false;
    }
  },
);

function goBackToBranch() {
  stopScanner();
  router.push("/");
}
async function scanAgainBarcode() {
  product.value = null;
  productError.value = "";
  await scanAgain();
}
</script>
<template>
  <div class="h-screen overflow-hidden flex flex-col">
    <div
      class="flex w-full justify-between bg-transparent absolute top-0 left-0 right-0 p-4 z-50"
    >
      <button
        class="w-12 h-12 flex items-center justify-center rounded-full bg-black/10"
        @click="goBackToBranch"
      >
        <i class="pi pi-angle-left !text-xl text-white"></i>
      </button>
      <span
        v-if="selectedBranch"
        class="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600"
      >
        {{ selectedBranch.name }}
      </span>
      <button
        class="w-12 h-12 flex items-center justify-center rounded-full bg-black/10"
        @click="scanAgain"
      >
        <i class="pi pi-replay !text-xl text-white"></i>
      </button>
    </div>

    <div
      v-if="showCamera"
      class="relative w-full h-[100vh] bg-black overflow-hidden"
    >
      <video
        v-if="!result"
        ref="videoRef"
        autoplay
        muted
        playsinline
        class="h-full w-full object-cover"
      />

      <img
        v-else-if="result?.image"
        :src="result.image"
        class="h-full w-full object-cover blur-[2px] brightness-90"
      />

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
<p
      v-if="errorMessage"
      class="absolute left-4 right-4 top-20 z-50 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-600"
    >
      {{ errorMessage }}
    </p>
    <ScannerResult
      v-if="result"
      :barcode="result.text"
      :product="product"
      :loading="isLoadingProduct"
      :error-message="productError"
      @scan-again="scanAgainBarcode"
    />
  </div>
</template>
