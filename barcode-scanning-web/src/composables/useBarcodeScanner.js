import { ref, onUnmounted, nextTick } from "vue";
import {
  getVideoDevices,
  startZxingScanner,
  stopZxingScanner,
  unlockZxingScanner,
} from "../services/ZxingScanner";

export function useBarcodeScanner() {
  const videoRef = ref(null);
  const devices = ref([]);
  const selectedDeviceId = ref("");
  const showCamera = ref(false);

  const result = ref(null);
  const isScanning = ref(false);
  const errorMessage = ref("");
  const capturedImage = ref(null);

  const scannerStarted = ref(false);
  const scanLocked = ref(false);

 function fixIOSVideoInline(video) {
  if (!video) return;

  video.setAttribute("playsinline", "true");
  video.setAttribute("webkit-playsinline", "true");
  video.setAttribute("muted", "true");
  video.setAttribute("autoplay", "true");
  video.setAttribute("poster", "");

  video.playsInline = true;
  video.muted = true;
  video.autoplay = true;
  video.controls = false;
  video.removeAttribute("controls");

  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "cover";
  // await video.play();
}

 async function startScanner() {
  if (scannerStarted.value) return;
  if (isScanning.value) return;

  try {
    result.value = null;
    errorMessage.value = "";
    showCamera.value = true;
    isScanning.value = true;
    scanLocked.value = false;

    await nextTick();

    if (!videoRef.value) {
      throw new Error("Camera view not found");
    }

    fixIOSVideoInline(videoRef.value);

    await startZxingScanner(
      videoRef.value,
      selectedDeviceId.value || "",
      (value) => {
        if (scanLocked.value) return;
        scanLocked.value = true;
        result.value = value;
        capturedImage.value = value.image || null;
        saveToHistory(value.text);
        finishScanner();
      },
      (error) => {
        const ignoreErrors = [
          "NotFoundException",
          "ChecksumException",
          "FormatException",
        ];

        if (ignoreErrors.includes(error?.name)) return;

        console.error(error);
      },
    );

    await nextTick();
    fixIOSVideoInline(videoRef.value);

    if (videoRef.value) {
      videoRef.value.play().catch((err) => {
        console.warn("iOS video play warning:", err);
      });
    }

    scannerStarted.value = true;
  } catch (err) {
    console.error(err);
    errorMessage.value = err.message || "Unable to open camera";
    isScanning.value = false;
    showCamera.value = false;
    scannerStarted.value = false;
  }
}

  async function loadDevices() {
    try {
      const deviceList = await getVideoDevices();
      devices.value = deviceList;

      const backCamera = deviceList.find((device) => {
        const label = device.label?.toLowerCase() || "";
        return (
          label.includes("back") ||
          label.includes("rear") ||
          label.includes("environment")
        );
      });

      selectedDeviceId.value = backCamera?.deviceId || "";
    } catch (error) {
      console.error(error);
    }
  }

  async function scanAgain() {
  result.value = null;
  errorMessage.value = "";
  capturedImage.value = null;
  showCamera.value = true;
  scanLocked.value = false;

  await nextTick();

  if (videoRef.value) {
    fixIOSVideoInline(videoRef.value);

    videoRef.value.play().catch((err) => {
      console.warn("iOS video play warning:", err);
    });
  }

  if (!scannerStarted.value) {
    await startScanner();
    return;
  }

  isScanning.value = true;
  unlockZxingScanner();
}
  function finishScanner() {
    // stopZxingScanner();
    isScanning.value = false;
    showCamera.value = true;
  }
  function stopScanner() {
    stopZxingScanner();
    isScanning.value = false;
    showCamera.value = false;
    result.value = null;
    capturedImage.value = null;
    scannerStarted.value = false;
    scanLocked.value = false;
  }

  function saveToHistory(value) {
    const oldHistory = JSON.parse(localStorage.getItem("scanHistory")) || [];
    const newItem = {
      id: Date.now(),
      value,
      date: new Date().toLocaleDateString(),
    };
    localStorage.setItem(
      "scanHistory",
      JSON.stringify([newItem, ...oldHistory]),
    );
  }
  onUnmounted(() => {
    stopScanner();
  });

  return {
    videoRef,
    devices,
    selectedDeviceId,
    result,
    showCamera,
    isScanning,
    errorMessage,
    startScanner,
    stopScanner,
    loadDevices,
    scanAgain,
    capturedImage,
  };
}
