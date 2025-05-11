/** @format */

// app/fasilitas/form/Form.tsx
/** @format */
"use client";
import toastShow from "@/utils/toast-show";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import BodyForm from "./BodyForm";
import ModalDef from "@/components/modal/ModalDef";
import useFasilitas from "@/stores/crud/Fasilitas";
import { FasilitasType } from "@/types";
import InputText from "@/components/input/InputText";
import { closeModal } from "@/utils/modalHelper";

type Props = {
  dtEdit: FasilitasType | null;
  halaman: string;
};

const Form = ({ dtEdit, halaman }: Props) => {
  // store
  const { addData, updateData } = useFasilitas();
  // state
  const [isLoading, setIsLoading] = useState(false);
  const [gambarFiles, setGambarFiles] = useState<File[]>([]);
  const [gambarMain, setGambarMain] = useState<number>(-1);
  const [hapusGambar, setHapusGambar] = useState<(string | number)[]>([]);

  // hook form - tambahkan defaultValues
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm<FasilitasType>({
    defaultValues: {
      id: "",
      nm_fasilitas: "",
      deskripsi: "",
      harga: 0,
      jam_buka: "08:00",
      jam_tutup: "17:00",
      kapasitas: 1,
      tersedia: true,
      gambar_utama_id: "",
    },
  });

  // reset form
  const resetForm = () => {
    reset({
      id: "",
      nm_fasilitas: "",
      deskripsi: "",
      harga: 0,
      jam_buka: "08:00",
      jam_tutup: "17:00",
      kapasitas: 1,
      tersedia: true,
      gambar_utama_id: "",
    });
    setGambarFiles([]);
    setGambarMain(-1);
    setHapusGambar([]);
    closeModal("add_fasilitas");
  };

  // data edit
  useEffect(() => {
    if (dtEdit) {
      // Selalu gunakan setValue dengan initial value jika property tidak ada
      setValue("id", dtEdit.id || "");
      setValue("nm_fasilitas", dtEdit.nm_fasilitas || "");
      setValue("deskripsi", dtEdit.deskripsi || "");
      setValue("harga", dtEdit.harga || 0);
      setValue("jam_buka", dtEdit.jam_buka || "08:00");
      setValue("jam_tutup", dtEdit.jam_tutup || "17:00");
      setValue("kapasitas", dtEdit.kapasitas || 1);
      setValue(
        "tersedia",
        dtEdit.tersedia !== undefined ? dtEdit.tersedia : true
      );
      setValue("gambar_utama_id", ""); // Selalu reset ini
      // Reset state untuk gambar
      setGambarFiles([]);
      setGambarMain(-1);
      setHapusGambar([]);
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dtEdit]);

  // simpan data
  const onSubmit: SubmitHandler<FasilitasType> = async (data) => {
    setIsLoading(true);

    try {
      // Siapkan FormData untuk upload gambar
      const formData = new FormData();

      // Tambahkan semua field form ke FormData
      formData.append("nm_fasilitas", data.nm_fasilitas);
      formData.append("deskripsi", data.deskripsi || "");
      formData.append("harga", data.harga.toString());
      formData.append("jam_buka", data.jam_buka);
      formData.append("jam_tutup", data.jam_tutup);
      formData.append(
        "kapasitas",
        data.kapasitas ? data.kapasitas.toString() : "1"
      );
      formData.append("tersedia", data.tersedia ? "1" : "0");

      // Tambahkan gambar ke FormData
      if (gambarFiles.length > 0) {
        gambarFiles.forEach((file, index) => {
          formData.append(`gambar[${index}]`, file);
        });

        // Tambahkan indeks gambar utama jika dipilih
        if (gambarMain >= 0) {
          formData.append("gambar_utama", gambarMain.toString());
        }
      }

      // Tambahkan ID gambar yang dihapus (untuk edit)
      if (dtEdit && hapusGambar.length > 0) {
        hapusGambar.forEach((id) => {
          formData.append("hapus_gambar[]", id.toString());
        });
      }

      // Tambahkan ID gambar utama yang sudah ada (untuk edit)
      if (dtEdit && gambarMain === -2) {
        const mainImageId = watch("gambar_utama_id");
        if (mainImageId) {
          formData.append("gambar_utama_id", mainImageId.toString());
        }
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

  const handleAddImage = (files: File[]) => {
    setGambarFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveNewImage = (index: number) => {
    setGambarFiles((prev) => prev.filter((_, i) => i !== index));

    if (index === gambarMain) {
      setGambarMain(-1);
    } else if (index < gambarMain) {
      setGambarMain((prev) => prev - 1);
    }
  };

  const handleRemoveExistingImage = (id: number | string) => {
    setHapusGambar((prev) => [...prev, id]);

    if (id === watch("gambar_utama_id")) {
      setValue("gambar_utama_id", "");
    }
  };

  const handleSetMainImage = (index: number) => {
    setGambarMain(index);
  };

  const handleSetExistingMainImage = (id: number | string) => {
    setValue("gambar_utama_id", id.toString());
    setGambarMain(-2);
  };

  return (
    <ModalDef id="add_fasilitas" title={`Form ${halaman}`} size="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText name="id" register={register} type="hidden" />
        <InputText name="gambar_utama_id" register={register} type="hidden" />

        <div className="grid grid-cols-12 gap-3 mb-4">
          <BodyForm
            register={register}
            errors={errors}
            dtEdit={dtEdit}
            control={control}
            watch={watch}
            setValue={setValue}
            handleAddImage={handleAddImage}
            handleRemoveNewImage={handleRemoveNewImage}
            handleRemoveExistingImage={handleRemoveExistingImage}
            handleSetMainImage={handleSetMainImage}
            handleSetExistingMainImage={handleSetExistingMainImage}
            gambarFiles={gambarFiles}
            gambarMain={gambarMain}
            hapusGambar={hapusGambar}
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
