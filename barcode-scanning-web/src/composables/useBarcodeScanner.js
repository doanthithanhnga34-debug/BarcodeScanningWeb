import { ref, onUnmounted, nextTick } from "vue";
import {
  getVideoDevices,
  startZxingScanner,
  stopZxingScanner,
  unlockZxingScanner,
} from "../services/ZxingScanner";

// export function useBarcodeScanner() {
//   const videoRef = ref(null);
//   const devices = ref([]);
//   const selectedDeviceId = ref("");
//   const showCamera = ref(false);

//   const result = ref(null);
//   const isScanning = ref(false);
//   const errorMessage = ref("");
//   const capturedImage = ref(null);

//   const scannerStarted = ref(false);
//   const scanLocked = ref(false);

//  function fixIOSVideoInline(video) {
//   if (!video) return;

//   video.setAttribute("playsinline", "true");
//   video.setAttribute("webkit-playsinline", "true");
//   video.setAttribute("muted", "true");
//   video.setAttribute("autoplay", "true");
//   video.setAttribute("poster", "");

//   video.playsInline = true;
//   video.muted = true;
//   video.autoplay = true;
//   video.controls = false;
//   video.removeAttribute("controls");

//   video.style.width = "100%";
//   // video.style.height = "100%";
//   // video.style.objectFit = "cover";
//   // await video.play();
// }

// //  async function startScanner() {
// //   if (scannerStarted.value) return;
// //   if (isScanning.value) return;

// //   try {
// //     result.value = null;
// //     errorMessage.value = "";
// //     showCamera.value = true;
// //     isScanning.value = true;
// //     scanLocked.value = false;

// //     await nextTick();

// //     if (!videoRef.value) {
// //       throw new Error("Camera view not found");
// //     }

// //     fixIOSVideoInline(videoRef.value);

// //     await startZxingScanner(
// //       videoRef.value,
// //       selectedDeviceId.value || "",
// //       (value) => {
// //         if (scanLocked.value) return;
// //         scanLocked.value = true;
// //         result.value = value;
// //         capturedImage.value = value.image || null;
// //         saveToHistory(value.text);
// //         finishScanner();
// //       },
// //       (error) => {
// //         const ignoreErrors = [
// //           "NotFoundException",
// //           "ChecksumException",
// //           "FormatException",
// //         ];

// //         if (ignoreErrors.includes(error?.name)) return;

// //         console.error(error);
// //       },
// //     );

// //     await nextTick();
// //     fixIOSVideoInline(videoRef.value);

// //     if (videoRef.value) {
// //       videoRef.value.play().catch((err) => {
// //         console.warn("iOS video play warning:", err);
// //       });
// //     }

// //     scannerStarted.value = true;
// //   } catch (err) {
// //     console.error(err);
// //     errorMessage.value = err.message || "Unable to open camera";
// //     isScanning.value = false;
// //     showCamera.value = false;
// //     scannerStarted.value = false;
// //   }
// // }
// async function startScanner() {
//   try {
//     showCamera.value = true;

//     await nextTick();

//     const video = videoRef.value;

//     if (!video) {
//       throw new Error("Không tìm thấy video element");
//     }

//     // Phải cấu hình trước khi gắn stream và trước khi play
//     video.playsInline = true;
//     video.muted = true;
//     video.autoplay = true;
//     video.controls = false;

//     video.setAttribute("playsinline", "playsinline");
//     video.setAttribute("webkit-playsinline", "webkit-playsinline");
//     video.setAttribute("muted", "muted");
//     video.removeAttribute("controls");

//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: {
//         facingMode: {
//           ideal: "environment",
//         },
//       },
//       audio: false,
//     });

//     video.srcObject = stream;

//     // Chỉ gọi đúng một lần tại đây
//     await video.play();

//     // Bắt đầu xử lý barcode sau đó
//   } catch (error) {
//     console.error("Start scanner error:", error);
//     errorMessage.value = error.message;
//   }
// }

//   async function loadDevices() {
//     try {
//       const deviceList = await getVideoDevices();
//       devices.value = deviceList;

//       const backCamera = deviceList.find((device) => {
//         const label = device.label?.toLowerCase() || "";
//         return (
//           label.includes("back") ||
//           label.includes("rear") ||
//           label.includes("environment")
//         );
//       });

//       selectedDeviceId.value = backCamera?.deviceId || "";
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   async function scanAgain() {
//   result.value = null;
//   errorMessage.value = "";
//   capturedImage.value = null;
//   showCamera.value = true;
//   scanLocked.value = false;

//   await nextTick();

//   if (videoRef.value) {
//     fixIOSVideoInline(videoRef.value);

//     videoRef.value.play().catch((err) => {
//       console.warn("iOS video play warning:", err);
//     });
//   }

//   if (!scannerStarted.value) {
//     await startScanner();
//     return;
//   }

//   isScanning.value = true;
//   unlockZxingScanner();
// }
//   function finishScanner() {
//     // stopZxingScanner();
//     isScanning.value = false;
//     showCamera.value = true;
//   }
//   function stopScanner() {
//     stopZxingScanner();
//     isScanning.value = false;
//     showCamera.value = false;
//     result.value = null;
//     capturedImage.value = null;
//     scannerStarted.value = false;
//     scanLocked.value = false;
//   }

//   function saveToHistory(value) {
//     const oldHistory = JSON.parse(localStorage.getItem("scanHistory")) || [];
//     const newItem = {
//       id: Date.now(),
//       value,
//       date: new Date().toLocaleDateString(),
//     };
//     localStorage.setItem(
//       "scanHistory",
//       JSON.stringify([newItem, ...oldHistory]),
//     );
//   }
//   onUnmounted(() => {
//     stopScanner();
//   });

//   return {
//     videoRef,
//     devices,
//     selectedDeviceId,
//     result,
//     showCamera,
//     isScanning,
//     errorMessage,
//     startScanner,
//     stopScanner,
//     loadDevices,
//     scanAgain,
//     capturedImage,
//   };
// }

export function useBarcodeScanner() {
  const videoRef = ref(null);

  const devices = ref([]);
  const selectedDeviceId = ref("");

  const showCamera = ref(false);
  const result = ref(null);
  const capturedImage = ref(null);

  const isScanning = ref(false);
  const errorMessage = ref("");

  const scannerStarted = ref(false);
  const scanLocked = ref(false);

  /*
   * Camera sẽ tự mở trước.
   * Chỉ hiện nút dự phòng khi Safari từ chối autoplay.
   */
  const needsCameraTap = ref(false);

  let startTask = null;

  function hasLiveStream(video) {
    const stream = video?.srcObject;

    if (
      !stream ||
      typeof stream.getVideoTracks !== "function"
    ) {
      return false;
    }

    return stream
      .getVideoTracks()
      .some((track) => track.readyState === "live");
  }

  async function runStartScanner() {
    result.value = null;
    capturedImage.value = null;
    errorMessage.value = "";

    scanLocked.value = false;
    needsCameraTap.value = false;

    showCamera.value = true;
    isScanning.value = true;

    await nextTick();

    const video = videoRef.value;

    if (!video) {
      throw new Error("Không tìm thấy video element");
    }

    /*
     * Stream cũ vẫn hoạt động:
     * không tạo thêm camera stream.
     */
    if (
      scannerStarted.value &&
      hasLiveStream(video)
    ) {
      if (video.paused) {
        await video.play();
      }

      unlockZxingScanner();

      isScanning.value = true;
      needsCameraTap.value = false;

      return true;
    }

    scannerStarted.value = false;

    await startZxingScanner(
      video,
      selectedDeviceId.value || "",
      (value) => {
        if (scanLocked.value) {
          return;
        }

        scanLocked.value = true;

        result.value = value;
        capturedImage.value = value?.image || null;

        if (value?.text) {
          saveToHistory(value.text);
        }

        finishScanner();
      },
      (error) => {
        console.error("ZXing scan error:", error);
      },
    );

    scannerStarted.value = true;
    isScanning.value = true;
    needsCameraTap.value = false;

    return true;
  }

  async function startScanner() {
    if (startTask) {
      return startTask;
    }

    startTask = runStartScanner();

    try {
      return await startTask;
    } catch (error) {
      console.error("Start scanner error:", error);

      stopZxingScanner();

      scannerStarted.value = false;
      scanLocked.value = false;
      isScanning.value = false;

      /*
       * Giữ scanner box để hiện nút của ứng dụng,
       * không để người dùng phải nhấn nút Play native.
       */
      showCamera.value = true;
      needsCameraTap.value = true;

      if (error?.name === "NotAllowedError") {
        errorMessage.value =
          "Safari chưa cho phép tự mở camera hoặc quyền Camera đang bị chặn.";
      } else if (error?.name === "NotFoundError") {
        errorMessage.value =
          "Không tìm thấy camera trên thiết bị.";
      } else if (error?.name === "NotReadableError") {
        errorMessage.value =
          "Camera đang được ứng dụng khác sử dụng.";
      } else {
        errorMessage.value =
          error?.message || "Không thể mở camera.";
      }

      return false;
    } finally {
      startTask = null;
    }
  }

  async function loadDevices() {
    try {
      const deviceList = await getVideoDevices();

      devices.value = deviceList;

      const backCamera = deviceList.find((device) => {
        const label = String(
          device.label || "",
        ).toLowerCase();

        return (
          label.includes("back") ||
          label.includes("rear") ||
          label.includes("environment") ||
          label.includes("sau")
        );
      });

      selectedDeviceId.value =
        backCamera?.deviceId || "";
    } catch (error) {
      console.error("Load camera devices error:", error);
    }
  }

  async function scanAgain() {
    result.value = null;
    capturedImage.value = null;
    errorMessage.value = "";

    scanLocked.value = false;
    showCamera.value = true;

    await nextTick();

    const video = videoRef.value;

    if (
      !scannerStarted.value ||
      !hasLiveStream(video)
    ) {
      return startScanner();
    }

    try {
      if (video.paused) {
        await video.play();
      }

      unlockZxingScanner();

      isScanning.value = true;
      needsCameraTap.value = false;

      return true;
    } catch (error) {
      console.error("Resume scanner error:", error);

      stopZxingScanner();
      scannerStarted.value = false;

      return startScanner();
    }
  }

  function finishScanner() {
    /*
     * Không pause video sau khi quét thành công.
     * Nếu pause, iOS có thể hiện lại Play/Pause native.
     */
    isScanning.value = false;
    showCamera.value = true;
  }

  function stopScanner() {
    stopZxingScanner();

    result.value = null;
    capturedImage.value = null;
    errorMessage.value = "";

    isScanning.value = false;
    showCamera.value = false;

    scannerStarted.value = false;
    scanLocked.value = false;
    needsCameraTap.value = false;
  }

  function saveToHistory(value) {
    let oldHistory = [];

    try {
      oldHistory =
        JSON.parse(
          localStorage.getItem("scanHistory") || "[]",
        ) || [];
    } catch (error) {
      console.warn(
        "Không thể đọc lịch sử quét:",
        error,
      );
    }

    const newItem = {
      id: Date.now(),
      value,
      date: new Date().toLocaleDateString(),
    };

    localStorage.setItem(
      "scanHistory",
      JSON.stringify([
        newItem,
        ...oldHistory,
      ]),
    );
  }

  onUnmounted(() => {
    stopScanner();
  });

  return {
    videoRef,
    devices,
    selectedDeviceId,

    showCamera,
    result,
    capturedImage,

    isScanning,
    errorMessage,
    needsCameraTap,

    startScanner,
    stopScanner,
    loadDevices,
    scanAgain,
  };
}
