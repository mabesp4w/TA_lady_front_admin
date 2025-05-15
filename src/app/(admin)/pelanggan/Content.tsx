/** @format */

// app/pelanggan/Content.tsx
"use client";
import { Suspense, useEffect, useState } from "react";
import ShowData from "./ShowData";
import Form from "./form/Form";
import { Toaster } from "react-hot-toast";
import toastShow from "@/utils/toast-show";
import usePelanggan from "@/stores/crud/Pelanggan";
import { showModal } from "@/utils/modalHelper";
import { useWelcomeContext } from "@/context/WelcomeContext";
import DeleteModal from "@/components/modal/DeleteModal";
import { PelangganType } from "@/types";
import DetailPelanggan from "./DetailPelanggan";

const halaman = "Pelanggan";

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
  const { removeData, setShowPelanggan } = usePelanggan();

  // state
  const [idDel, setIdDel] = useState<number | string>();
  const [dtEdit, setDtEdit] = useState<PelangganType | null>(null);
  const [, setDetailId] = useState<number | string | null>(null);

  const handleTambah = () => {
    showModal("add_pelanggan");
    setDtEdit(null);
  };

  const setEdit = async (row: PelangganType) => {
    // Pastikan mendapatkan detail lengkap terlebih dahulu
    await setShowPelanggan(row.id as string);
    const detailPelanggan = usePelanggan.getState().showPelanggan;

    // Gunakan data lengkap dari API
    setDtEdit(detailPelanggan);
    showModal("add_pelanggan");
  };

  const showDetail = async (id: number | string) => {
    await setShowPelanggan(id);
    setDetailId(id);
    showModal("detail_pelanggan");
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

  return (
    <div className="flex flex-col h-full w-full">
      <div>
        <Toaster />
        <Form dtEdit={dtEdit} halaman={halaman} />
        <DeleteModal setDelete={setDelete} />
        <DetailPelanggan />
        <div className="mb-4 flex justify-between items-center">
          <p>
            Silahkan Mengolah data {halaman}. Anda dapat mengelola informasi
            pelanggan yang terdaftar dalam sistem.
          </p>

          <button className="btn btn-primary" onClick={handleTambah}>
            Tambah Pelanggan
          </button>
        </div>
      </div>

      <Suspense>
        <ShowData
          setDelete={setDelete}
          setEdit={setEdit}
          showDetail={showDetail}
        />
      </Suspense>
    </div>
  );
};

export default Content;
