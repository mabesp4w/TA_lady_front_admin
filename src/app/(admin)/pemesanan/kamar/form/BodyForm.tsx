/** @format */

// app/pemesanan-kamar/form/BodyForm.tsx
import InputTextarea from "@/components/input/InputTextarea";
import SelectFromDb from "@/components/select/SelectFromDB";
import useKamar from "@/stores/crud/Kamar";
import { PemesananKamarType } from "@/types";
import { FC, useEffect, useState } from "react";
import { FieldErrors } from "react-hook-form";

type Props = {
  register: any;
  errors: FieldErrors<PemesananKamarType>;
  dtEdit: PemesananKamarType | null;
  control: any;
  watch: any;
  setValue: any;
};

const BodyForm: FC<Props> = ({ register, errors, control, setValue }) => {
  // store
  const { getAvailableRooms } = useKamar();
  // state
  const [isLoading, setIsLoading] = useState(true);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");

  // Cek ketersediaan kamar saat tanggal check-in/out berubah
  useEffect(() => {
    const checkAvailability = async () => {
      if (checkIn && checkOut) {
        setIsLoading(true);
        try {
          const response = await getAvailableRooms({
            check_in: checkIn,
            check_out: checkOut,
          });

          if (response.status === "berhasil" && response.data) {
            setAvailableRooms(response.data);
          }
        } catch (error) {
          console.error("Error checking availability:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkAvailability();
  }, [checkIn, checkOut, getAvailableRooms]);

  // Handler untuk tanggal check-in
  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("tanggal_check_in", value);
    setCheckIn(value);

    // Pastikan check-out setelah check-in
    const checkInDate = new Date(value);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      // Atur check-out ke hari setelah check-in
      const nextDay = new Date(checkInDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayStr = nextDay.toISOString().split("T")[0];
      setValue("tanggal_check_out", nextDayStr);
      setCheckOut(nextDayStr);
    }
  };

  // Handler untuk tanggal check-out
  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("tanggal_check_out", value);
    setCheckOut(value);
  };

  return (
    <>
      <div className="col-span-12 md:col-span-6">
        <label className="label">
          <span className="label-text">Tanggal Check-in</span>
          <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          {...register("tanggal_check_in", { required: true })}
          className="input input-bordered w-full"
          onChange={handleCheckInChange}
          min={new Date().toISOString().split("T")[0]}
        />
        {errors.tanggal_check_in && (
          <p className="text-red-500 text-xs mt-1">
            Tanggal check-in harus diisi
          </p>
        )}
      </div>

      <div className="col-span-12 md:col-span-6">
        <label className="label">
          <span className="label-text">Tanggal Check-out</span>
          <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          {...register("tanggal_check_out", { required: true })}
          className="input input-bordered w-full"
          onChange={handleCheckOutChange}
          min={
            checkIn
              ? new Date(new Date(checkIn).getTime() + 86400000)
                  .toISOString()
                  .split("T")[0]
              : new Date().toISOString().split("T")[0]
          }
        />
        {errors.tanggal_check_out && (
          <p className="text-red-500 text-xs mt-1">
            Tanggal check-out harus diisi
          </p>
        )}
      </div>

      {checkIn && checkOut && (
        <div className="col-span-12">
          {isLoading ? (
            <div className="text-center py-4">
              <span className="loading loading-spinner loading-md"></span>
              <p>Memeriksa ketersediaan kamar...</p>
            </div>
          ) : availableRooms.length > 0 ? (
            <SelectFromDb
              label="Pilih Kamar"
              name="kamar_id"
              required={true}
              dataDb={availableRooms}
              body={[
                "id",
                "no_kamar",
                "jenis_kamar.nm_jenis_kamar",
                "jenis_kamar.harga_per_malam",
              ]}
              addClass="col-span-12"
              control={control}
              errors={errors.kamar_id}
              menuPosition="absolute"
              placeholder="Pilih kamar yang tersedia"
            />
          ) : (
            <div className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>
                Tidak ada kamar yang tersedia untuk tanggal yang dipilih.
              </span>
            </div>
          )}
        </div>
      )}

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
