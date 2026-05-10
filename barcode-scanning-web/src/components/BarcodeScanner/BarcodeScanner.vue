<script setup>
import { useBarcodeScanner } from "../../composables/useBarcodeScanner";
import { computed, onMounted, ref, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import ScannerControl from "./ScannerControl.vue";
import ScannerResult from "./ScannerResult.vue";
import Loading from "../Common/Loading.vue";
import {
  findProductById,
  getAllProducts,
} from "../../services/appScriptService";

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
  capturedImage
} = useBarcodeScanner();

const route = useRoute();
const router = useRouter();
const product = ref(null);
const productMap = ref({});
const isPreloading = ref(true);
const isLoadingProduct = ref(false);
const productError = ref("");
const MIN_LOADING_TIME = 3000;
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

  console.log("Preloading products...");
  getAllProducts(selectedBranch.value)
    .then((products) => {
      productMap.value = products;
      isProductPreloaded.value = true;
      console.log("Preload xong", productMap.value);
    })
    .catch((err) => {
      console.error("Lỗi preload:", err);
      isProductPreloaded.value = false;
    });

    await nextTick();
  if (route.query.autoStart === "1") {
    await startScanner().catch((err) => {
      console.error("Lỗi start scanner:", err);
    });
  }
  await delay(MIN_LOADING_TIME);
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

    // try {
    //   console.log("Gọi API...");
    //   const cleanBarcode = barcode.trim();
    //   const foundProduct = await findProductById(
    //     cleanBarcode,
    //     selectedBranch.value,
    //   );

    //   console.log("API trả về:", foundProduct);
    //   if (!foundProduct) {
    //     productError.value = "Không tìm thấy sản phẩm trong Google Sheet";
    //     return;
    //   }
    //   product.value = foundProduct;
    // } catch (error) {
    //   console.error(error);
    //   productError.value = "Không thể lấy thông tin sản phẩm";
    // } finally {
    //   isLoadingProduct.value = false;
    //   isFetching = false;
    // }
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
        class="rounded-full bg-black/10 px-3 py-2 text-xs font-semibold text-white"
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
      class="relative w-full h-[100vh] bg-black overflow-hidden"
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
      <Loading></Loading>
    </div>
  </div>
</template>
