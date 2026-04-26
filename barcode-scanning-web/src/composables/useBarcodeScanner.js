import { ref, onMounted, onUnmounted } from "vue";
import {
  getVideoDevices,
  startZxingScanner,
  stopZxingScanner,
} from "../services/ZxingScanner";

export function useBarcodeScanner() {
  const videoRef = ref(null);
  const devices = ref([]);
  const selectedDeviceId = ref("");

  const result = ref("");
  const isScanning = ref(false);
  const errorMesage = ref("");

  onMounted(async () => {
    try {
      devices.value = await getVideoDevices();

      if (devices.value.length > 0) {
        selectedDeviceId = devices.value[0].deviceId;
      }
    } catch (error) {
      errorMesage.value = "Không lấy được Camera";
      console.log(error);
    }
  });

  async function startScanner() {
    if (!videoRef.value) return;

    result.value = "";
    errorMesage.value = "";
    isScanning.value = true;
    try {
      await startZxingScanner(
        videoRef.value,
        selectedDeviceId,
        (value) => {
          result.value;
          stopScanner();
        },
        (error) => {
          errorMesage.value = "Lỗi khi scan";
          console.log(error);
        },
      );
    } catch (err) {
      errorMessage.value = "Không mở được camera";
      console.error(err);
    }
  }

  function stopScanner() {
    stopZxingScanner();
    isScanning.value = false;
  }

  onUnmounted(() => {
    stopScanner();
  });

  return {
    videoRef,
    devices,
    selectedDeviceId,
    result,
    isScanning,
    errorMessage,
    startScanner,
    stopScanner,
  };
}
