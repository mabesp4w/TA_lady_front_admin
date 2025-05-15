/** @format */

// app/pesanan/Content.tsx
"use client";
import { Suspense, useEffect, useState } from "react";
import ShowData from "./ShowData";
import { Toaster } from "react-hot-toast";
import toastShow from "@/utils/toast-show";
import usePesanan from "@/stores/crud/Pesanan";
import { showModal } from "@/utils/modalHelper";
import { useWelcomeContext } from "@/context/WelcomeContext";
import DeleteModal from "@/components/modal/DeleteModal";
import { PesananType } from "@/types";
import DetailPesanan from "./DetailPesanan";
import FormPesanan from "./form/Form";

const halaman = "Pesanan";

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
  const { removeData, setShowPesanan } = usePesanan();

  // state
  const [idDel, setIdDel] = useState<number | string>();
  const [dtEdit, setDtEdit] = useState<PesananType | null>(null);
  const [, setDetailId] = useState<number | string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [jenisFilter, setJenisFilter] = useState<string>("");

  const handleTambah = () => {
    showModal("add_pesanan");
    setDtEdit(null);
  };

  const setEdit = async (row: PesananType) => {
    // Pastikan mendapatkan detail lengkap terlebih dahulu
    await setShowPesanan(row.id as string);
    const detailPesanan = usePesanan.getState().showPesanan;

    // Gunakan data lengkap dari API
    setDtEdit(detailPesanan);
    showModal("add_pesanan");
  };

  const showDetail = async (id: number | string) => {
    await setShowPesanan(id);
    setDetailId(id);
    showModal("detail_pesanan");
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

  // Status filter options
  const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "menunggu", label: "Menunggu" },
    { value: "diproses", label: "Diproses" },
    { value: "selesai", label: "Selesai" },
    { value: "dibatalkan", label: "Dibatalkan" },
  ];

  // Jenis pesanan filter options
  const jenisOptions = [
    { value: "", label: "Semua Jenis" },
    { value: "online", label: "Online" },
    { value: "offline", label: "Offline" },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <div>
        <Toaster />
        <FormPesanan dtEdit={dtEdit} halaman={halaman} />
        <DeleteModal setDelete={setDelete} />
        <DetailPesanan />

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p>
              Silahkan Mengolah data {halaman}. Anda dapat mengelola informasi
              pesanan produk dan mengubah status pesanan.
            </p>

            <button className="btn btn-primary" onClick={handleTambah}>
              Tambah Pesanan
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
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
          </div>
        </div>
      </div>

      <Suspense>
        <ShowData
          setDelete={setDelete}
          setEdit={setEdit}
          showDetail={showDetail}
          statusFilter={statusFilter}
          jenisFilter={jenisFilter}
        />
      </Suspense>
    </div>
  );
};

export default Content;
