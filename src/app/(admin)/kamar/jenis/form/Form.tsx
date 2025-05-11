/** @format */

// app/kamar/jenis/form/Form.tsx
/** @format */
"use client";
import toastShow from "@/utils/toast-show";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import BodyForm from "./BodyForm";
import submitData from "@/services/submitData";
import InputText from "@/components/input/InputText";
import ModalDef from "@/components/modal/ModalDef";
import { JenisKamarType } from "@/types";
import useJenisKamar from "@/stores/crud/JenisKamar";

type Props = {
  dtEdit: JenisKamarType | null;
  halaman: string;
};

const Form = ({ dtEdit, halaman }: Props) => {
  // store
  const { addData, updateData } = useJenisKamar();
  // state
  const [isLoading, setIsLoading] = useState(false);
  // hook form
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm<JenisKamarType>();

  // reset form
  const resetForm = () => {
    reset({
      id: "",
      nm_jenis_kamar: "",
      deskripsi: "",
      kapasitas: 0,
      harga_per_malam: 0,
    });
  };

  // data edit
  useEffect(() => {
    if (dtEdit) {
      setValue("id", dtEdit.id);
      setValue("nm_jenis_kamar", dtEdit.nm_jenis_kamar);
      setValue("deskripsi", dtEdit.deskripsi || "");
      setValue("kapasitas", dtEdit.kapasitas);
      setValue("harga_per_malam", dtEdit.harga_per_malam);
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dtEdit]);

  // simpan data
  const onSubmit: SubmitHandler<JenisKamarType> = async (row) => {
    submitData({
      row,
      dtEdit,
      setIsLoading,
      addData,
      updateData,
      resetForm,
      toastShow,
    });
  };

  return (
    <ModalDef id="add_jenis_kamar" title={`Form ${halaman}`} size="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText name="id" register={register} type="hidden" />
        <div className="grid grid-cols-8 gap-2 mb-4">
          <BodyForm
            register={register}
            errors={errors}
            dtEdit={dtEdit}
            control={control}
            watch={watch}
            setValue={setValue}
          />
        </div>
        <div>
          {isLoading ? (
            <span className="loading loading-dots loading-md" />
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSubmit(onSubmit)}
              type="submit"
            >
              Simpan
            </button>
          )}
        </div>
      </form>
    </ModalDef>
  );
};

export default Form;
