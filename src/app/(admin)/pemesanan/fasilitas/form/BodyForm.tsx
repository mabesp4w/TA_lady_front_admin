/** @format */

// app/pemesanan-fasilitas/form/BodyForm.tsx
import SelectFromDb from "@/components/select/SelectFromDB";
import { PemesananFasilitasType } from "@/types";
import { FC, useEffect, useState } from "react";
import { FieldErrors } from "react-hook-form";
import InputTextarea from "@/components/input/InputTextarea";
import useFasilitasApi from "@/stores/api/Fasilitas";
import InputText from "@/components/input/InputText";

type Props = {
  register: any;
  errors: FieldErrors<PemesananFasilitasType>;
  control: any;
  watch: any;
  setValue: any;
};

const BodyForm: FC<Props> = ({
  register,
  errors,
  control,
  watch,
  setValue,
}) => {
  // store
  const { dtFasilitas } = useFasilitasApi();
  // state
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFasilitas, setSelectedFasilitas] = useState<any>(null);

  // Watch form values
  const fasilitas_id = watch("fasilitas_id");
  const waktu_mulai = watch("waktu_mulai");
  const jumlah_orang = watch("jumlah_orang");

  // Mengambil detail fasilitas yang dipilih
  useEffect(() => {
    if (fasilitas_id && dtFasilitas) {
      const selected = dtFasilitas.find(
        (item: any) => item.id === fasilitas_id
      );
      setSelectedFasilitas(selected);

      // Reset waktu jika fasilitas berubah
      if (selected) {
        setValue("waktu_mulai", selected.jam_buka);
        setValue("waktu_selesai", selected.jam_tutup);
      }
    } else {
      setSelectedFasilitas(null);
    }
    setIsLoading(false);
  }, [fasilitas_id, dtFasilitas, setValue]);

  // Fungsi validasi jumlah orang
  const validateJumlahOrang = () => {
    if (!selectedFasilitas) return true;

    if (
      selectedFasilitas.kapasitas &&
      jumlah_orang > selectedFasilitas.kapasitas
    ) {
      return `Maksimal ${selectedFasilitas.kapasitas} orang`;
    }

    return true;
  };

  // Validation rules
  const validationRules = {
    fasilitas_id: {
      required: "Fasilitas harus dipilih",
    },
    tanggal_pemesanan: {
      required: "Tanggal pemesanan harus dipilih",
    },
    waktu_mulai: {
      required: "Waktu mulai harus dipilih",
      validate: {
        validTime: (value: string) => {
          if (!selectedFasilitas) return true;
          if (value < selectedFasilitas.jam_buka) {
            return `Waktu mulai minimal ${selectedFasilitas.jam_buka}`;
          }
          if (value > selectedFasilitas.jam_tutup) {
            return `Waktu mulai maksimal ${selectedFasilitas.jam_tutup}`;
          }
          return true;
        },
      },
    },
    waktu_selesai: {
      required: "Waktu selesai harus dipilih",
      validate: {
        afterStart: (value: string) =>
          value > waktu_mulai || "Waktu selesai harus setelah waktu mulai",
        validTime: (value: string) => {
          if (!selectedFasilitas) return true;
          if (value > selectedFasilitas.jam_tutup) {
            return `Waktu selesai maksimal ${selectedFasilitas.jam_tutup}`;
          }
          return true;
        },
      },
    },
    jumlah_orang: {
      required: "Jumlah orang harus diisi",
      min: { value: 1, message: "Minimal 1 orang" },
      validate: validateJumlahOrang,
    },
  };

  return (
    <>
      <div className="col-span-12">
        {!isLoading && (
          <SelectFromDb
            label="Pilih Fasilitas"
            name="fasilitas_id"
            required={true}
            dataDb={dtFasilitas || []}
            body={["id", "nm_fasilitas"]}
            addClass="col-span-12"
            control={control}
            errors={errors.fasilitas_id}
            menuPosition="absolute"
            placeholder="Pilih fasilitas yang tersedia"
          />
        )}
      </div>

      {selectedFasilitas && (
        <div className="col-span-12 bg-gray-50 p-3 rounded-lg mb-2">
          <h3 className="font-medium mb-1">Detail Fasilitas</h3>
          <p className="text-sm">
            Kapasitas: {selectedFasilitas.kapasitas || "Tidak terbatas"} orang
          </p>
          <p className="text-sm">
            Jam Operasional: {selectedFasilitas.jam_buka} -{" "}
            {selectedFasilitas.jam_tutup}
          </p>
          <p className="text-sm">
            Harga per Jam:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(selectedFasilitas.harga)}
          </p>
        </div>
      )}

      <div className="col-span-12 md:col-span-6">
        <label className="label">
          <span className="label-text">Tanggal Pemesanan</span>
          <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          {...register("tanggal_pemesanan", validationRules.tanggal_pemesanan)}
          className="input input-bordered w-full"
          min={new Date().toISOString().split("T")[0]}
        />
        {errors.tanggal_pemesanan && (
          <p className="text-red-500 text-xs mt-1">
            {errors.tanggal_pemesanan.message}
          </p>
        )}
      </div>

      <div className="col-span-6 md:col-span-3">
        <label className="label">
          <span className="label-text">Waktu Mulai</span>
          <span className="text-red-500">*</span>
        </label>
        <input
          type="time"
          {...register("waktu_mulai", validationRules.waktu_mulai)}
          className="input input-bordered w-full"
          min={selectedFasilitas?.jam_buka}
          max={selectedFasilitas?.jam_tutup}
        />
        {errors.waktu_mulai && (
          <p className="text-red-500 text-xs mt-1">
            {errors.waktu_mulai.message}
          </p>
        )}
      </div>

      <div className="col-span-6 md:col-span-3">
        <label className="label">
          <span className="label-text">Waktu Selesai</span>
          <span className="text-red-500">*</span>
        </label>
        <input
          type="time"
          {...register("waktu_selesai", validationRules.waktu_selesai)}
          className="input input-bordered w-full"
          min={waktu_mulai}
          max={selectedFasilitas?.jam_tutup}
        />
        {errors.waktu_selesai && (
          <p className="text-red-500 text-xs mt-1">
            {errors.waktu_selesai.message}
          </p>
        )}
      </div>

      <div className="col-span-12 md:col-span-6">
        <InputText
          label="Jumlah Orang"
          name="jumlah_orang"
          register={register}
          required
          errors={errors.jumlah_orang}
          addClass="col-span-12"
          type="number"
        />
      </div>

      <div className="col-span-12">
        <InputTextarea
          label="Catatan"
          name="catatan"
          register={register}
          addClass="col-span-12"
          placeholder="Catatan tambahan untuk pemesanan ini (opsional)"
        />
      </div>
    </>
  );
};

export default BodyForm;
