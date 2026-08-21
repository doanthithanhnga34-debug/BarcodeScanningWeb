  // import {
  //   BrowserCodeReader,
  //   BrowserMultiFormatOneDReader,
  // } from "@zxing/browser";
  // import {
  //   BarcodeFormat,
  //   DecodeHintType,
  // } from "@zxing/library";

  // let codeReader = null;
  // let controls = null;
  // let isResultLocked = false;

  // const PRODUCT_BARCODE_FORMATS = [
  //   BarcodeFormat.EAN_13,
  //   BarcodeFormat.EAN_8,
  //   BarcodeFormat.UPC_A,
  //   BarcodeFormat.UPC_E,
  //   BarcodeFormat.CODE_128,
  //   BarcodeFormat.CODE_39,
  //   BarcodeFormat.CODE_93,
  //   BarcodeFormat.ITF,
  //   BarcodeFormat.CODABAR,
  //   BarcodeFormat.RSS_14,
  //   BarcodeFormat.RSS_EXPANDED,
  // ].filter(Boolean);

  // export function initScanner() {
  //   codeReader = new BrowserMultiFormatOneDReader();
  // }

  // export async function getVideoDevices() {
  //   if (!codeReader) initScanner();
  //   const devices = await BrowserCodeReader.listVideoInputDevices();
  //   return devices;
  // }
  // function captureFrame(video) {
  //   const canvas = document.createElement("canvas");
  //   const width = video.videoWidth || video.clientWidth || 1280;
  //   const height = video.videoHeight || video.clientHeight || 720;
  //   canvas.width = width;
  //   canvas.height = height;
  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return "";
  //   ctx.drawImage(video, 0, 0, width, height);

  //   return canvas.toDataURL("image/jpeg", 1.0);
  // }

  // function prepareVideoForIOS(video) {
  //   if (!video) return;

  //   video.setAttribute("playsinline", "");
  //   video.setAttribute("webkit-playsinline", "");
  //   video.setAttribute("muted", "");
  //   video.setAttribute("autoplay", "");
  //   video.setAttribute("poster", "");

  //   video.playsInline = true;
  //   video.muted = true;
  //   video.autoplay = true;
  //   video.controls = false;

  //   video.removeAttribute("controls");

  //   // Một số iPhone/Safari vẫn cố hiện native controls nếu chưa có style trực tiếp
  //   video.style.width = "100%";
  //   // video.style.height = "100%";
  //   // video.style.objectFit = "cover";
  // }
  // export function unlockZxingScanner() {
  //   isResultLocked = false;
  // }
  // export async function startZxingScanner(
  //   videoElement,
  //   deviceId,
  //   onResult,
  //   onError,
  // ) {
  //   if (!videoElement) {
  //     throw new Error("Video element is not ready");
  //   }

  //   prepareVideoForIOS(videoElement);

  //   if (controls) {
  //     unlockZxingScanner();
  //     prepareVideoForIOS(videoElement);

  //     try {
  //       await videoElement.play();
  //     } catch (err) {
  //       console.warn("iOS video play warning:", err);
  //     }

  //     return;
  //   }

  //   isResultLocked = false;

  //   const hints = new Map();
  //   hints.set(DecodeHintType.POSSIBLE_FORMATS, PRODUCT_BARCODE_FORMATS);

  //   codeReader = new BrowserMultiFormatOneDReader(hints, {
  //     delayBetweenScanAttempts: 50,
  //     delayBetweenScanSuccess: 800,
  //     tryPlayVideoTimeout: 3000,
  //   });

  //   const constraints = {
  //     video: {
  //       facingMode: { ideal: "environment" },
  //       width: { ideal: 1280 },
  //       height: { ideal: 720 },
  //       advanced: [
  //         { focusMode: "continuous" },
  //         { exposureMode: "continuous" },
  //       ],
  //     },
  //     audio: false,
  //   };

  //   prepareVideoForIOS(videoElement);

  //   controls = await codeReader.decodeFromConstraints(
  //     constraints,
  //     videoElement,
  //     (result, error, scanControls) => {
  //       if (result && !isResultLocked) {
  //         isResultLocked = true;

  //         const value = result.getText();
  //         const image = captureFrame(videoElement);

  //         onResult({ text: value, image });
  //         return;
  //       }

  //       const ignoredErrors = [
  //         "NotFoundException",
  //         "ChecksumException",
  //         "FormatException",
  //       ];

  //       if (error && !ignoredErrors.includes(error?.name)) {
  //         onError?.(error);
  //       }
  //     },
  //   );

  //   prepareVideoForIOS(videoElement);

  //   try {
  //     await videoElement.play();
  //   } catch (err) {
  //     console.warn("iOS video play warning:", err);
  //   }

  //   await new Promise((res) => setTimeout(res, 600));
  // }
  // export function stopZxingScanner() {
  //   if (controls && typeof controls.stop === "function") {
  //     controls.stop();
  //   }
  //   controls = null;
  //   codeReader = null;
  //   isResultLocked = false;
  // }
import {
  BrowserCodeReader,
  BrowserMultiFormatOneDReader,
} from "@zxing/browser";

import {
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";

let codeReader = null;
let controls = null;
let activeVideo = null;
let startPromise = null;
let isResultLocked = false;

const PRODUCT_BARCODE_FORMATS = [
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.CODE_93,
  BarcodeFormat.ITF,
  BarcodeFormat.CODABAR,
  BarcodeFormat.RSS_14,
  BarcodeFormat.RSS_EXPANDED,
].filter((format) => format !== undefined && format !== null);

function prepareVideoForIOS(video) {
  if (!video) return;

  // Phải thiết lập trước khi ZXing gắn srcObject
  video.playsInline = true;
  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.controls = false;

  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("muted", "");
  video.setAttribute("autoplay", "");
  video.setAttribute("x-webkit-airplay", "deny");
  video.setAttribute("disableremoteplayback", "");

  video.removeAttribute("controls");
  video.removeAttribute("poster");

  if ("disablePictureInPicture" in video) {
    video.disablePictureInPicture = true;
  }

  if ("disableRemotePlayback" in video) {
    video.disableRemotePlayback = true;
  }
}

function hasLiveStream(video) {
  const stream = video?.srcObject;

  if (!stream || typeof stream.getVideoTracks !== "function") {
    return false;
  }

  return stream
    .getVideoTracks()
    .some((track) => track.readyState === "live");
}

function captureFrame(video) {
  if (!video || !video.videoWidth || !video.videoHeight) {
    return "";
  }

  const canvas = document.createElement("canvas");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    return "";
  }

  context.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return canvas.toDataURL("image/jpeg", 0.9);
}

export async function getVideoDevices() {
  return BrowserCodeReader.listVideoInputDevices();
}

export function unlockZxingScanner() {
  isResultLocked = false;
}

async function createScanner(
  videoElement,
  deviceId,
  onResult,
  onError,
) {
  if (!videoElement) {
    throw new Error("Video element is not ready");
  }

  prepareVideoForIOS(videoElement);

  /*
   * Scanner còn hoạt động trên chính video này:
   * không được mở thêm camera stream.
   */
  if (
    controls &&
    activeVideo === videoElement &&
    hasLiveStream(videoElement)
  ) {
    isResultLocked = false;

    if (videoElement.paused) {
      await videoElement.play();
    }

    return controls;
  }

  // Dọn scanner cũ nếu video hoặc stream không còn hợp lệ
  if (controls) {
    stopZxingScanner();
  }

  isResultLocked = false;

  const hints = new Map();

  hints.set(
    DecodeHintType.POSSIBLE_FORMATS,
    PRODUCT_BARCODE_FORMATS,
  );

  codeReader = new BrowserMultiFormatOneDReader(hints, {
    delayBetweenScanAttempts: 80,
    delayBetweenScanSuccess: 800,
    tryPlayVideoTimeout: 5000,
  });

  const videoConstraints = {
    width: {
      ideal: 1280,
    },
    height: {
      ideal: 720,
    },
  };

  if (deviceId) {
    videoConstraints.deviceId = {
      exact: deviceId,
    };
  } else {
    videoConstraints.facingMode = {
      ideal: "environment",
    };
  }

  const constraints = {
    video: videoConstraints,
    audio: false,
  };

  /*
   * Chỉ ZXing gọi getUserMedia và gắn srcObject.
   * Không gọi getUserMedia ở composable nữa.
   */
  const newControls = await codeReader.decodeFromConstraints(
    constraints,
    videoElement,
    (result, error) => {
      if (result && !isResultLocked) {
        isResultLocked = true;

        onResult?.({
          text: result.getText(),
          image: captureFrame(videoElement),
        });

        return;
      }

      const ignoredErrors = [
        "NotFoundException",
        "ChecksumException",
        "FormatException",
      ];

      if (
        error &&
        !ignoredErrors.includes(error?.name)
      ) {
        onError?.(error);
      }
    },
  );

  controls = newControls;
  activeVideo = videoElement;

  prepareVideoForIOS(videoElement);

  /*
   * ZXing thường đã phát video.
   * Chỉ gọi bổ sung khi video thật sự còn paused.
   */
  if (videoElement.paused) {
    await videoElement.play();
  }

  return controls;
}

export async function startZxingScanner(
  videoElement,
  deviceId,
  onResult,
  onError,
) {
  if (startPromise) {
    return startPromise;
  }

  startPromise = createScanner(
    videoElement,
    deviceId,
    onResult,
    onError,
  );

  try {
    return await startPromise;
  } finally {
    startPromise = null;
  }
}

export function stopZxingScanner() {
  const video = activeVideo;
  const stream = video?.srcObject;

  if (controls && typeof controls.stop === "function") {
    try {
      controls.stop();
    } catch (error) {
      console.warn("ZXing stop warning:", error);
    }
  }

  /*
   * Dừng bổ sung để bảo đảm camera không còn chạy
   * nếu thư viện chưa release hết track.
   */
  if (
    stream &&
    typeof stream.getTracks === "function"
  ) {
    stream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch (error) {
        console.warn("Camera track stop warning:", error);
      }
    });
  }

  if (video) {
    try {
      video.pause();
    } catch (error) {
      console.warn("Video pause warning:", error);
    }

    video.srcObject = null;
    video.removeAttribute("src");
    video.removeAttribute("controls");
  }

  controls = null;
  codeReader = null;
  activeVideo = null;
  isResultLocked = false;
}