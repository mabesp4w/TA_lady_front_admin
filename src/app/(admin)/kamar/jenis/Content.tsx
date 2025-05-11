/** @format */

// app/kamar/jenis/Content.tsx
/** @format */

"use client";
import { Suspense, useEffect, useState } from "react";
import ShowData from "./ShowData";
import Form from "./form/Form";
import { Toaster } from "react-hot-toast";
import toastShow from "@/utils/toast-show";
import useJenisKamar from "@/stores/crud/JenisKamar";
import { showModal } from "@/utils/modalHelper";
import { useWelcomeContext } from "@/context/WelcomeContext";
import DeleteModal from "@/components/modal/DeleteModal";
import { JenisKamarType } from "@/types";

const halaman = "Jenis Kamar";

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
  const { removeData } = useJenisKamar();
  // state
  const [idDel, setIdDel] = useState<number | string>();
  const [dtEdit, setDtEdit] = useState<JenisKamarType | null>(null);

  const handleTambah = () => {
    showModal("add_jenis_kamar");
    setDtEdit(null);
  };

  const setEdit = (row: JenisKamarType) => {
    showModal("add_jenis_kamar");
    setDtEdit(row);
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
        <div className="mb-4 flex justify-between">
          <p>
            Silahkan Mengolah data {halaman}. Data ini digunakan untuk
            mengelompokkan produk.
          </p>

          <button className="btn btn-primary" onClick={handleTambah}>
            Tambah Data
          </button>
        </div>
      </div>

      <Suspense>
        <ShowData setDelete={setDelete} setEdit={setEdit} />
      </Suspense>
    </div>
  );
};

export default Content;
