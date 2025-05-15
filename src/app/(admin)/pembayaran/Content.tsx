/** @format */

// app/pembayaran/Content.tsx
"use client";
import { Suspense, useEffect, useState } from "react";
import ShowData from "./ShowData";
import { Toaster } from "react-hot-toast";
import toastShow from "@/utils/toast-show";
import usePembayaran from "@/stores/crud/Pembayaran";
import { showModal } from "@/utils/modalHelper";
import { useWelcomeContext } from "@/context/WelcomeContext";
import DeleteModal from "@/components/modal/DeleteModal";
import { PembayaranType } from "@/types";
import DetailPembayaran from "./DetailPembayaran";
import FormPembayaran from "./form/Form";
import StatisticsView from "./StatisticsView";

const halaman = "Pembayaran";

// type setDelete
type Delete = {
  id?: number | string;
  isDelete: boolean;
};

const Content = () => {
  const { setWelcome } = useWelcomeContext();
  // effect welcome
  useEffect(() => {
    setWelcome(`Halaman ` + halaman);

    return () => {};
  }, [setWelcome]);

  // store
  const { removeData, setShowPembayaran, getPaymentStatistics } =
    usePembayaran();

  // state
  const [idDel, setIdDel] = useState<number | string>();
  const [dtEdit, setDtEdit] = useState<PembayaranType | null>(null);
  const [, setDetailId] = useState<number | string | null>(null);
  const [jenisFilter, setJenisFilter] = useState<string>("");
  const [metodeFilter, setMetodeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "statistics">("list");
  const [statisticsMonth, setStatisticsMonth] = useState<string>(
    new Date().getMonth() + 1 < 10
      ? `0${new Date().getMonth() + 1}`
      : `${new Date().getMonth() + 1}`
  );
  const [statisticsYear, setStatisticsYear] = useState<string>(
    new Date().getFullYear().toString()
  );

  useEffect(() => {
    if (viewMode === "statistics") {
      getPaymentStatistics({
        bulan: statisticsMonth,
        tahun: statisticsYear,
      });
    }
  }, [viewMode, statisticsMonth, statisticsYear, getPaymentStatistics]);

  const handleTambah = () => {
    showModal("add_pembayaran");
    setDtEdit(null);
  };

  const setEdit = async (row: PembayaranType) => {
    // Cek jika pembayaran sudah selesai
    if (row.status === "selesai") {
      toastShow({
        event: {
          judul: "Perhatian",
          type: "warning",
          message: "Pembayaran yang sudah selesai tidak dapat diubah",
        },
      });
      return;
    }

    // Cek jika pembayaran menggunakan midtrans
    if (row.metode_pembayaran === "midtrans") {
      toastShow({
        event: {
          judul: "Perhatian",
          type: "warning",
          message: "Pembayaran menggunakan Midtrans tidak dapat diubah manual",
        },
      });
      return;
    }

    // Pastikan mendapatkan detail lengkap terlebih dahulu
    await setShowPembayaran(row.id as string);
    const detailPembayaran = usePembayaran.getState().showPembayaran;

    // Gunakan data lengkap dari API
    setDtEdit(detailPembayaran);
    showModal("add_pembayaran");
  };

  const showDetail = async (id: number | string) => {
    await setShowPembayaran(id);
    setDetailId(id);
    showModal("detail_pembayaran");
  };

  const generateReceipt = async (id: number | string) => {
    const pembayaran = usePembayaran.getState().showPembayaran;
    if (pembayaran && pembayaran.status === "selesai") {
      const response = await usePembayaran.getState().generateReceipt(id);
      if (response.status === "berhasil") {
        showModal("receipt_pembayaran");
      } else {
        toastShow({
          event: {
            judul: "Gagal",
            type: "error",
            message:
              response.error?.message || "Gagal membuat bukti pembayaran",
          },
        });
      }
    } else {
      toastShow({
        event: {
          judul: "Perhatian",
          type: "warning",
          message:
            "Hanya pembayaran yang sudah selesai dapat mencetak bukti pembayaran",
        },
      });
    }
  };

  const setDelete = async ({ id, isDelete }: Delete) => {
    setIdDel(id);
    showModal("modal_delete");
    if (isDelete) {
      const { data } = await removeData(idDel as string);
      toastShow({
        event: data,
      });
    }
  };

  // Jenis pembayaran filter options
  const jenisOptions = [
    { value: "", label: "Semua Jenis" },
    { value: "pesanan", label: "Pesanan Produk" },
    { value: "pemesanan_kamar", label: "Pemesanan Kamar" },
    { value: "pemesanan_fasilitas", label: "Pemesanan Fasilitas" },
  ];

  // Metode pembayaran filter options
  const metodeOptions = [
    { value: "", label: "Semua Metode" },
    { value: "cash", label: "Tunai" },
    { value: "transfer", label: "Transfer" },
    { value: "midtrans", label: "Midtrans" },
  ];

  // Status filter options
  const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "menunggu", label: "Menunggu" },
    { value: "selesai", label: "Selesai" },
    { value: "gagal", label: "Gagal" },
    { value: "dikembalikan", label: "Dikembalikan" },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <div>
        <Toaster />
        <FormPembayaran dtEdit={dtEdit} halaman={halaman} />
        <DeleteModal setDelete={setDelete} />
        <DetailPembayaran onGenerateReceipt={generateReceipt} />

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p>
              Silahkan Mengolah data {halaman}. Anda dapat mengelola informasi
              pembayaran pesanan, pemesanan kamar, dan pemesanan fasilitas.
            </p>

            <div className="flex gap-2">
              <div className="btn-group">
                <button
                  className={`btn ${viewMode === "list" ? "btn-active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  Daftar
                </button>
                <button
                  className={`btn ${
                    viewMode === "statistics" ? "btn-active" : ""
                  }`}
                  onClick={() => setViewMode("statistics")}
                >
                  Statistik
                </button>
              </div>
              <button className="btn btn-primary" onClick={handleTambah}>
                Tambah Pembayaran
              </button>
            </div>
          </div>

          {viewMode === "list" && (
            /* Filters */
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={jenisFilter}
                  onChange={(e) => setJenisFilter(e.target.value)}
                >
                  {jenisOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={metodeFilter}
                  onChange={(e) => setMetodeFilter(e.target.value)}
                >
                  {metodeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {viewMode === "statistics" && (
            /* Statistik Filter */
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={statisticsMonth}
                  onChange={(e) => setStatisticsMonth(e.target.value)}
                >
                  <option value="01">Januari</option>
                  <option value="02">Februari</option>
                  <option value="03">Maret</option>
                  <option value="04">April</option>
                  <option value="05">Mei</option>
                  <option value="06">Juni</option>
                  <option value="07">Juli</option>
                  <option value="08">Agustus</option>
                  <option value="09">September</option>
                  <option value="10">Oktober</option>
                  <option value="11">November</option>
                  <option value="12">Desember</option>
                </select>
              </div>

              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={statisticsYear}
                  onChange={(e) => setStatisticsYear(e.target.value)}
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <Suspense>
        {viewMode === "list" ? (
          <ShowData
            setDelete={setDelete}
            setEdit={setEdit}
            showDetail={showDetail}
            jenisFilter={jenisFilter}
            metodeFilter={metodeFilter}
            statusFilter={statusFilter}
          />
        ) : (
          <StatisticsView month={statisticsMonth} year={statisticsYear} />
        )}
      </Suspense>
    </div>
  );
};

export default Content;
