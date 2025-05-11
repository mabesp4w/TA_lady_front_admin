/** @format */

// app/pemesanan-fasilitas/SearchByCode.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import usePemesananFasilitas from "@/stores/crud/PemesananFasilitas";
import { showModal } from "@/utils/modalHelper";
import toastShow from "@/utils/toast-show";
import ModalDef from "@/components/modal/ModalDef";

const SearchByCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getPemesananByCode, setShowPemesanan } = usePemesananFasilitas();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: { code: string }) => {
    if (!data.code) return;

    setIsLoading(true);
    try {
      const response = await getPemesananByCode(data.code);

      if (response.status === "berhasil" && response.data) {
        // Set data pemesanan ke store dan tampilkan detail
        await setShowPemesanan(response.data.id);
        showModal("detail_pemesanan_fasilitas");
        reset();
      } else {
        toastShow({
          event: {
            judul: "Gagal",
            type: "error",
            message: "Kode pemesanan tidak ditemukan",
          },
        });
      }
    } catch (error) {
      console.error(error);
      toastShow({
        event: {
          judul: "Gagal",
          type: "error",
          message: "Terjadi kesalahan saat mencari pemesanan",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-outline"
        onClick={() => showModal("search_by_code")}
      >
        Cari dengan Kode
      </button>

      <ModalDef
        id="search_by_code"
        title="Cari Pemesanan dengan Kode"
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Kode Pemesanan</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Masukkan kode pemesanan"
              {...register("code", { required: "Kode pemesanan harus diisi" })}
            />
            {errors.code && (
              <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => reset()}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : null}
              Cari
            </button>
          </div>
        </form>
      </ModalDef>
    </>
  );
};

export default SearchByCode;
