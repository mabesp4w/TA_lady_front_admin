/** @format */

// app/produk/form/Form.tsx
"use client";
import toastShow from "@/utils/toast-show";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import BodyForm from "./BodyForm";
import ModalDef from "@/components/modal/ModalDef";
import useProduk from "@/stores/crud/Produk";
import { ProdukType } from "@/types";
import InputText from "@/components/input/InputText";
import { closeModal } from "@/utils/modalHelper";
import useKategoriProduk from "@/stores/crud/KategoriProduk";

type Props = {
  dtEdit: ProdukType | null;
  halaman: string;
};

const Form = ({ dtEdit, halaman }: Props) => {
  // store
  const { addData, updateData } = useProduk();
  const { setKategoriProduk } = useKategoriProduk();

  // state
  const [isLoading, setIsLoading] = useState(false);
  const [gambarFile, setGambarFile] = useState<File | null>(null);

  // hook form - tambahkan defaultValues
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm<ProdukType>({
    defaultValues: {
      id: "",
      kategori_produk_id: "",
      nm_produk: "",
      harga: 0,
      jumlah_stok: 0,
      tersedia: true,
      deskripsi: "",
    },
  });

  // Load kategori produk saat komponen dimuat
  useEffect(() => {
    setKategoriProduk({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reset form
  const resetForm = () => {
    reset({
      id: "",
      kategori_produk_id: "",
      nm_produk: "",
      harga: 0,
      jumlah_stok: 0,
      tersedia: true,
      deskripsi: "",
    });
    setGambarFile(null);
    closeModal("add_produk");
  };

  // data edit
  useEffect(() => {
    if (dtEdit) {
      // Selalu gunakan setValue dengan initial value jika property tidak ada
      setValue("id", dtEdit.id || "");
      setValue("kategori_produk_id", dtEdit.kategori_produk_id || "");
      setValue("nm_produk", dtEdit.nm_produk || "");
      setValue("harga", dtEdit.harga || 0);
      setValue("jumlah_stok", dtEdit.jumlah_stok || 0);
      setValue(
        "tersedia",
        dtEdit.tersedia !== undefined ? dtEdit.tersedia : true
      );
      setValue("deskripsi", dtEdit.deskripsi || "");
      // Reset state untuk gambar
      setGambarFile(null);
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dtEdit]);

  // simpan data
  const onSubmit: SubmitHandler<ProdukType> = async (data) => {
    setIsLoading(true);

    try {
      // Siapkan FormData untuk upload gambar
      const formData = new FormData();

      // Tambahkan semua field form ke FormData
      formData.append("kategori_produk_id", data.kategori_produk_id);
      formData.append("nm_produk", data.nm_produk);
      formData.append("harga", data.harga.toString());
      formData.append("jumlah_stok", data.jumlah_stok.toString());
      formData.append("tersedia", data.tersedia ? "1" : "0");
      formData.append("deskripsi", data.deskripsi || "");

      // Tambahkan gambar ke FormData jika dipilih
      if (gambarFile) {
        formData.append("jalur_gambar", gambarFile);
      }

      let response;

      // Proses tambah atau update
      if (dtEdit) {
        response = await updateData(dtEdit.id as string, formData);
      } else {
        response = await addData(formData);
      }

      // Tampilkan pesan sukses atau error
      toastShow({
        event: response.data,
      });

      if (response.status.includes("berhasil")) {
        resetForm();
      }
    } catch (error) {
      console.error(error);
      toastShow({
        event: {
          judul: "Gagal",
          type: "error",
          message: "Terjadi kesalahan saat menyimpan data",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = (file: File) => {
    setGambarFile(file);
  };

  const handleRemoveImage = () => {
    setGambarFile(null);
  };

  return (
    <ModalDef id="add_produk" title={`Form ${halaman}`} size="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText name="id" register={register} type="hidden" />

        <div className="grid grid-cols-12 gap-3 mb-4">
          <BodyForm
            register={register}
            errors={errors}
            dtEdit={dtEdit}
            control={control}
            watch={watch}
            setValue={setValue}
            handleAddImage={handleAddImage}
            handleRemoveImage={handleRemoveImage}
            gambarFile={gambarFile}
          />
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button type="button" className="btn btn-outline" onClick={resetForm}>
            Batal
          </button>
          {isLoading ? (
            <button className="btn btn-primary" disabled>
              <span className="loading loading-spinner loading-sm"></span>
              Menyimpan...
            </button>
          ) : (
            <button className="btn btn-primary" type="submit">
              Simpan
            </button>
          )}
        </div>
      </form>
    </ModalDef>
  );
};

export default Form;
