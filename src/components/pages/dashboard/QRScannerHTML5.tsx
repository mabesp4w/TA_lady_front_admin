/** @format */

// QRScannerHTML5.tsx
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { stopAllVideoStreams } from "@/utils/cameraUtils";

interface QRScannerProps {
  onResult: (result: any, error: any) => void;
  onCancel: () => void;
}

const QRScannerHTML5: React.FC<QRScannerProps> = ({ onResult, onCancel }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef<boolean>(false);
  const scannerContainerId = "html5-qrcode-scanner";
  const [scannerStatus, setScannerStatus] = useState<
    "initializing" | "scanning" | "stopped"
  >("initializing");

  // Function to safely stop the scanner and cleanup DOM
  const stopScanner = async () => {
    try {
      if (scannerRef.current && isScanningRef.current) {
        console.log("Stopping scanner...");
        isScanningRef.current = false;

        try {
          await scannerRef.current.stop();
          console.log("Scanner stopped successfully");
        } catch (stopError) {
          console.error("Error stopping scanner:", stopError);
        }

        // Always call stopAllVideoStreams for thorough cleanup
        stopAllVideoStreams();

        // Clear scanner container to prevent UI duplicates
        const container = document.getElementById(scannerContainerId);
        if (container) {
          container.innerHTML = "";
        }

        setScannerStatus("stopped");
      }
    } catch (error) {
      console.error("Exception in stopScanner:", error);
    }
  };

  // Handle successful scan
  const handleScanSuccess = (decodedText: string) => {
    if (!isScanningRef.current) return; // Prevent duplicate processing

    console.log("QR code detected:", decodedText);

    // IMPORTANT: Stop the scanner FIRST, before calling onResult
    isScanningRef.current = false;
    setScannerStatus("stopped");

    // Stop all camera resources immediately
    if (scannerRef.current) {
      scannerRef.current.stop().catch((err) => {
        console.error("Error stopping scanner on successful scan:", err);
      });
    }

    // Always use the utility for thorough cleanup
    stopAllVideoStreams();

    // Clear scanner container to prevent UI duplicates
    const container = document.getElementById(scannerContainerId);
    if (container) {
      container.innerHTML = "";
    }

    // Wait a brief moment to ensure camera has time to stop
    setTimeout(() => {
      // Then call onResult with the scanned text
      onResult({ text: decodedText }, null);
    }, 200); // Increased timeout for more reliable cleanup
  };

  // Initialize and start scanner
  const initializeScanner = async () => {
    try {
      // Ensure we've stopped any previous scanner instance first
      await stopScanner();

      // Extra cleanup before creating a new scanner
      stopAllVideoStreams();

      // Clear the container element to prevent duplicates
      const container = document.getElementById(scannerContainerId);
      if (container) {
        container.innerHTML = "";
      }

      // Create new scanner instance
      const scanner = new Html5Qrcode(scannerContainerId);
      scannerRef.current = scanner;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      // Mark as scanning
      isScanningRef.current = true;
      setScannerStatus("scanning");

      // Check if there are any existing video elements and remove them
      document
        .querySelectorAll('video[style*="position: absolute"]')
        .forEach((el) => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });

      // Start scanner with a small delay to ensure previous cleanup is complete
      setTimeout(async () => {
        try {
          await scanner.start(
            { facingMode: "environment" },
            config,
            handleScanSuccess,
            (errorMessage) => {
              // Silent callback for QR decoding errors - normal during scanning
              if (
                isScanningRef.current &&
                !errorMessage.includes("NotFoundException")
              ) {
                console.log("Non-standard QR error:", errorMessage);
              }
            }
          );
          console.log("Scanner started successfully");
        } catch (startError) {
          console.error("Error starting scanner:", startError);
          setScannerStatus("stopped");
          isScanningRef.current = false;
          onResult(null, startError);
        }
      }, 100);
    } catch (error) {
      console.error("Error initializing scanner:", error);
      setScannerStatus("stopped");
      isScanningRef.current = false;
      onResult(null, error);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    stopScanner().then(() => {
      console.log("Scanner stopped due to cancel");
      onCancel();
    });
  };

  // Start scanner on component mount
  useEffect(() => {
    // Clean up any existing camera resources first
    stopAllVideoStreams();

    // Initialize with a small delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      initializeScanner();
    }, 100);

    // Clean up function runs on component unmount
    return () => {
      clearTimeout(initTimer);
      console.log("Component unmounting, cleaning up scanner...");
      stopScanner();

      // Extra cleanup on unmount
      stopAllVideoStreams();

      // Remove any scanner-related elements from DOM
      const container = document.getElementById(scannerContainerId);
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="mb-6">
      <div
        id={scannerContainerId}
        className="w-full max-w-sm mx-auto border rounded-lg overflow-hidden"
        style={{ minHeight: "300px" }}
      ></div>

      <div className="mt-2 text-center">
        <button
          onClick={handleCancel}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-lg transition-colors"
          disabled={scannerStatus !== "scanning"}
        >
          Batalkan Scan
        </button>

        {scannerStatus === "initializing" && (
          <p className="text-gray-500 text-sm mt-2">Memulai kamera...</p>
        )}
      </div>
    </div>
  );
};

export default QRScannerHTML5;
