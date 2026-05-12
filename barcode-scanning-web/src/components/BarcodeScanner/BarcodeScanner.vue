<script setup>
import { useBarcodeScanner } from "../../composables/useBarcodeScanner";
import { computed, onMounted, ref, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import ScannerResult from "./ScannerResult.vue";
import Loading from "../Common/Loading.vue";
import {
  findProductById,
  getAllProducts,
} from "../../services/appScriptService";
import { getProductCache, setProductCache } from "../../services/productCache";

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
  capturedImage,
} = useBarcodeScanner();

const route = useRoute();
const router = useRouter();
const product = ref(null);
const productMap = ref({});
const isPreloading = ref(true);
const isLoadingProduct = ref(false);
const productError = ref("");
const MIN_LOADING_TIME = 5000;
const isProductPreloaded = ref(false);

const selectedBranch = computed(() => {
  const branch = sessionStorage.getItem("selectedBranch");

  return branch || null;
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

onMounted(async () => {
  if (!selectedBranch.value) {
    router.push("/");
    return;
  }

  isPreloading.value = true;

  const cachedProducts = getProductCache(selectedBranch.value);

  if (cachedProducts) {
    productMap.value = cachedProducts;
    isPreloading.value = true;
    console.log("Preload product from cache");
  }
  getAllProducts(selectedBranch.value)
    .then((products) => {
      productMap.value = products;
      setProductCache(selectedBranch.value, products);
      isProductPreloaded.value = true;
      console.log("Product cache refreshed");
    })
    .catch((err) => {
      console.log("Lỗi Preload", err);
      isProductPreloaded.value = Boolean(cachedProducts);
    });

  await nextTick();

  if (route.query.autoStart === "1") {
    await startScanner().catch((err) => {
      console.error("Lỗi start scanner:", err);
    });
  }
  // await delay(MIN_LOADING_TIME);
  isPreloading.value = false;
});

watch(
  () => result.value?.text,
  async (barcode) => {
    console.log("Barcode scan:", barcode);
    product.value = null;
    productError.value = "";

    if (!barcode) {
      return;
    }

    isLoadingProduct.value = true;
    try {
      const cleanBarcode = barcode.trim();
      const found = productMap.value[cleanBarcode];
      if (found) {
        product.value = found;
        return;
      } else {
        const apiProduct = await findProductById(
          cleanBarcode,
          selectedBranch.value,
        );
        if (apiProduct) {
          product.value = apiProduct;

          productMap.value[cleanBarcode] = apiProduct;
        } else {
          productError.value = "No product found.";
        }
      }
    } finally {
      isLoadingProduct.value = false;
    }
    console.log(product.value);
  },
);

function goBackToBranch() {
  stopScanner();
  router.back();
}
async function scanAgainBarcode() {
  product.value = null;
  productError.value = "";
  await scanAgain();
}
</script>
<template>
  <div class="min-h-dvh overflow-hidden flex flex-col">
    <div
      class="flex w-full items-center justify-between bg-transparent absolute top-0 left-0 right-0 p-4 z-50"
    >
      <button
        class="w-12 h-12 flex items-center justify-center rounded-full bg-black/10"
        @click="goBackToBranch"
      >
        <i class="pi pi-angle-left !text-xl text-white"></i>
      </button>
      <span
        v-if="selectedBranch"
        class="max-w-[140px] truncate rounded-full bg-black/10 px-3 py-2 text-xs font-semibold text-white"
      >
        {{ selectedBranch }}
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
      class="relative w-full h-dvh bg-black overflow-hidden"
    >
      <video
        ref="videoRef"
        autoplay
        muted
        playsinline
        class="h-full w-full object-cover"
      />

      <img
        v-if="capturedImage"
        :src="capturedImage"
        class="absolute inset-0 h-full w-full object-cover"
      />

      <div
        class="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div class="relative w-3/4 h-28">
          <div
            v-if="!result"
            class="absolute inset-0 overflow-hidden rounded-xl"
          >
            <div class="scan-line"></div>
          </div>

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
    
    <div
      v-if="isPreloading"
      class="absolute inset-0 z-[999] flex items-center justify-center bg-[#F9F7FF]"
    >
    <Loading v-if="isPreloading"></Loading>
    </div>
  </div>
</template>
