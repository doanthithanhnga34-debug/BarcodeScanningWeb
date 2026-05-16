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
function fixIOSVideoInline() {
  const video = videoRef.value;

  if (!video) return;

  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("muted", "");
  video.setAttribute("autoplay", "");

  video.playsInline = true;
  video.muted = true;
  video.autoplay = true;
  video.controls = false;

  video.removeAttribute("controls");
}

watch(showCamera, async (visible) => {
  if (!visible) return;

  await nextTick();
  fixIOSVideoInline();

  const video = videoRef.value;
  if (video) {
    video.play().catch((err) => {
      console.warn("iOS video play warning:", err);
    });
  }
});
function handleVideoLoadedMetadata() {
  fixIOSVideoInline();

  const video = videoRef.value;
  if (video) {
    video.play().catch((err) => {
      console.warn("iOS video metadata play warning:", err);
    });
  }
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
    await nextTick();
    fixIOSVideoInline();

    await startScanner().catch((err) => {
      console.error("Lỗi start scanner:", err);
    });

    await nextTick();
    fixIOSVideoInline();

    const video = videoRef.value;
    if (video) {
      video.play().catch((err) => {
        console.warn("iOS video play warning:", err);
      });
    }
  }
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

  await nextTick();
  fixIOSVideoInline();

  await scanAgain().catch((err) => {
    console.error("Lỗi scan again:", err);
  });

  await nextTick();
  fixIOSVideoInline();

  const video = videoRef.value;
  if (video) {
    video.play().catch((err) => {
      console.warn("iOS video play warning:", err);
    });
  }
}
</script>
<template>
  <div class="min-h-dvh overflow-hidden flex flex-col">
    <div class="scanner-header">
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
        @click="scanAgainBarcode"
      >
        <i class="pi pi-replay !text-xl text-white"></i>
      </button>
    </div>

    <div v-if="showCamera" class="scanner-container">
      <video
        id="scanner-video"
        ref="videoRef"
        autoplay
        muted
        playsinline
        webkit-playsinline
        disablepictureinpicture
        controlslist="nodownload nofullscreen noremoteplayback"
        class="scanner-video"
        @loadedmetadata="handleVideoLoadedMetadata"
      />

      <img v-if="capturedImage" :src="capturedImage" class="captured-image" />
      <div class="scanner-overlay">
        <div class="scan-box">
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
    <div v-if="result?.text" class="scanner-result-bottom-sheet">
      <ScannerResult
        :barcode="result.text"
        :product="product"
        :loading="isLoadingProduct"
        :error-message="productError"
        @scan-again="scanAgainBarcode"
      />
    </div>

    <div
      v-if="isPreloading"
      class="absolute inset-0 z-[999] flex items-center justify-center bg-[#F9F7FF]"
    >
      <Loading v-if="isPreloading"></Loading>
    </div>
  </div>
</template>
<style scoped>
.scanner-result-bottom-sheet {
  position: fixed;
  left: 10px;
  right: 10px;
  bottom: calc(60px + env(safe-area-inset-bottom, 0px));

  z-index: 10000;
  pointer-events: auto;

  max-height: 35dvh;
  overflow-y: visible;

  background: transparent;
  animation: fadeInUp 0.3s ease-out;
}
.scanner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;
}

.scanner-video::-webkit-media-controls {
  display: none !important;
}

.scanner-video::-webkit-media-controls-panel {
  display: none !important;
}

.scanner-video::-webkit-media-controls-play-button {
  display: none !important;
}

.scanner-video::-webkit-media-controls-start-playback-button {
  display: none !important;
}
.scanner-container {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100dvh;
  background: #000;
  overflow: hidden;
  z-index: 1;
}

.scanner-video {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;

  /* Fix iOS Safari video layer */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

.scanner-header {
  position: fixed;
  top: env(safe-area-inset-top, 0px);
  left: 0;
  right: 0;
  z-index: 9999;

  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;

  padding: 16px;
  pointer-events: auto;
}

.scanner-header button {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.45);
}

.scanner-overlay {
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 9998;

  display: flex;
  align-items: center;
  justify-content: center;
}

.scan-box {
  position: relative;
  width: 75vw;
  height: 112px;
}

.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;

  height: 3px;
  background: #ff3b30;
  box-shadow: 0 0 12px rgba(255, 59, 48, 0.9);

  animation: scanMove 1.4s linear infinite;
}

@keyframes scanMove {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(112px);
  }
}

.scanner-video::-webkit-media-controls,
.scanner-video::-webkit-media-controls-panel,
.scanner-video::-webkit-media-controls-play-button,
.scanner-video::-webkit-media-controls-start-playback-button {
  display: none !important;
  opacity: 0 !important;
}
.captured-image {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
