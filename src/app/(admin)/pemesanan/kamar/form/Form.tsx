/** @format */

// app/pemesanan-kamar/form/Form.tsx
"use client";
import toastShow from "@/utils/toast-show";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import BodyForm from "./BodyForm";
import ModalDef from "@/components/modal/ModalDef";
import usePemesananKamar from "@/stores/crud/PemesananKamar";
import { PemesananKamarType } from "@/types";
import InputText from "@/components/input/InputText";
import { closeModal } from "@/utils/modalHelper";
import useKamar from "@/stores/crud/Kamar";

type Props = {
  dtEdit: PemesananKamarType | null;
  halaman: string;
};

const Form = ({ dtEdit, halaman }: Props) => {
  // store
  const { addData, updateData } = usePemesananKamar();
  const { setKamar } = useKamar();

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
  } = useForm<PemesananKamarType>({
    defaultValues: {
      id: "",
      kamar_id: "",
      tanggal_check_in: "",
      tanggal_check_out: "",
      catatan: "",
    },
  });

  // Load data kamar saat komponen dimuat
  useEffect(() => {
    setKamar({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reset form
  const resetForm = () => {
    reset({
      id: "",
      kamar_id: "",
      tanggal_check_in: "",
      tanggal_check_out: "",
      catatan: "",
    });
    closeModal("add_pemesanan");
  };

  // data edit
  useEffect(() => {
    if (dtEdit) {
      // Selalu gunakan setValue dengan initial value jika property tidak ada
      setValue("id", dtEdit.id || "");
      setValue("kamar_id", dtEdit.kamar_id || "");
      setValue("tanggal_check_in", dtEdit.tanggal_check_in || "");
      setValue("tanggal_check_out", dtEdit.tanggal_check_out || "");
      setValue("catatan", dtEdit.catatan || "");
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dtEdit]);

  // simpan data
  const onSubmit: SubmitHandler<PemesananKamarType> = async (data) => {
    setIsLoading(true);

    try {
      let response;

      // Proses tambah atau update
      if (dtEdit) {
        response = await updateData(dtEdit.id as string, data);
      } else {
        response = await addData(data);
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

  return (
    <ModalDef id="add_pemesanan" title={`Form ${halaman}`} size="lg">
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
