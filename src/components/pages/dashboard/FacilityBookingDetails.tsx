/** @format */

import React from "react";
import { PemesananFasilitasType } from "@/types";
import StatusBadge from "@/components/pages/dashboard/StatusBadge";
import PaymentBadge from "@/components/pages/dashboard/PaymentBadge";
import {
  Building,
  Calendar,
  Clock,
  CreditCard,
  Users,
  Loader2,
  Check,
  X,
  ClipboardCheck,
} from "lucide-react";
import { momentId } from "@/utils/momentIndonesia";
import showRupiah from "@/services/rupiah";

interface FacilityBookingDetailsProps {
  facilityBooking: PemesananFasilitasType;
  statusUpdating: boolean;
  onUpdateStatus: (newStatus: string) => Promise<void>;
}

const FacilityBookingDetails: React.FC<FacilityBookingDetailsProps> = ({
  facilityBooking,
  statusUpdating,
  onUpdateStatus,
}) => {
  // Get available next status options for facility booking
  const getFacilityStatusOptions = (currentStatus: string): any[] => {
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
            value: "digunakan",
            label: "Digunakan",
            icon: <ClipboardCheck size={16} />,
          },
          { value: "dibatalkan", label: "Batalkan", icon: <X size={16} /> },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Pemesanan Fasilitas</h2>
        <StatusBadge status={facilityBooking.status} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Building className="w-4 h-4 mr-2" />
            <span>Fasilitas</span>
          </div>
          <span className="font-medium">
            {facilityBooking.fasilitas?.nm_fasilitas}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Tanggal</span>
          </div>
          <span className="font-medium">
            {momentId(facilityBooking.tanggal_pemesanan).format("DD MMM YYYY")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>Waktu</span>
          </div>
          <span className="font-medium">
            {momentId(facilityBooking.waktu_mulai, "HH:mm").format("HH:mm")} -{" "}
            {momentId(facilityBooking.waktu_selesai, "HH:mm").format("HH:mm")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>Jumlah Orang</span>
          </div>
          <span className="font-medium">
            {facilityBooking.jumlah_orang} orang
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <CreditCard className="w-4 h-4 mr-2" />
            <span>Total</span>
          </div>
          <span className="font-medium">
            {showRupiah(facilityBooking.total_harga)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <CreditCard className="w-4 h-4 mr-2" />
            <span>Pembayaran</span>
          </div>
          <PaymentBadge status={facilityBooking.status_pembayaran} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>Pemesan</span>
          </div>
          <span className="font-medium">{facilityBooking.user?.name}</span>
        </div>

        {facilityBooking.catatan && (
          <div className="mt-2 border-t pt-2">
            <p className="text-gray-600 text-sm font-medium">Catatan:</p>
            <p className="text-sm">{facilityBooking.catatan}</p>
          </div>
        )}
      </div>

      {/* Status update options */}
      {getFacilityStatusOptions(facilityBooking.status).length > 0 && (
        <div className="mt-4 border-t pt-4">
          <p className="text-sm font-medium mb-2">Ubah Status:</p>
          <div className="flex flex-wrap gap-2">
            {getFacilityStatusOptions(facilityBooking.status).map((option) => (
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

export default FacilityBookingDetails;
