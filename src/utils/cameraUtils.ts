/** @format */

// cameraUtils.ts

/**
 * Utility function to stop all active video streams in the application
 * This function aims to release all camera resources by:
 * 1. Finding and stopping all video element MediaStream tracks
 * 2. Setting video srcObject to null
 * 3. Using getUserMedia constraints to help browser release resources
 */
export const stopAllVideoStreams = (): void => {
  console.log("Stopping all video streams...");

  try {
    // Step 1: Find all video elements and stop their tracks
    const videoElements = document.querySelectorAll("video");
    let tracksCounter = 0;

    videoElements.forEach((video) => {
      if (video.srcObject instanceof MediaStream) {
        const stream = video.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach((track) => {
          track.stop();
          tracksCounter++;
        });

        // Important: Set srcObject to null to fully release
        video.srcObject = null;
      }
    });

    console.log(
      `Stopped ${tracksCounter} media tracks from ${videoElements.length} video elements`
    );

    // Step 2: Find any Html5QrCode scanner elements and try to clean them up
    const scannerElements = document.querySelectorAll('[id^="html5-qrcode-"]');
    scannerElements.forEach((element) => {
      // This helps clean up any HTML elements the library might have created
      if (element.innerHTML) {
        element.innerHTML = "";
      }
    });

    // Step 3: Clean up any additional HTML5QrCode elements that might be created
    // Look for both video and canvas elements that might be created by the library
    const qrVideoElements = document.querySelectorAll(
      'video[style*="position: absolute"]'
    );
    qrVideoElements.forEach((el) => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });

    const qrCanvasElements = document.querySelectorAll(
      'canvas[style*="position: absolute"]'
    );
    qrCanvasElements.forEach((el) => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });

    // Step 4: Try to request and immediately release camera to help reset state
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: false })
      .then((dummyStream) => {
        dummyStream.getTracks().forEach((track) => track.stop());
      })
      .catch(() => {
        // This is expected in some browsers - just ignore
      });
  } catch (error) {
    console.error("Error stopping video streams:", error);
  }
};

/**
 * Check if camera is currently in use by the application
 * @returns Promise<boolean> True if camera is in use
 */
export const isCameraInUse = async (): Promise<boolean> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );

    // No video devices found
    if (videoDevices.length === 0) {
      return false;
    }

    // Check if any video elements are using media streams
    const videoElements = document.querySelectorAll("video");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    for (const video of videoElements) {
      if (video.srcObject instanceof MediaStream) {
        const tracks = video.srcObject.getVideoTracks();
        if (tracks.length > 0) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking camera usage:", error);
    return false;
  }
};
