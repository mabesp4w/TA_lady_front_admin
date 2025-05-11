/** @format */

// app/pemesanan-kamar/DetailPemesanan.tsx
import { useEffect, useState } from "react";
import ModalDef from "@/components/modal/ModalDef";
import usePemesananKamar from "@/stores/crud/PemesananKamar";
import Image from "next/image";
import { formatRupiah } from "@/utils/formatRupiah";
import { BASE_URL } from "@/services/baseURL";
import toastShow from "@/utils/toast-show";
import { momentId } from "@/utils/momentIndonesia";

const DetailPemesanan = () => {
  const { showPemesanan, updateStatus, processPayment } = usePemesananKamar();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [metodePembayaran, setMetodePembayaran] =
    useState<string>("transfer_bank");

  useEffect(() => {
    if (showPemesanan) {
      setSelectedStatus("");
    }
  }, [showPemesanan]);

  if (!showPemesanan) {
    return null;
  }

  // Mendapatkan gambar utama kamar
  const getMainImage = () => {
    if (
      !showPemesanan.kamar ||
      !showPemesanan.kamar.gambar_kamar ||
      showPemesanan.kamar.gambar_kamar.length === 0
    ) {
      return null;
    }

    const mainImage = showPemesanan.kamar.gambar_kamar.find(
      (img) => img.gambar_utama
    );
    return mainImage
      ? mainImage.jalur_gambar
      : showPemesanan.kamar.gambar_kamar[0].jalur_gambar;
  };

  // Hitung durasi menginap
  const getDuration = () => {
    const checkIn = new Date(showPemesanan.tanggal_check_in);
    const checkOut = new Date(showPemesanan.tanggal_check_out);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Mendapatkan opsi status yang valid berdasarkan status saat ini
  const getValidStatusOptions = () => {
    const currentStatus = showPemesanan.status;
    const statusTransitions: Record<string, string[]> = {
      menunggu: ["dikonfirmasi", "dibatalkan"],
      dikonfirmasi: ["check_in", "dibatalkan"],
      check_in: ["check_out"],
      check_out: [],
      dibatalkan: [],
    };

    return statusTransitions[currentStatus || "menunggu"] || [];
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus) return;

    setIsLoading(true);
    try {
      const response = await updateStatus(
        showPemesanan.id as string,
        selectedStatus
      );
      toastShow({
        event: response.data,
      });
      setSelectedStatus("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!metodePembayaran) return;

    setIsLoading(true);
    try {
      const response = await processPayment(
        showPemesanan.id as string,
        metodePembayaran
      );
      toastShow({
        event: response.data,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const mainImage = getMainImage();
  const duration = getDuration();
  const validStatusOptions = getValidStatusOptions();

  return (
    <ModalDef
      id="detail_pemesanan"
      title={`Detail Pemesanan: ${showPemesanan.kode_pemesanan}`}
      size="lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-4">
          {/* Gambar Kamar */}
          <div className="relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden">
            {mainImage ? (
              <Image
                src={`${BASE_URL}/${mainImage}`}
                alt={`Kamar ${showPemesanan.kamar?.no_kamar}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-500">Tidak ada gambar</span>
              </div>
            )}
          </div>

          {/* Informasi Kamar */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Informasi Kamar</h3>
            <p>
              <span className="font-medium">Nomor Kamar:</span>{" "}
              {showPemesanan.kamar?.no_kamar}
            </p>
            <p>
              <span className="font-medium">Jenis Kamar:</span>{" "}
              {showPemesanan.kamar?.jenis_kamar?.nm_jenis_kamar}
            </p>
            <p>
              <span className="font-medium">Lantai:</span>{" "}
              {showPemesanan.kamar?.lantai}
            </p>
            <p>
              <span className="font-medium">Kapasitas:</span>{" "}
              {showPemesanan.kamar?.jenis_kamar?.kapasitas} orang
            </p>
            <p>
              <span className="font-medium">Harga per Malam:</span>{" "}
              {formatRupiah(
                showPemesanan.kamar?.jenis_kamar?.harga_per_malam || 0
              )}
            </p>
          </div>

          {/* Informasi Pembayaran */}
          {showPemesanan.pembayaran && showPemesanan.pembayaran.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                Informasi Pembayaran
              </h3>
              {showPemesanan.pembayaran.map((pembayaran, index) => (
                <div key={index} className="mb-2">
                  <p>
                    <span className="font-medium">Tanggal:</span>{" "}
                    {momentId(pembayaran.created_at).format("DD MMMM YYYY")}
                  </p>
                  <p>
                    <span className="font-medium">Jumlah:</span>{" "}
                    {formatRupiah(pembayaran.jumlah)}
                  </p>
                  <p>
                    <span className="font-medium">Metode:</span>{" "}
                    {pembayaran.metode_pembayaran
                      .replace("_", " ")
                      .toUpperCase()}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`badge ${
                        pembayaran.status === "selesai"
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {pembayaran.status.toUpperCase()}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          ) : showPemesanan.status_pembayaran === "belum_dibayar" ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Proses Pembayaran</h3>
              <div className="form-control w-full mb-2">
                <label className="label">
                  <span className="label-text">Metode Pembayaran</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={metodePembayaran}
                  onChange={(e) => setMetodePembayaran(e.target.value)}
                >
                  <option value="transfer_bank">Transfer Bank</option>
                  <option value="kartu_kredit">Kartu Kredit</option>
                  <option value="tunai">Tunai</option>
                </select>
              </div>
              <button
                className="btn btn-primary w-full"
                onClick={handleProcessPayment}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : null}
                Proses Pembayaran
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-center">Belum ada informasi pembayaran</p>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-4">
          {/* Informasi Pemesanan */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Informasi Pemesanan</h3>
            <p>
              <span className="font-medium">Kode Pemesanan:</span>{" "}
              {showPemesanan.kode_pemesanan}
            </p>
            <p>
              <span className="font-medium">Tanggal Check-in:</span>{" "}
              {momentId(showPemesanan.tanggal_check_in).format("DD MMMM YYYY")}
            </p>
            <p>
              <span className="font-medium">Tanggal Check-out:</span>{" "}
              {momentId(showPemesanan.tanggal_check_out).format("DD MMMM YYYY")}
            </p>
            <p>
              <span className="font-medium">Durasi:</span> {duration} malam
            </p>
            <p>
              <span className="font-medium">Total Harga:</span>{" "}
              {formatRupiah(showPemesanan.total_harga || 0)}
            </p>
            <p className="mt-2">
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`badge ${
                  showPemesanan.status === "dibatalkan"
                    ? "badge-error"
                    : showPemesanan.status === "check_in" ||
                      showPemesanan.status === "check_out"
                    ? "badge-success"
                    : "badge-info"
                }`}
              >
                {(showPemesanan.status || "").replace("_", " ").toUpperCase()}
              </span>
            </p>
            <p>
              <span className="font-medium">Status Pembayaran:</span>{" "}
              <span
                className={`badge ${
                  showPemesanan.status_pembayaran === "dibayar"
                    ? "badge-success"
                    : "badge-warning"
                }`}
              >
                {(showPemesanan.status_pembayaran || "")
                  .replace("_", " ")
                  .toUpperCase()}
              </span>
            </p>
          </div>

          {/* Informasi Tamu */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Informasi Tamu</h3>
            <p>
              <span className="font-medium">Nama:</span>{" "}
              {showPemesanan.user?.name}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {showPemesanan.user?.email}
            </p>
          </div>

          {/* Catatan */}
          {showPemesanan.catatan && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Catatan</h3>
              <p className="whitespace-pre-line">{showPemesanan.catatan}</p>
            </div>
          )}

          {/* Update Status */}
          {validStatusOptions.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Update Status</h3>
              <div className="form-control w-full mb-2">
                <label className="label">
                  <span className="label-text">Status Baru</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">Pilih Status</option>
                  {validStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="btn btn-primary w-full"
                disabled={!selectedStatus || isLoading}
                onClick={handleUpdateStatus}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : null}
                Update Status
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalDef>
  );
};

export default DetailPemesanan;
