/** @format */

// app/pemesanan-kamar/Content.tsx
"use client";
import { Suspense, useEffect, useState } from "react";
import ShowData from "./ShowData";
import Form from "./form/Form";
import { Toaster } from "react-hot-toast";
import toastShow from "@/utils/toast-show";
import usePemesananKamar from "@/stores/crud/PemesananKamar";
import useKamar from "@/stores/crud/Kamar";
import { showModal } from "@/utils/modalHelper";
import { useWelcomeContext } from "@/context/WelcomeContext";
import DeleteModal from "@/components/modal/DeleteModal";
import { PemesananKamarType } from "@/types";
import DetailPemesanan from "./DetailPemesanan";
import { useForm } from "react-hook-form";
import SelectDef from "@/components/select/SelectDef";

const halaman = "Pemesanan Kamar";

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
  const { removeData, setShowPemesanan } = usePemesananKamar();
  const { setKamar } = useKamar();

  // state
  const [idDel, setIdDel] = useState<number | string>();
  const [dtEdit, setDtEdit] = useState<PemesananKamarType | null>(null);
  const [, setDetailId] = useState<number | string | null>(null);

  // form untuk filter
  const { control, watch } = useForm({
    defaultValues: {
      filter_status: "",
    },
  });

  // Pantau perubahan pada filter status
  useEffect(() => {
    const subscription = watch((value) => {
      if (value.filter_status !== undefined) {
        // Update URL with query parameter
        const url = new URL(window.location.href);
        if (value.filter_status) {
          url.searchParams.set("status", value.filter_status);
        } else {
          url.searchParams.delete("status");
        }
        window.history.pushState({}, "", url);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  // Load data kamar saat komponen dimuat
  useEffect(() => {
    setKamar({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTambah = () => {
    showModal("add_pemesanan");
    setDtEdit(null);
  };

  const setEdit = async (row: PemesananKamarType) => {
    // Pastikan mendapatkan detail lengkap terlebih dahulu
    await setShowPemesanan(row.id as string);
    const detailPemesanan = usePemesananKamar.getState().showPemesanan;

    // Gunakan data lengkap dari API
    setDtEdit(detailPemesanan);
    showModal("add_pemesanan");
  };

  const showDetail = async (id: number | string) => {
    await setShowPemesanan(id);
    setDetailId(id);
    showModal("detail_pemesanan");
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

  // Opsi untuk filter status
  const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "menunggu", label: "Menunggu" },
    { value: "dikonfirmasi", label: "Dikonfirmasi" },
    { value: "check_in", label: "Check In" },
    { value: "check_out", label: "Check Out" },
    { value: "dibatalkan", label: "Dibatalkan" },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <div>
        <Toaster />
        <Form dtEdit={dtEdit} halaman={halaman} />
        <DeleteModal setDelete={setDelete} />
        <DetailPemesanan />
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <p>
              Silahkan Mengolah data {halaman}. Anda dapat mengelola informasi
              pemesanan, mengubah status, dan memproses pembayaran.
            </p>

            <button className="btn btn-primary" onClick={handleTambah}>
              Tambah Pemesanan
            </button>
          </div>

          {/* Filter Status */}
          <div className="w-full md:w-1/3 mt-4">
            <SelectDef
              control={control}
              name="filter_status"
              options={statusOptions}
              addClass="w-full"
              placeholder="Filter Status"
            />
          </div>
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
