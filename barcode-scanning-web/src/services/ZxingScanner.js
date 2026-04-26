import {  BrowserCodeReader, BrowserMultiFormatOneDReader} from "@zxing/browser";
import { BarcodeFormat, ChecksumException, DecodeHintType, FormatException } from "@zxing/library";

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
  BarcodeFormat.ITF,
];

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

  const hints= new Map();
  hints.set(DecodeHintType.POSSIBLE_FORMATS, PRODUCT_BARCODE_FORMATS);
  
  codeReader = new BrowserMultiFormatOneDReader(hints,{
    delayBetweenScanAttempts:100,
    delayBetweenScanSuccess:500,
    tryPlayVideoTimeout:3000,
  });
  const constraints={
   video: {
      ...(deviceId
        ? { deviceId: { exact: deviceId } }
        : { facingMode: { ideal: "environment" } }),

      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  }
  controll = codeReader.decodeFromConstraints(
    constraints,
    videoElement,
    (result, error, scanControll) => {
      if (result && !isResultLocked) {
        isResultLocked = true;

        onResult(result.getText());
        scanControll.stop();
        controll = null;
        return;

      }
      if (error && error.name != "NotFoundException" && error.name != ChecksumException && error.name != FormatException) {
        onError?.(error);
      }
    },
  );
}

export function stopZxingScanner() {
  if (controll) {
    controll.stop();
    controll= null;
  }
  codeReader = null;
  isResultLocked= false;
}
