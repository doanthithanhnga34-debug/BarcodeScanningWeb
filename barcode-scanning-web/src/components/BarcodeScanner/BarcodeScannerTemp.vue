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
const isPreloading = ref(false);
const isLoadingProduct = ref(false);
const productError = ref("");
const MIN_LOADING_TIME = 5000;
const isProductPreloaded = ref(false);
const test = ref(false);

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
  <div class="min-h-dvh screen">
    <div
      v-if="isPreloading"
      class="absolute w-full inset-0 z-[999] flex items-center justify-center bg-[#F9F7FF]"
    >
      <Loading v-if="isPreloading"></Loading>
    </div>
    <div class="relative h-full w-full flex flex-col py-3 px-4">
      <!-- Header -->
      <div class="relative z-10 flex items-center justify-between mb-5">
        <button
          class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 shadow-sm"
          @click="goBackToBranch"
        >
          <i class="pi pi-chevron-left text-slate-800"></i>
        </button>

        <span
          v-if="selectedBranch"
          class="max-w-[140px] truncate rounded-full bg-white px-3 py-2 font-semibold text-black"
        >
          {{ selectedBranch }}
        </span>

        <div class="flex gap-3">
          <button
            class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 shadow-sm"
            @click="scanAgainBarcode"
          >
            <i class="pi pi-refresh text-slate-800"></i>
          </button>
        </div>
      </div>
      <!-- Scanner -->

      <div
        v-if="showCamera"
        class="relative w-full h-[450px] bg-black overflow-hidden rounded-[2rem]"
      >
        <!-- TL -->
        <div
          class="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white rounded-tl-[2rem]"
        ></div>

        <!-- TR -->
        <div
          class="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white rounded-tr-[2rem]"
        ></div>

        <!-- BL -->
        <div
          class="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white rounded-bl-[2rem]"
        ></div>

        <!-- BR -->
        <div
          class="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white rounded-br-[2rem]"
        ></div>
        <div
          v-if="!result"
          class="pointer-events-none absolute inset-0 z-10 overflow-hidden"
        >
          <div class="scan-line"></div>
        </div>
        <video
          id="scanner-video"
          ref="videoRef"
          autoplay
          muted
          playsinline
          webkit-playsinline
          disablepictureinpicture
          controlslist="nodownload nofullscreen noremoteplayback"
          class="h-full w-full object-cover"
          @loadedmetadata="handleVideoLoadedMetadata"
        />

        <img
          v-if="capturedImage"
          :src="capturedImage"
          class="absolute inset-0 h-full w-full object-cover"
        />
        <div
          class="pointer-events-none absolute inset-0 flex items-center justify-center"
        ></div>
      </div>

      <div v-if="result?.text" class="">
        <ScannerResult
          :barcode="result.text"
          :product="product"
          :loading="isLoadingProduct"
          :error-message="productError"
          @scan-again="scanAgainBarcode"
        />
      </div>
      <div v-else class="mt-[20px]">
        <span>Đang chờ quét</span>
      </div>
    </div>
  </div>
</template>
