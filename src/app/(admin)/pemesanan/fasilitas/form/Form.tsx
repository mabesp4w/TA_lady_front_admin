/** @format */

// app/pemesanan-fasilitas/form/Form.tsx
"use client";
import toastShow from "@/utils/toast-show";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import BodyForm from "./BodyForm";
import ModalDef from "@/components/modal/ModalDef";
import usePemesananFasilitas from "@/stores/crud/PemesananFasilitas";
import { PemesananFasilitasType } from "@/types";
import { closeModal } from "@/utils/modalHelper";
import useFasilitas from "@/stores/crud/Fasilitas";

type Props = {
  halaman: string;
};

const Form = ({ halaman }: Props) => {
  // store
  const { addData } = usePemesananFasilitas();
  const { setFasilitas } = useFasilitas();

  // state
  const [isLoading, setIsLoading] = useState(false);

  // hook form - tambahkan defaultValues
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm<PemesananFasilitasType>({
    defaultValues: {
      fasilitas_id: "",
      tanggal_pemesanan: "",
      waktu_mulai: "",
      waktu_selesai: "",
      jumlah_orang: 1,
      catatan: "",
    },
  });

  // Load data fasilitas saat komponen dimuat
  useEffect(() => {
    setFasilitas({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reset form
  const resetForm = () => {
    reset({
      fasilitas_id: "",
      tanggal_pemesanan: "",
      waktu_mulai: "",
      waktu_selesai: "",
      jumlah_orang: 1,
      catatan: "",
    });
    closeModal("add_pemesanan_fasilitas");
  };

  // simpan data
  const onSubmit: SubmitHandler<PemesananFasilitasType> = async (data) => {
    setIsLoading(true);

    try {
      const response = await addData(data);

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

  return (
    <ModalDef id="add_pemesanan_fasilitas" title={`Form ${halaman}`} size="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-3 mb-4">
          <BodyForm
            register={register}
            errors={errors}
            control={control}
            watch={watch}
            setValue={setValue}
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
              Pesan Sekarang
            </button>
          )}
        </div>
      </form>
    </ModalDef>
  );
};

export default Form;
