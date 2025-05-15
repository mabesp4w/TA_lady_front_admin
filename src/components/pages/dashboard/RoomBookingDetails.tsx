/** @format */

import React from "react";
import { PemesananKamarType } from "@/types";
import StatusBadge from "@/components/pages/dashboard/StatusBadge";
import PaymentBadge from "@/components/pages/dashboard/PaymentBadge";
import {
  Bed,
  Calendar,
  CreditCard,
  Users,
  Loader2,
  Check,
  X,
  DoorOpen,
  DoorClosed,
} from "lucide-react";
import { momentId } from "@/utils/momentIndonesia";
import showRupiah from "@/services/rupiah";

interface RoomBookingDetailsProps {
  roomBooking: PemesananKamarType;
  statusUpdating: boolean;
  onUpdateStatus: (newStatus: string) => Promise<void>;
}

const RoomBookingDetails: React.FC<RoomBookingDetailsProps> = ({
  roomBooking,
  statusUpdating,
  onUpdateStatus,
}) => {
  // Get available next status options for room booking
  const getRoomStatusOptions = (currentStatus: string): any[] => {
    switch (currentStatus) {
      case "menunggu":
        return [
          {
            value: "dikonfirmasi",
            label: "Konfirmasi",
            icon: <Check size={16} />,
          },
          { value: "dibatalkan", label: "Batalkan", icon: <X size={16} /> },
        ];
      case "dikonfirmasi":
        return [
          {
            value: "check_in",
            label: "Check In",
            icon: <DoorOpen size={16} />,
          },
          { value: "dibatalkan", label: "Batalkan", icon: <X size={16} /> },
        ];
      case "check_in":
        return [
          {
            value: "check_out",
            label: "Check Out",
            icon: <DoorClosed size={16} />,
          },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Pemesanan Kamar</h2>
        <StatusBadge status={roomBooking.status} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Bed className="w-4 h-4 mr-2" />
            <span>Kamar</span>
          </div>
          <span className="font-medium">
            {roomBooking.kamar?.no_kamar} -{" "}
            {roomBooking.kamar?.jenis_kamar?.nm_jenis_kamar}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Check In</span>
          </div>
          <span className="font-medium">
            {momentId(roomBooking.tanggal_check_in).format("DD MMM YYYY")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Check Out</span>
          </div>
          <span className="font-medium">
            {momentId(roomBooking.tanggal_check_out).format("DD MMM YYYY")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <CreditCard className="w-4 h-4 mr-2" />
            <span>Total</span>
          </div>
          <span className="font-medium">
            {showRupiah(roomBooking.total_harga)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <CreditCard className="w-4 h-4 mr-2" />
            <span>Pembayaran</span>
          </div>
          <PaymentBadge status={roomBooking.status_pembayaran} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>Pemesan</span>
          </div>
          <span className="font-medium">{roomBooking.user?.name}</span>
        </div>

        {roomBooking.catatan && (
          <div className="mt-2 border-t pt-2">
            <p className="text-gray-600 text-sm font-medium">Catatan:</p>
            <p className="text-sm">{roomBooking.catatan}</p>
          </div>
        )}
      </div>

      {/* Status update options */}
      {getRoomStatusOptions(roomBooking.status).length > 0 && (
        <div className="mt-4 border-t pt-4">
          <p className="text-sm font-medium mb-2">Ubah Status:</p>
          <div className="flex flex-wrap gap-2">
            {getRoomStatusOptions(roomBooking.status).map((option) => (
              <button
                key={option.value}
                onClick={() => onUpdateStatus(option.value)}
                disabled={statusUpdating}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium 
                  ${
                    option.value === "dibatalkan"
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
              >
                {statusUpdating ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <span className="mr-1">{option.icon}</span>
                )}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomBookingDetails;
