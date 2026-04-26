import { ref, onMounted, onUnmounted, nextTick } from "vue";
import {
  getVideoDevices,
  startZxingScanner,
  stopZxingScanner,
} from "../services/ZxingScanner";

export function useBarcodeScanner() {
  const videoRef = ref(null);
  const devices = ref([]);
  const selectedDeviceId = ref("");
  const showCamera = ref(false);

  const result = ref("");
  const isScanning = ref(false);
  const errorMessage = ref("");

  // onMounted(async () => {
  //   await nextTick();
  //   try {
  //     devices.value = await getVideoDevices();

  //     if (devices.value.length > 0) {
  //       selectedDeviceId.value = devices.value[0].deviceId;
  //     }
  //   } catch (error) {
  //     errorMessage.value = "Không lấy được Camera";
  //     console.log(error);
  //   }
  // });

  // async function startScanner() {
  //   if (!videoRef.value) return;

  //   result.value = "";
  //   errorMessage.value = "";
  //   isScanning.value = true;
  //   try {
  //     await startZxingScanner(
  //       videoRef.value,
  //       selectedDeviceId.value,
  //       (value) => {
  //         result.value=value;
  //         stopScanner();
  //       },
  //       (error) => {
  //         errorMessage.value = "Lỗi khi scan";
  //         console.log(error);
  //       },
  //     );
  //   } catch (err) {
  //     errorMessage.value = "Không mở được camera";
  //     console.error(err);
  //   }
  // }

  async function startScanner() {
    try {
      showCamera.value = true;

      console.log("videoRef trước nextTick:", videoRef.value);

      await nextTick(); // 🔥 đợi DOM render video

      console.log("videoRef sau nextTick:", videoRef.value);
      const deviceList = await getVideoDevices();

      devices.value = deviceList;

      console.log("devices:", deviceList);

      const backCamera = deviceList.find(
        (d) =>
          d.label?.toLowerCase().includes("back") ||
          d.label?.toLowerCase().includes("rear") ||
          d.label?.toLowerCase().includes("environment"),
      );

      const deviceId =
        backCamera?.deviceId || deviceList[deviceList.length - 1]?.deviceId;

      await startZxingScanner(
        videoRef.value,
        deviceId,
        (value) => {
          result.value = value;
        },
        (error) => {
          console.log(error);
        },
      );
      console.log("videoRef:", videoRef.value);
    } catch (err) {
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
    showCamera,
    isScanning,
    errorMessage,
    startScanner,
    stopScanner,
  };
}
