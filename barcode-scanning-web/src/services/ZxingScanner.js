import { BrowserMultiFormatReader } from "@zxing/browser";

let codeReader = null;

export function initScanner() {
  codeReader = new BrowserMultiFormatReader();
}

export async function getVideoDevices() {
  if (!codeReader) initScanner();
  const devices = await codeReader.listVideoInputDevices();
  return devices;
}

export async function startZxingScanner(
  videoElement,
  deviceId,
  onResult,
  onError,
) {
  if (!codeReader) initScanner();
  return codeReader.decodeFromVideoDevice(
    deviceId,
    videoElement,
    (result, error) => {
      if (result) {
        onResult(result.getText());
      }
      if (error && error.name != "NotFoundException") {
        onError(error);
      }
    },
  );
}

export function stopZxingScanner() {
  if (codeReader) {
    codeReader.reset();
  }
}
