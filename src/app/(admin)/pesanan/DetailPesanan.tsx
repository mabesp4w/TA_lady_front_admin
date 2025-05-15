/** @format */

// app/pesanan/DetailPesanan.tsx
import { useEffect, useState } from "react";
import ModalDef from "@/components/modal/ModalDef";
import usePesanan from "@/stores/crud/Pesanan";
import { formatRupiah } from "@/utils/formatRupiah";
import Image from "next/image";
import { BASE_URL } from "@/services/baseURL";
import toastShow from "@/utils/toast-show";
import { closeModal } from "@/utils/modalHelper";

const DetailPesanan = () => {
  const { showPesanan, updateStatus, processPayment } = usePesanan();
  const [newStatus, setNewStatus] = useState<string>("");
  const [metodePembayaran, setMetodePembayaran] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Reset form state when modal shows a different pesanan
  useEffect(() => {
    if (showPesanan) {
      setNewStatus(showPesanan.status);
      setMetodePembayaran(showPesanan.metode_pembayaran || "");
    }
  }, [showPesanan]);

  if (!showPesanan) {
    return null;
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

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!showPesanan || newStatus === showPesanan.status) return;

    setIsLoading(true);
    try {
      const response = await updateStatus(showPesanan.id as string, newStatus);

      toastShow({
        event: response.data,
      });

      if (response.status === "berhasil update") {
        // Muat ulang data pesanan
        closeModal("detail_pesanan");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle payment processing
  const handleProcessPayment = async () => {
    if (!showPesanan || !metodePembayaran) return;

    setIsLoading(true);
    try {
      const response = await processPayment(
        showPesanan.id as string,
        metodePembayaran
      );

      toastShow({
        event: response.data,
      });

      if (response.status === "berhasil") {
        // Muat ulang data pesanan
        closeModal("detail_pesanan");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if status can be updated
  const canUpdateStatus = () => {
    if (!showPesanan) return false;

    // Daftar transisi status yang valid
    const validTransitions: Record<string, string[]> = {
      menunggu: ["diproses", "dibatalkan"],
      diproses: ["selesai", "dibatalkan"],
      selesai: [],
      dibatalkan: [],
    };

    return (
      validTransitions[showPesanan.status]?.includes(newStatus) &&
      newStatus !== showPesanan.status
    );
  };

  // Check if payment can be processed
  const canProcessPayment = () => {
    return (
      showPesanan &&
      showPesanan.status_pembayaran === "belum_dibayar" &&
      metodePembayaran
    );
  };

  return (
    <ModalDef
      id="detail_pesanan"
      title={`Detail Pesanan: ${showPesanan.kode_pesanan}`}
      size="lg"
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Header Information */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-base-200 rounded-lg">
          <div>
            <h3 className="text-lg font-bold mb-2">Informasi Pesanan</h3>
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-gray-600">Kode Pesanan:</div>
              <div className="font-medium">{showPesanan.kode_pesanan}</div>

              <div className="text-gray-600">Tanggal:</div>
              <div>{formatDate(showPesanan.created_at)}</div>

              <div className="text-gray-600">Jenis Pesanan:</div>
              <div className="capitalize">{showPesanan.jenis_pesanan}</div>

              <div className="text-gray-600">Status:</div>
              <div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    showPesanan.status === "menunggu"
                      ? "bg-yellow-100 text-yellow-800"
                      : showPesanan.status === "diproses"
                      ? "bg-blue-100 text-blue-800"
                      : showPesanan.status === "selesai"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {showPesanan.status.charAt(0).toUpperCase() +
                    showPesanan.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Informasi Pembayaran</h3>
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-gray-600">Total:</div>
              <div className="font-bold text-primary">
                {formatRupiah(showPesanan.total_jumlah)}
              </div>

              <div className="text-gray-600">Status Pembayaran:</div>
              <div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    showPesanan.status_pembayaran === "belum_dibayar"
                      ? "bg-yellow-100 text-yellow-800"
                      : showPesanan.status_pembayaran === "dibayar"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {showPesanan.status_pembayaran
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
              </div>

              {showPesanan.metode_pembayaran && (
                <>
                  <div className="text-gray-600">Metode Pembayaran:</div>
                  <div>{showPesanan.metode_pembayaran}</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="p-4 bg-base-200 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Informasi Pelanggan</h3>
          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-gray-600">Nama:</div>
            <div>{showPesanan.user?.name || "-"}</div>

            <div className="text-gray-600">Email:</div>
            <div>{showPesanan.user?.email || "-"}</div>
          </div>
        </div>

        {/* Item List */}
        <div>
          <h3 className="text-lg font-bold mb-2">Daftar Item</h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Produk</th>
                  <th>Harga</th>
                  <th>Jumlah</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {showPesanan.item_pesanan?.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td className="flex items-center gap-2">
                      {item.produk?.jalur_gambar ? (
                        <div className="relative w-10 h-10 rounded-md overflow-hidden">
                          <Image
                            src={`${BASE_URL}/${item.produk.jalur_gambar}`}
                            alt={item.produk.nm_produk}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : null}
                      <div>
                        {item.produk?.nm_produk || "Produk tidak tersedia"}
                      </div>
                    </td>
                    <td>{formatRupiah(item.harga_satuan)}</td>
                    <td>{item.jumlah}</td>
                    <td>{formatRupiah(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="text-right font-bold">
                    Total:
                  </td>
                  <td className="font-bold text-primary">
                    {formatRupiah(showPesanan.total_jumlah)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Catatan */}
        {showPesanan.catatan && (
          <div className="mt-2">
            <h3 className="text-lg font-bold mb-2">Catatan</h3>
            <div className="p-3 bg-base-200 rounded-lg">
              {showPesanan.catatan}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Status Update */}
          {!["selesai", "dibatalkan"].includes(showPesanan.status) && (
            <div className="p-4 bg-base-200 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Ubah Status</h3>
              <div className="flex flex-col gap-2">
                <select
                  className="select select-bordered w-full"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="menunggu">Menunggu</option>
                  <option value="diproses">Diproses</option>
                  <option value="selesai">Selesai</option>
                  <option value="dibatalkan">Dibatalkan</option>
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

          {/* Payment Processing */}
          {showPesanan.status_pembayaran === "belum_dibayar" && (
            <div className="p-4 bg-base-200 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Proses Pembayaran</h3>
              <div className="flex flex-col gap-2">
                <select
                  className="select select-bordered w-full"
                  value={metodePembayaran}
                  onChange={(e) => setMetodePembayaran(e.target.value)}
                >
                  <option value="">Pilih Metode Pembayaran</option>
                  <option value="tunai">Tunai</option>
                  <option value="transfer">Transfer Bank</option>
                  <option value="qris">QRIS</option>
                </select>
                <button
                  className="btn btn-success"
                  onClick={handleProcessPayment}
                  disabled={!canProcessPayment() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Memproses...
                    </>
                  ) : (
                    "Proses Pembayaran"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalDef>
  );
};

export default DetailPesanan;
