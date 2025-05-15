/** @format */

// app/pembayaran/DetailPembayaran.tsx
import { useEffect, useState } from "react";
import ModalDef from "@/components/modal/ModalDef";
import usePembayaran from "@/stores/crud/Pembayaran";
import { formatRupiah } from "@/utils/formatRupiah";
import toastShow from "@/utils/toast-show";
import { closeModal } from "@/utils/modalHelper";
import ReceiptModal from "./ReceiptModal";

type Props = {
  onGenerateReceipt: (id: string | number) => void;
};

const DetailPembayaran = ({ onGenerateReceipt }: Props) => {
  const { showPembayaran, updateData } = usePembayaran();
  const [newStatus, setNewStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [receiptData] = useState<any>(null);

  // Reset form state when modal shows a different pembayaran
  useEffect(() => {
    if (showPembayaran) {
      setNewStatus(showPembayaran.status);
    }
  }, [showPembayaran]);

  if (!showPembayaran) {
    return (
      <>
        <ModalDef id="detail_pembayaran" title={`Detail Pembayaran`} size="lg">
          <div className="flex justify-center items-center p-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </ModalDef>
        <ReceiptModal data={receiptData} />
      </>
    );
  }

  // Format tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Format jenis pembayaran untuk tampilan
  const formatJenisPembayaran = (jenis: string) => {
    switch (jenis) {
      case "pesanan":
        return "Pesanan Produk";
      case "pemesanan_kamar":
        return "Pemesanan Kamar";
      case "pemesanan_fasilitas":
        return "Pemesanan Fasilitas";
      default:
        return jenis;
    }
  };

  // Format metode pembayaran untuk tampilan
  const formatMetodePembayaran = (metode: string) => {
    switch (metode) {
      case "cash":
        return "Tunai";
      case "transfer":
        return "Transfer";
      case "midtrans":
        return "Midtrans";
      default:
        return metode;
    }
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!showPembayaran || newStatus === showPembayaran.status) return;

    setIsLoading(true);
    try {
      const response = await updateData(showPembayaran.id as string, {
        status: newStatus,
      });

      toastShow({
        event: response.data,
      });

      if (response.status === "berhasil update") {
        // Close modal after successful update
        closeModal("detail_pembayaran");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if status can be updated
  const canUpdateStatus = () => {
    if (!showPembayaran) return false;

    // Jika sudah selesai, tidak bisa diubah
    if (showPembayaran.status === "selesai") return false;

    // Jika metode pembayaran midtrans, tidak bisa diubah manual
    if (showPembayaran.metode_pembayaran === "midtrans") return false;

    // Status baru harus berbeda dari status saat ini
    return newStatus !== showPembayaran.status;
  };

  // Get reference info based on payment type
  const getReferenceInfo = () => {
    if (
      showPembayaran.jenis_pembayaran === "pesanan" &&
      showPembayaran.pesanan
    ) {
      return {
        code: showPembayaran.pesanan.kode_pesanan,
        name: "Kode Pesanan",
        totalField: "total_jumlah",
        total: showPembayaran.pesanan.total_jumlah,
        customer: showPembayaran.pesanan.user?.name || "-",
      };
    } else if (showPembayaran.payable) {
      if (showPembayaran.payable_type?.includes("PemesananKamar")) {
        return {
          code: showPembayaran.payable.kode_pemesanan,
          name: "Kode Pemesanan Kamar",
          totalField: "total_harga",
          total: showPembayaran.payable.total_harga,
          customer: showPembayaran.payable.user?.name || "-",
          additional: showPembayaran.payable.kamar
            ? {
                title: `Kamar ${showPembayaran.payable.kamar.no_kamar}`,
                dates: `${formatDate(
                  showPembayaran.payable.tanggal_check_in
                )} s/d ${formatDate(showPembayaran.payable.tanggal_check_out)}`,
              }
            : null,
        };
      } else if (showPembayaran.payable_type?.includes("PemesananFasilitas")) {
        return {
          code: showPembayaran.payable.kode_pemesanan,
          name: "Kode Pemesanan Fasilitas",
          totalField: "total_harga",
          total: showPembayaran.payable.total_harga,
          customer: showPembayaran.payable.user?.name || "-",
          additional: showPembayaran.payable.fasilitas
            ? {
                title: showPembayaran.payable.fasilitas.nm_fasilitas,
                dates: `${formatDate(
                  showPembayaran.payable.tanggal_pemesanan
                )} (${showPembayaran.payable.waktu_mulai} - ${
                  showPembayaran.payable.waktu_selesai
                })`,
              }
            : null,
        };
      }
    }

    return {
      code: showPembayaran.id_transaksi || "-",
      name: "ID Transaksi",
      totalField: "jumlah",
      total: showPembayaran.jumlah,
      customer: "-",
    };
  };

  const referenceInfo = getReferenceInfo();

  // Handle generate receipt button click
  const handleGenerateReceipt = () => {
    onGenerateReceipt(showPembayaran.id as string);
  };

  return (
    <>
      <ModalDef
        id="detail_pembayaran"
        title={`Detail Pembayaran: ${showPembayaran.id_transaksi || ""}`}
        size="lg"
      >
        <div className="grid grid-cols-1 gap-6">
          {/* Header Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-base-200 rounded-lg">
            <div>
              <h3 className="text-lg font-bold mb-2">Informasi Pembayaran</h3>
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-gray-600">ID Transaksi:</div>
                <div className="font-medium">
                  {showPembayaran.id_transaksi || "-"}
                </div>

                <div className="text-gray-600">Jenis Pembayaran:</div>
                <div>
                  {formatJenisPembayaran(showPembayaran.jenis_pembayaran)}
                </div>

                <div className="text-gray-600">Metode Pembayaran:</div>
                <div>
                  {formatMetodePembayaran(showPembayaran.metode_pembayaran)}
                </div>

                <div className="text-gray-600">Tanggal:</div>
                <div>{formatDate(showPembayaran.created_at)}</div>

                <div className="text-gray-600">Status:</div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      showPembayaran.status === "menunggu"
                        ? "bg-yellow-100 text-yellow-800"
                        : showPembayaran.status === "selesai"
                        ? "bg-green-100 text-green-800"
                        : showPembayaran.status === "gagal"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {showPembayaran.status.charAt(0).toUpperCase() +
                      showPembayaran.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Informasi Referensi</h3>
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-gray-600">{referenceInfo.name}:</div>
                <div className="font-medium">{referenceInfo.code}</div>

                <div className="text-gray-600">Pelanggan:</div>
                <div>{referenceInfo.customer}</div>

                {referenceInfo.additional && (
                  <>
                    <div className="text-gray-600">Detail:</div>
                    <div>
                      <div>{referenceInfo.additional.title}</div>
                      <div className="text-xs">
                        {referenceInfo.additional.dates}
                      </div>
                    </div>
                  </>
                )}

                <div className="text-gray-600">Jumlah Pembayaran:</div>
                <div className="font-bold text-primary">
                  {formatRupiah(showPembayaran.jumlah)}
                </div>
              </div>
            </div>
          </div>

          {/* Detail Pembayaran */}
          {showPembayaran.detail_pembayaran && (
            <div className="p-4 bg-base-200 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Detail Pembayaran</h3>
              <pre className="whitespace-pre-wrap bg-base-100 p-3 rounded text-sm">
                {typeof showPembayaran.detail_pembayaran === "string"
                  ? JSON.stringify(
                      JSON.parse(showPembayaran.detail_pembayaran),
                      null,
                      2
                    )
                  : JSON.stringify(showPembayaran.detail_pembayaran, null, 2)}
              </pre>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 mt-4 justify-between">
            {/* Status Update */}
            {showPembayaran.status !== "selesai" &&
              showPembayaran.metode_pembayaran !== "midtrans" && (
                <div className="p-4 bg-base-200 rounded-lg flex-1">
                  <h3 className="text-lg font-bold mb-2">Ubah Status</h3>
                  <div className="flex flex-col gap-2">
                    <select
                      className="select select-bordered w-full"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="menunggu">Menunggu</option>
                      <option value="selesai">Selesai</option>
                      <option value="gagal">Gagal</option>
                      <option value="dikembalikan">Dikembalikan</option>
                    </select>
                    <button
                      className="btn btn-primary"
                      onClick={handleStatusUpdate}
                      disabled={!canUpdateStatus() || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Memproses...
                        </>
                      ) : (
                        "Ubah Status"
                      )}
                    </button>
                  </div>
                </div>
              )}

            {/* Print Receipt */}
            {showPembayaran.status === "selesai" && (
              <div className="p-4 bg-base-200 rounded-lg flex-1">
                <h3 className="text-lg font-bold mb-2">
                  Cetak Bukti Pembayaran
                </h3>
                <button
                  className="btn btn-accent w-full"
                  onClick={handleGenerateReceipt}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  Cetak Bukti Pembayaran
                </button>
              </div>
            )}
          </div>
        </div>
      </ModalDef>

      <ReceiptModal data={receiptData} />
    </>
  );
};

export default DetailPembayaran;
