import {
  BrowserCodeReader,
  BrowserMultiFormatOneDReader,
} from "@zxing/browser";
import { ref } from "vue";
import {
  BarcodeFormat,
  ChecksumException,
  DecodeHintType,
  FormatException,
} from "@zxing/library";

let codeReader = null;
let controls = null;
let isResultLocked = false;
let capturedImage = ref(null);

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
].filter(Boolean);

export function initScanner() {
  codeReader = new BrowserMultiFormatOneDReader();
}

export async function getVideoDevices() {
  if (!codeReader) initScanner();
  const devices = await BrowserCodeReader.listVideoInputDevices();
  return devices;
}
function captureFrame(video) {
  const canvas = document.createElement("canvas");
  const width = video.videoWidth || video.clientWidth || 1280;
  const height = video.videoHeight || video.clientHeight || 720;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.drawImage(video, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", 1.0);
}
export function unlockZxingScanner() {
  isResultLocked = false;
}
export async function startZxingScanner(
  videoElement,
  deviceId,
  onResult,
  onError,
) {
  if (!videoElement) {
    throw new Error("Video element is not ready");
  }
  if (controls) {
    unlockZxingScanner();
    return;
  }
  // stopZxingScanner();
  isResultLocked = false;

  const hints = new Map();
  hints.set(DecodeHintType.POSSIBLE_FORMATS, PRODUCT_BARCODE_FORMATS);

  codeReader = new BrowserMultiFormatOneDReader(hints, {
    delayBetweenScanAttempts: 50,
    delayBetweenScanSuccess: 800,
    tryPlayVideoTimeout: 3000,
  });
  const constraints = {
    video: {
      // ...(deviceId
      //   ? { deviceId: { exact: deviceId } }
      facingMode: { ideal: "environment" },

      width: { ideal: 1280},
      height: { ideal: 720 },

      advanced: [{ focusMode: "continuous" }, { exposureMode: "continuous" }],
    },
    audio: false,
  };
  controls = await codeReader.decodeFromConstraints(
    constraints,
    videoElement,
    (result, error, scanControls) => {
      if (result && !isResultLocked) {
        isResultLocked = true;

        const value = result.getText();
        const image = captureFrame(videoElement);
        // scanControls.stop();
        // controls = null;
        onResult({ text: value, image });
        return;
      }
      const ignoredErrors = [
        "NotFoundException",
        "ChecksumException",
        "FormatException",
      ];

      if (error && !ignoredErrors.includes(error.name)) {
        onError?.(error);
      }
    },
  );
  await new Promise((res) => setTimeout(res, 600));
}

export function stopZxingScanner() {
  if (controls && typeof controls.stop === "function") {
    controls.stop();
  }
  controls = null;
  codeReader = null;
  isResultLocked = false;
}


