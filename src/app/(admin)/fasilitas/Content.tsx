/** @format */

// app/fasilitas/Content.tsx
/** @format */

"use client";
import { Suspense, useEffect, useState } from "react";
import ShowData from "./ShowData";
import Form from "./form/Form";
import { Toaster } from "react-hot-toast";
import toastShow from "@/utils/toast-show";
import useFasilitas from "@/stores/crud/Fasilitas";
import { showModal } from "@/utils/modalHelper";
import { useWelcomeContext } from "@/context/WelcomeContext";
import DeleteModal from "@/components/modal/DeleteModal";
import { FasilitasType } from "@/types";
import DetailFasilitas from "./DetailFasilitas";

const halaman = "Fasilitas";

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
  const { removeData, setShowFasilitas } = useFasilitas();
  // state
  const [idDel, setIdDel] = useState<number | string>();
  const [dtEdit, setDtEdit] = useState<FasilitasType | null>(null);
  const [, setDetailId] = useState<number | string | null>(null);

  const handleTambah = () => {
    showModal("add_fasilitas");
    setDtEdit(null);
  };

  const setEdit = async (row: FasilitasType) => {
    // Pastikan mendapatkan detail lengkap dengan gambar terlebih dahulu
    await setShowFasilitas(row.id as string);
    const detailFasilitas = useFasilitas.getState().showFasilitas;

    // Gunakan data lengkap dari API
    setDtEdit(detailFasilitas);
    showModal("add_fasilitas");
  };
  const showDetail = async (id: number | string) => {
    await setShowFasilitas(id);
    setDetailId(id);
    showModal("detail_fasilitas");
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
        <DetailFasilitas />
        <div className="mb-4 flex justify-between">
          <p>
            Silahkan Mengolah data {halaman}. Anda dapat mengelola informasi dan
            gambar fasilitas.
          </p>

          <button className="btn btn-primary" onClick={handleTambah}>
            Tambah Fasilitas
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
