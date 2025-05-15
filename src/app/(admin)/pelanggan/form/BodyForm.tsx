/** @format */

// app/pelanggan/form/BodyForm.tsx
import InputText from "@/components/input/InputText";
import { PelangganType } from "@/types";
import { FC, useRef } from "react";
import { FieldErrors } from "react-hook-form";
import Image from "next/image";

type Props = {
  register: any;
  errors: FieldErrors<
    PelangganType & {
      email?: string;
      password?: string;
      password_confirmation?: string;
    }
  >;
  dtEdit: PelangganType | null;
  control: any;
  watch: any;
  setValue: any;
  previewImage: string | null;
  setPreviewImage: (url: string | null) => void;
};

const BodyForm: FC<Props> = ({
  register,
  errors,
  dtEdit,
  watch,
  previewImage,
  setPreviewImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const password = watch("password");

  // Handler untuk preview foto
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Informasi Dasar Pelanggan */}
      <div className="col-span-12 md:col-span-6 space-y-4">
        <h3 className="text-lg font-semibold">Informasi Pelanggan</h3>

        {/* Nama Pelanggan */}
        <InputText
          label="Nama Pelanggan"
          name="nm_pelanggan"
          register={register}
          required
          errors={errors.nm_pelanggan}
          placeholder="Masukkan nama lengkap pelanggan"
        />

        {/* No HP */}
        <InputText
          label="Nomor HP"
          name="no_hp"
          register={register}
          required
          errors={errors.no_hp}
          placeholder="Contoh: 081234567890"
        />

        {/* Alamat */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">
              Alamat <span className="text-error">*</span>
            </span>
          </label>
          <textarea
            {...register("alamat", {
              required: "Alamat harus diisi",
            })}
            className={`textarea textarea-bordered h-24 ${
              errors.alamat ? "textarea-error" : ""
            }`}
            placeholder="Masukkan alamat lengkap"
          ></textarea>
          {errors.alamat && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.alamat.message}
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Informasi Akun & Foto */}
      <div className="col-span-12 md:col-span-6 space-y-4">
        <h3 className="text-lg font-semibold">Informasi Akun</h3>

        {/* Email */}
        <InputText
          label="Email"
          name="email"
          register={register}
          required={!dtEdit}
          errors={errors.email}
          type="email"
          placeholder="contoh@email.com"
        />

        {/* Password */}
        <InputText
          label={
            dtEdit ? "Password Baru (Kosongkan jika tidak diubah)" : "Password"
          }
          name="password"
          register={register}
          required={!dtEdit}
          errors={errors.password}
          type="password"
          placeholder={
            dtEdit ? "Kosongkan jika tidak diubah" : "Masukkan password"
          }
        />

        {/* Password Confirmation */}
        <InputText
          label="Konfirmasi Password"
          name="password_confirmation"
          register={register}
          required={!!password}
          errors={errors.password_confirmation}
          type="password"
          placeholder="Konfirmasi password"
        />

        {/* Foto Pelanggan */}
        <div className="form-control w-full mt-4">
          <label className="label">
            <span className="label-text">Foto Pelanggan</span>
          </label>

          <div className="flex flex-col items-center">
            {/* Preview Image */}
            <div className="mb-3">
              {previewImage ? (
                <div className="relative h-40 w-40 rounded-lg overflow-hidden">
                  <Image
                    src={previewImage}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 w-40 rounded-lg bg-base-200 flex items-center justify-center">
                  <span className="text-base-content opacity-70">
                    Tidak ada foto
                  </span>
                </div>
              )}
            </div>

            {/* File Input */}
            <input
              type="file"
              id="foto_pelanggan"
              className="file-input file-input-bordered w-full"
              onChange={handleImageChange}
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/jpg"
            />
            <label className="label">
              <span className="label-text-alt">
                Format: JPG, JPEG, atau PNG. Maks: 2MB
              </span>
            </label>
            {errors.foto_pelanggan && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.foto_pelanggan.message}
                </span>
              </label>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BodyForm;
