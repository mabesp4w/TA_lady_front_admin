/** @format */

// app/pelanggan/form/Form.tsx
"use client";
import toastShow from "@/utils/toast-show";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import BodyForm from "./BodyForm";
import ModalDef from "@/components/modal/ModalDef";
import usePelanggan from "@/stores/crud/Pelanggan";
import { PelangganType } from "@/types";
import InputText from "@/components/input/InputText";
import { closeModal } from "@/utils/modalHelper";

type Props = {
  dtEdit: PelangganType | null;
  halaman: string;
};

type PelangganFormType = PelangganType & {
  email?: string;
  password?: string;
  password_confirmation?: string;
};

const Form = ({ dtEdit, halaman }: Props) => {
  // store
  const { addData, updateData } = usePelanggan();

  // state
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // hook form
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm<PelangganFormType>({
    defaultValues: {
      id: "",
      nm_pelanggan: "",
      no_hp: "",
      alamat: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  // reset form
  const resetForm = () => {
    reset({
      id: "",
      nm_pelanggan: "",
      no_hp: "",
      alamat: "",
      email: "",
      password: "",
      password_confirmation: "",
    });
    setPreviewImage(null);
    closeModal("add_pelanggan");
  };

  // data edit
  useEffect(() => {
    if (dtEdit) {
      setValue("id", dtEdit.id || "");
      setValue("nm_pelanggan", dtEdit.nm_pelanggan || "");
      setValue("no_hp", dtEdit.no_hp || "");
      setValue("alamat", dtEdit.alamat || "");

      if (dtEdit.user) {
        setValue("email", dtEdit.user.email || "");
      }

      // Reset password fields on edit
      setValue("password", "");
      setValue("password_confirmation", "");

      // Set preview image if available
      if (dtEdit.foto_pelanggan) {
        setPreviewImage(
          `${process.env.NEXT_PUBLIC_API_URL}/${dtEdit.foto_pelanggan}`
        );
      } else {
        setPreviewImage(null);
      }
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dtEdit]);

  // simpan data
  const onSubmit: SubmitHandler<PelangganFormType> = async (data) => {
    setIsLoading(true);

    try {
      // Siapkan FormData untuk upload foto
      const formData = new FormData();

      // Tambahkan semua field form ke FormData
      formData.append("nm_pelanggan", data.nm_pelanggan);
      formData.append("no_hp", data.no_hp);
      formData.append("alamat", data.alamat);

      if (data.email) {
        formData.append("email", data.email);
      }

      // Password hanya diproses jika ada (baru atau diubah)
      if (data.password) {
        formData.append("password", data.password);
      }

      // Tambahkan foto jika ada
      const fotoElement = document.getElementById(
        "foto_pelanggan"
      ) as HTMLInputElement;
      if (fotoElement && fotoElement.files && fotoElement.files.length > 0) {
        formData.append("foto_pelanggan", fotoElement.files[0]);
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

  return (
    <ModalDef id="add_pelanggan" title={`Form ${halaman}`} size="lg">
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
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
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
