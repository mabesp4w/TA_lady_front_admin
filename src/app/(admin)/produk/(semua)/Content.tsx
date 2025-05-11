/** @format */

// app/produk/Content.tsx
"use client";
import { useForm } from "react-hook-form";
import { Suspense, useEffect, useState } from "react";
import ShowData from "./ShowData";
import Form from "./form/Form";
import { Toaster } from "react-hot-toast";
import toastShow from "@/utils/toast-show";
import useProduk from "@/stores/crud/Produk";
import { showModal } from "@/utils/modalHelper";
import { useWelcomeContext } from "@/context/WelcomeContext";
import DeleteModal from "@/components/modal/DeleteModal";
import { ProdukType } from "@/types";
import DetailProduk from "./DetailProduk";
import SelectFromDb from "@/components/select/SelectFromDB";
import useKategoriProdukApi from "@/stores/api/KategoriProduk";

const halaman = "Produk";

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
  const { removeData, setShowProduk } = useProduk();
  const { setKategoriProduk, dtKategoriProduk } = useKategoriProdukApi();

  // state
  const [idDel, setIdDel] = useState<number | string>();
  const [dtEdit, setDtEdit] = useState<ProdukType | null>(null);
  const [, setDetailId] = useState<number | string | null>(null);

  const { control, watch } = useForm({
    defaultValues: {
      filter_kategori: "",
    },
  });

  // Pantau perubahan pada filter kategori
  useEffect(() => {
    const subscription = watch((value) => {
      if (value.filter_kategori !== undefined) {
        // Update URL with query parameter
        const url = new URL(window.location.href);
        if (value.filter_kategori) {
          url.searchParams.set("kategori_produk_id", value.filter_kategori);
        } else {
          url.searchParams.delete("kategori_produk_id");
        }
        window.history.pushState({}, "", url);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  // Load data kategori produk saat komponen dimuat
  useEffect(() => {
    setKategoriProduk({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTambah = () => {
    showModal("add_produk");
    setDtEdit(null);
  };

  const setEdit = async (row: ProdukType) => {
    // Pastikan mendapatkan detail lengkap terlebih dahulu
    await setShowProduk(row.id as string);
    const detailProduk = useProduk.getState().showProduk;

    // Gunakan data lengkap dari API
    setDtEdit(detailProduk);
    showModal("add_produk");
  };

  const showDetail = async (id: number | string) => {
    await setShowProduk(id);
    setDetailId(id);
    showModal("detail_produk");
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

  console.log({ dtKategoriProduk });

  return (
    <div className="flex flex-col h-full w-full">
      <div>
        <Toaster />
        <Form dtEdit={dtEdit} halaman={halaman} />
        <DeleteModal setDelete={setDelete} />
        <DetailProduk />
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <p>
              Silahkan Mengolah data {halaman}. Anda dapat mengelola informasi,
              harga, stok dan ketersediaan produk.
            </p>

            <button className="btn btn-primary" onClick={handleTambah}>
              Tambah Produk
            </button>
          </div>

          {/* Filter Kategori */}
          <div className="w-full md:w-1/3 mt-4">
            {dtKategoriProduk.length > 0 && (
              <SelectFromDb
                label="Filter Kategori"
                name="filter_kategori"
                dataDb={dtKategoriProduk}
                body={["id", "nm_kategori_produk"]}
                addClass="col-span-12 md:col-span-6"
                control={control}
                menuPosition="fixed"
              />
            )}
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
