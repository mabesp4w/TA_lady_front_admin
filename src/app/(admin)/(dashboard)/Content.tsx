/** @format */

"use client";

import React, { useState, useEffect } from "react";
import usePemesananKamar from "@/stores/crud/PemesananKamar";
import usePemesananFasilitas from "@/stores/crud/PemesananFasilitas";
import { PemesananKamarType, PemesananFasilitasType } from "@/types";

// Import components
import QRScannerHTML5 from "@/components/pages/dashboard/QRScannerHTML5";
import ManualCodeInput from "@/components/pages/dashboard/ManualCodeInput";
import RoomBookingDetails from "@/components/pages/dashboard/RoomBookingDetails";
import FacilityBookingDetails from "@/components/pages/dashboard/FacilityBookingDetails";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import { stopAllVideoStreams, isCameraInUse } from "@/utils/cameraUtils"; // Updated import

const ScanPage: React.FC = () => {
  // Basic scanning state
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannerKey, setScannerKey] = useState<number>(0);

  // Extended state for booking details
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingType, setBookingType] = useState<"room" | "facility" | null>(
    null
  );
  const [roomBooking, setRoomBooking] = useState<PemesananKamarType | null>(
    null
  );
  const [facilityBooking, setFacilityBooking] =
    useState<PemesananFasilitasType | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<boolean>(false);

  // Get store functions
  const { getPemesananByCode: getRoomBooking, updateStatus: updateRoomStatus } =
    usePemesananKamar();
  const {
    getPemesananByCode: getFacilityBooking,
    changeStatus: updateFacilityStatus,
  } = usePemesananFasilitas();

  // Clean up camera resources when component unmounts
  useEffect(() => {
    return () => {
      console.log("ScanPage unmounting - stopping all video streams");
      stopAllVideoStreams();
    };
  }, []);

  // Additional cleanup - check for active cameras periodically
  useEffect(() => {
    // Only run this check when not actively scanning
    if (!isScanning) {
      const checkCameraInterval = setInterval(async () => {
        const cameraActive = await isCameraInUse();
        if (cameraActive) {
          console.log(
            "Detected active camera while not scanning - cleaning up"
          );
          stopAllVideoStreams();
        }
      }, 10000); // Check every 10 seconds

      return () => clearInterval(checkCameraInterval);
    }
  }, [isScanning]);

  // Handle scanning
  const handleScan = (): void => {
    // Reset all states to ensure clean start
    setRoomBooking(null);
    setFacilityBooking(null);
    setBookingType(null);
    setError(null);

    // Ensure camera is stopped before starting new scan
    stopAllVideoStreams();

    // Increment key to force remount of scanner component
    setScannerKey((prevKey) => prevKey + 1);

    // Set scanning state after cleanup
    setIsScanning(true);
  };

  // Handle scan result
  const handleScanResult = (result: any, error: any): void => {
    // Handle scan errors
    if (error) {
      console.error("Error scanning QR code:", error);
      setError("Terjadi kesalahan saat memindai QR code");
      setIsScanning(false);
      // Ensure camera is definitely stopped
      stopAllVideoStreams();
      return;
    }

    // Handle successful scan
    if (result) {
      console.log("Scan successful:", result.text);

      // Update scanning state first
      setIsScanning(false);

      // Make 100% sure camera is stopped
      stopAllVideoStreams();

      // Increment scanner key to force a full remount if scanner is used again
      setScannerKey((prevKey) => prevKey + 1);

      // Process the scanned code after ensuring camera is stopped
      processScannedCode(result.text);
    }
  };

  // Handle cancelling scan
  const handleCancelScan = (): void => {
    console.log("Scan cancelled by user");

    // Stop camera explicitly first
    stopAllVideoStreams();

    // Update state
    setIsScanning(false);

    // For safety, force scanner component to remount next time
    setScannerKey((prevKey) => prevKey + 1);
  };

  // Process the scanned code
  const processScannedCode = async (code: string): Promise<void> => {
    if (!code) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check for RM- prefix for room bookings
      if (code.startsWith("RM-") || code.startsWith("KMR-")) {
        setBookingType("room");
        const response = await getRoomBooking(code);

        if (response.status === "berhasil" && response.data) {
          setRoomBooking(response.data);
        } else {
          setError("Pemesanan kamar tidak ditemukan");
        }
      }
      // Check for FS- prefix for facility bookings
      else if (code.startsWith("FS-") || code.startsWith("FSL-")) {
        setBookingType("facility");
        const response = await getFacilityBooking(code);

        if (response.status === "berhasil" && response.data) {
          setFacilityBooking(response.data);
        } else {
          setError("Pemesanan fasilitas tidak ditemukan");
        }
      } else {
        setError(
          "Kode QR tidak valid. Format yang didukung: RM-xxx atau FS-xxx"
        );
      }
    } catch (err) {
      console.error("Error processing scanned code:", err);
      setError("Terjadi kesalahan saat memproses kode QR");
    } finally {
      setIsLoading(false);
    }
  };

  // Update room booking status
  const handleUpdateRoomStatus = async (newStatus: string): Promise<void> => {
    if (!roomBooking?.id) return;

    setStatusUpdating(true);
    try {
      const response = await updateRoomStatus(roomBooking.id, newStatus);

      if (response.status === "berhasil update status" && response.data) {
        // Refresh booking data
        const refreshResponse = await getRoomBooking(
          roomBooking.kode_pemesanan
        );
        if (refreshResponse.status === "berhasil" && refreshResponse.data) {
          setRoomBooking(refreshResponse.data);
        }
      } else {
        setError("Gagal mengubah status pemesanan");
      }
    } catch (err) {
      console.error("Error updating room status:", err);
      setError("Terjadi kesalahan saat mengubah status pemesanan");
    } finally {
      setStatusUpdating(false);
    }
  };

  // Update facility booking status
  const handleUpdateFacilityStatus = async (
    newStatus: string
  ): Promise<void> => {
    if (!facilityBooking?.id) return;

    setStatusUpdating(true);
    try {
      const response = await updateFacilityStatus(
        facilityBooking.id,
        newStatus
      );

      if (response.status === "berhasil update status" && response.data) {
        // Refresh booking data
        const refreshResponse = await getFacilityBooking(
          facilityBooking.kode_pemesanan
        );
        if (refreshResponse.status === "berhasil" && refreshResponse.data) {
          setFacilityBooking(refreshResponse.data);
        }
      } else {
        setError("Gagal mengubah status pemesanan");
      }
    } catch (err) {
      console.error("Error updating facility status:", err);
      setError("Terjadi kesalahan saat mengubah status pemesanan");
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {!isScanning ? (
        <div className="text-center mb-6">
          <button
            onClick={handleScan}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Scan QR Code
          </button>

          <div className="mt-4">
            <ManualCodeInput onSubmit={processScannedCode} />
          </div>
        </div>
      ) : (
        <QRScannerHTML5
          key={scannerKey} // Force remount when key changes
          onResult={handleScanResult}
          onCancel={handleCancelScan}
        />
      )}

      <ErrorDisplay message={error} />
      <LoadingIndicator isLoading={isLoading} />

      {bookingType === "room" && roomBooking && (
        <RoomBookingDetails
          roomBooking={roomBooking}
          statusUpdating={statusUpdating}
          onUpdateStatus={handleUpdateRoomStatus}
        />
      )}

      {bookingType === "facility" && facilityBooking && (
        <FacilityBookingDetails
          facilityBooking={facilityBooking}
          statusUpdating={statusUpdating}
          onUpdateStatus={handleUpdateFacilityStatus}
        />
      )}
    </div>
  );
};

export default ScanPage;
