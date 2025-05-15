/** @format */

// app/pemesanan-fasilitas/DetailPemesanan.tsx
import { useEffect, useState } from "react";
import ModalDef from "@/components/modal/ModalDef";
import usePemesananFasilitas from "@/stores/crud/PemesananFasilitas";
import Image from "next/image";
import { formatRupiah } from "@/utils/formatRupiah";
import { BASE_URL } from "@/services/baseURL";
import toastShow from "@/utils/toast-show";
import { momentId } from "@/utils/momentIndonesia";

type Props = {
  isAdmin?: boolean;
};

const DetailPemesanan = ({ isAdmin = false }: Props) => {
  const { showPemesanan, changeStatus, updateData } = usePemesananFasilitas();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [metodePembayaran, setMetodePembayaran] =
    useState<string>("transfer_bank");
  const [catatan, setCatatan] = useState<string>("");

  useEffect(() => {
    if (showPemesanan) {
      setSelectedStatus("");
      setCatatan(showPemesanan.catatan || "");
      setMetodePembayaran(showPemesanan.metode_pembayaran || "transfer_bank");
    }
  }, [showPemesanan]);

  if (!showPemesanan) {
    return null;
  }

  // Format waktu
  const formatWaktu = (waktu: string) => {
    if (!waktu) return "";
    return waktu.substring(0, 5); // Format 24h: HH:MM
  };

  // Mendapatkan opsi status yang valid berdasarkan status saat ini
  const getValidStatusOptions = () => {
    if (!isAdmin) return [];

    const currentStatus = showPemesanan.status;
    const statusTransitions: Record<string, string[]> = {
      menunggu: ["dikonfirmasi", "dibatalkan"],
      dikonfirmasi: ["digunakan", "dibatalkan"],
      digunakan: ["dibatalkan"],
      dibatalkan: [],
    };

    return statusTransitions[currentStatus || "menunggu"] || [];
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus) return;

    setIsLoading(true);
    try {
      const response = await changeStatus(
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

  const handleUpdatePembayaran = async () => {
    setIsLoading(true);
    try {
      const response = await updateData(showPemesanan.id as string, {
        metode_pembayaran: metodePembayaran,
        status_pembayaran: "dibayar",
      });
      toastShow({
        event: response.data,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCatatan = async () => {
    setIsLoading(true);
    try {
      const response = await updateData(showPemesanan.id as string, {
        catatan,
      });
      toastShow({
        event: response.data,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validStatusOptions = getValidStatusOptions();

  return (
    <ModalDef
      id="detail_pemesanan_fasilitas"
      title={`Detail Pemesanan: ${showPemesanan.kode_pemesanan}`}
      size="lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-4">
          {/* Gambar Fasilitas */}
          <div className="relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden">
            {showPemesanan.fasilitas?.gambar_fasilitas ? (
              <Image
                src={`${BASE_URL}/${showPemesanan.fasilitas.gambar_fasilitas}`}
                alt={showPemesanan.fasilitas.nm_fasilitas}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-500">Tidak ada gambar</span>
              </div>
            )}
          </div>

          {/* Informasi Fasilitas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Informasi Fasilitas</h3>
            <p>
              <span className="font-medium">Nama:</span>{" "}
              {showPemesanan.fasilitas?.nm_fasilitas}
            </p>
            <p>
              <span className="font-medium">Kapasitas:</span>{" "}
              {showPemesanan.fasilitas?.kapasitas || "Tidak terbatas"} orang
            </p>
            <p>
              <span className="font-medium">Jam Operasional:</span>{" "}
              {formatWaktu(showPemesanan.fasilitas?.jam_buka || "")} -{" "}
              {formatWaktu(showPemesanan.fasilitas?.jam_tutup || "")}
            </p>
            <p>
              <span className="font-medium">Harga per Jam:</span>{" "}
              {formatRupiah(showPemesanan.fasilitas?.harga || 0)}
            </p>
            {showPemesanan.fasilitas?.deskripsi && (
              <p>
                <span className="font-medium">Deskripsi:</span>{" "}
                {showPemesanan.fasilitas.deskripsi}
              </p>
            )}
          </div>

          {/* Informasi Pembayaran */}
          {showPemesanan.status_pembayaran === "dibayar" ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                Informasi Pembayaran
              </h3>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className="badge badge-success">DIBAYAR</span>
              </p>
              <p>
                <span className="font-medium">Metode:</span>{" "}
                {(showPemesanan.metode_pembayaran || "")
                  .replace("_", " ")
                  .toUpperCase()}
              </p>
            </div>
          ) : isAdmin ? (
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
                onClick={handleUpdatePembayaran}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : null}
                Tandai Sebagai Dibayar
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-center font-medium">Menunggu Pembayaran</p>
              <p className="text-center text-sm text-gray-500 mt-1">
                Silahkan lakukan pembayaran di hotel kami
              </p>
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
              <span className="font-medium">Tanggal:</span>{" "}
              {momentId(showPemesanan.tanggal_pemesanan).format("DD MMM YYYY")}
            </p>
            <p>
              <span className="font-medium">Waktu:</span>{" "}
              {showPemesanan.waktu_mulai} - {showPemesanan.waktu_selesai}
            </p>
            <p>
              <span className="font-medium">Jumlah Orang:</span>{" "}
              {showPemesanan.jumlah_orang} orang
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
                    : showPemesanan.status === "digunakan"
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

          {/* Informasi Pemesan */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Informasi Pemesan</h3>
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
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Catatan</h3>
            {isAdmin ? (
              <>
                <textarea
                  className="textarea textarea-bordered w-full mb-2"
                  placeholder="Tambahkan catatan"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                />
                <button
                  className="btn btn-sm btn-outline"
                  onClick={handleSaveCatatan}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : null}
                  Simpan Catatan
                </button>
              </>
            ) : (
              <p className="whitespace-pre-line">
                {showPemesanan.catatan || "Tidak ada catatan"}
              </p>
            )}
          </div>

          {/* Update Status (Admin only) */}
          {isAdmin && validStatusOptions.length > 0 && (
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
