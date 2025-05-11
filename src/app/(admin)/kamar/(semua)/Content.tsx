/** @format */

// app/kamar/Content.tsx
"use client";
import { Suspense, useEffect, useState } from "react";
import ShowData from "./ShowData";
import Form from "./form/Form";
import { Toaster } from "react-hot-toast";
import toastShow from "@/utils/toast-show";
import useKamar from "@/stores/crud/Kamar";
import { showModal } from "@/utils/modalHelper";
import { useWelcomeContext } from "@/context/WelcomeContext";
import DeleteModal from "@/components/modal/DeleteModal";
import { KamarType } from "@/types";
import DetailKamar from "./DetailKamar";
import useJenisKamar from "@/stores/crud/JenisKamar";

const halaman = "Kamar";

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
  const { removeData, setShowKamar } = useKamar();
  const { setJenisKamar } = useJenisKamar();

  // state
  const [idDel, setIdDel] = useState<number | string>();
  const [dtEdit, setDtEdit] = useState<KamarType | null>(null);
  const [, setDetailId] = useState<number | string | null>(null);

  // Load data jenis kamar saat komponen dimuat
  useEffect(() => {
    setJenisKamar({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTambah = () => {
    showModal("add_kamar");
    setDtEdit(null);
  };

  const setEdit = async (row: KamarType) => {
    // Pastikan mendapatkan detail lengkap dengan gambar terlebih dahulu
    await setShowKamar(row.id as string);
    const detailKamar = useKamar.getState().showKamar;

    // Gunakan data lengkap dari API
    setDtEdit(detailKamar);
    showModal("add_kamar");
  };

  const showDetail = async (id: number | string) => {
    await setShowKamar(id);
    setDetailId(id);
    showModal("detail_kamar");
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
        <DetailKamar />
        <div className="mb-4 flex justify-between">
          <p>
            Silahkan Mengolah data {halaman}. Anda dapat mengelola informasi dan
            gambar kamar serta mengubah ketersediaan kamar.
          </p>

          <button className="btn btn-primary" onClick={handleTambah}>
            Tambah Kamar
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
