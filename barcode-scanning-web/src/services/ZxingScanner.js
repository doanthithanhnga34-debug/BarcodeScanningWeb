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

  function prepareVideoForIOS(video) {
    if (!video) return;

    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("muted", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("poster", "");

    video.playsInline = true;
    video.muted = true;
    video.autoplay = true;
    video.controls = false;

    video.removeAttribute("controls");

    // Một số iPhone/Safari vẫn cố hiện native controls nếu chưa có style trực tiếp
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
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

    prepareVideoForIOS(videoElement);

    if (controls) {
      unlockZxingScanner();
      prepareVideoForIOS(videoElement);

      try {
        await videoElement.play();
      } catch (err) {
        console.warn("iOS video play warning:", err);
      }

      return;
    }

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
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
        advanced: [
          { focusMode: "continuous" },
          { exposureMode: "continuous" },
        ],
      },
      audio: false,
    };

    prepareVideoForIOS(videoElement);

    controls = await codeReader.decodeFromConstraints(
      constraints,
      videoElement,
      (result, error, scanControls) => {
        if (result && !isResultLocked) {
          isResultLocked = true;

          const value = result.getText();
          const image = captureFrame(videoElement);

          onResult({ text: value, image });
          return;
        }

        const ignoredErrors = [
          "NotFoundException",
          "ChecksumException",
          "FormatException",
        ];

        if (error && !ignoredErrors.includes(error?.name)) {
          onError?.(error);
        }
      },
    );

    prepareVideoForIOS(videoElement);

    try {
      await videoElement.play();
    } catch (err) {
      console.warn("iOS video play warning:", err);
    }

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
