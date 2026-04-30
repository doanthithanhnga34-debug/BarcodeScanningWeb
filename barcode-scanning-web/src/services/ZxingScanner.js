import {
  BrowserCodeReader,
  BrowserMultiFormatOneDReader,
} from "@zxing/browser";
import {
  BarcodeFormat,
  ChecksumException,
  DecodeHintType,
  FormatException,
} from "@zxing/library";

let codeReader = null;
let controll = null;
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
].filter(Boolean);

export function initScanner() {
  codeReader = new BrowserMultiFormatOneDReader();
}

export async function getVideoDevices() {
  if (!codeReader) initScanner();
  const devices = await BrowserCodeReader.listVideoInputDevices();
  return devices;
}

export async function startZxingScanner(
  videoElement,
  deviceId,
  onResult,
  onError,
) {
  if (!videoElement) {
    throw new Error("Video element chưa sẵn sàng");
  }
  stopZxingScanner();
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

      width: { ideal: 640 },
      height: { ideal: 480 },

      advanced: [
      { focusMode: "continuous" },
      { exposureMode: "continuous" }
    ]
    },
    audio: false,
  };
  controll = await codeReader.decodeFromConstraints(
    constraints,
    videoElement,
    (result, error, scanControll) => {
      if (result && !isResultLocked) {
        isResultLocked = true;

        const value = result.getText();
        scanControll.stop();
        controll = null;
        onResult(value);
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
  await new Promise(res => setTimeout(res, 600));
}

export function stopZxingScanner() {
  if (controll && typeof controll.stop === "function") {
    controll.stop();
  }
  controll = null;
  codeReader = null;
  isResultLocked = false;
}
