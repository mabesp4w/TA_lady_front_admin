/** @format */

// app/pembayaran/form/Form.tsx
"use client";
import toastShow from "@/utils/toast-show";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ModalDef from "@/components/modal/ModalDef";
import usePembayaran from "@/stores/crud/Pembayaran";
import { PembayaranType } from "@/types";
import InputText from "@/components/input/InputText";
import { closeModal } from "@/utils/modalHelper";
import BodyForm from "./BodyForm";

type Props = {
  dtEdit: PembayaranType | null;
  halaman: string;
};

const Form = ({ dtEdit, halaman }: Props) => {
  // store
  const { addData, updateData } = usePembayaran();

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
    getValues,
  } = useForm<PembayaranType>({
    defaultValues: {
      id: "",
      jenis_pembayaran: "pesanan",
      metode_pembayaran: "cash",
      status: "menunggu",
      pesanan_id: "",
      payable_type: "",
      payable_id: "",
      jumlah: 0,
    },
  });

  // reset form
  const resetForm = () => {
    reset({
      id: "",
      jenis_pembayaran: "pesanan",
      metode_pembayaran: "cash",
      status: "menunggu",
      pesanan_id: "",
      payable_type: "",
      payable_id: "",
      jumlah: 0,
    });
    closeModal("add_pembayaran");
  };

  // data edit
  useEffect(() => {
    if (dtEdit) {
      setValue("id", dtEdit.id || "");
      setValue("jenis_pembayaran", dtEdit.jenis_pembayaran || "pesanan");
      setValue("metode_pembayaran", dtEdit.metode_pembayaran || "cash");
      setValue("status", dtEdit.status || "menunggu");
      setValue("pesanan_id", dtEdit.pesanan_id || "");
      setValue("payable_type", dtEdit.payable_type || "");
      setValue("payable_id", dtEdit.payable_id || "");
      setValue("jumlah", dtEdit.jumlah || 0);
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dtEdit]);

  // simpan data
  const onSubmit: SubmitHandler<PembayaranType> = async (data) => {
    setIsLoading(true);

    try {
      // Transform data as needed
      const formattedData: any = {
        jenis_pembayaran: data.jenis_pembayaran,
        metode_pembayaran: data.metode_pembayaran,
        jumlah: data.jumlah,
      };

      // Add specific fields based on payment type
      if (data.jenis_pembayaran === "pesanan") {
        formattedData.pesanan_id = data.pesanan_id;
      } else {
        // For pemesanan_kamar or pemesanan_fasilitas
        formattedData.payable_type = data.payable_type;
        formattedData.payable_id = data.payable_id;
      }

      let response;

      // Process add or update
      if (dtEdit) {
        const dtUpdate = {
          status: data.status,
        };
        response = await updateData(dtEdit.id as string, dtUpdate);
      } else {
        response = await addData(formattedData);
      }

      // Show success or error message
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
    <ModalDef id="add_pembayaran" title={`Form ${halaman}`} size="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText name="id" register={register} type="hidden" />

        <div className="grid grid-cols-12 gap-3 mb-4">
          <BodyForm
            register={register}
            errors={errors}
            control={control}
            watch={watch}
            setValue={setValue}
            getValues={getValues}
            isEdit={!!dtEdit}
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
