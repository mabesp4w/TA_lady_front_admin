/** @format */

// app/fasilitas/form/BodyForm.tsx
/** @format */

import InputText from "@/components/input/InputText";
import { FasilitasType, GambarFasilitasType } from "@/types";
import { FC } from "react";
import { FieldErrors } from "react-hook-form";
import Image from "next/image";
import { url_storage } from "@/services/baseURL";

type Props = {
  register: any;
  errors: FieldErrors<FasilitasType>;
  dtEdit: FasilitasType | null;
  control: any;
  watch: any;
  setValue: any;
  handleAddImage: (files: File[]) => void;
  handleRemoveNewImage: (index: number) => void;
  handleRemoveExistingImage: (id: number | string) => void;
  handleSetMainImage: (index: number) => void;
  handleSetExistingMainImage: (id: number | string) => void;
  gambarFiles: File[];
  gambarMain: number;
  hapusGambar: (string | number)[];
};

const BodyForm: FC<Props> = ({
  register,
  errors,
  dtEdit,
  watch,
  handleAddImage,
  handleRemoveNewImage,
  handleRemoveExistingImage,
  handleSetMainImage,
  handleSetExistingMainImage,
  gambarFiles,
  gambarMain,
  hapusGambar,
}) => {
  // Membuat URL untuk preview gambar yang dipilih
  const createPreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  // Nilai tersedia dari watch
  const tersedia = watch("tersedia");

  return (
    <>
      <InputText
        label={`Nama Fasilitas`}
        name="nm_fasilitas"
        register={register}
        addClass="col-span-12"
        required
        errors={errors.nm_fasilitas}
      />

      <div className="col-span-12 flex flex-col">
        <label className="label">
          <span className="label-text">Deskripsi</span>
        </label>
        <textarea
          {...register("deskripsi")}
          className="textarea textarea-bordered h-24"
          placeholder="Deskripsi fasilitas"
        ></textarea>
      </div>

      <InputText
        label={`Harga`}
        name="harga"
        register={register}
        addClass="col-span-4"
        required
        type="currency"
        errors={errors.harga}
      />

      <InputText
        label={`Jam Buka`}
        name="jam_buka"
        register={register}
        addClass="col-span-4"
        required
        type="time"
        errors={errors.jam_buka}
      />

      <InputText
        label={`Jam Tutup`}
        name="jam_tutup"
        register={register}
        addClass="col-span-4"
        required
        type="time"
        errors={errors.jam_tutup}
      />

      <InputText
        label={`Kapasitas`}
        name="kapasitas"
        register={register}
        addClass="col-span-4"
        type="number"
        errors={errors.kapasitas}
        placeholder="Jumlah orang"
      />

      <div className="col-span-4 flex items-end mb-2">
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text mr-2">Tersedia untuk pemesanan</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              {...register("tersedia")}
              checked={tersedia} // Menggunakan nilai dari watch
            />
          </label>
        </div>
      </div>

      {/* Upload Gambar */}
      <div className="col-span-12 mt-4">
        <div className="flex flex-col">
          <label className="label">
            <span className="label-text text-base font-medium">
              Gambar Fasilitas
            </span>
          </label>

          <input
            type="file"
            className="file-input file-input-bordered w-full"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleAddImage(Array.from(e.target.files));
              }
            }}
          />

          <p className="text-xs text-gray-500 mt-1">
            Unggah satu atau beberapa gambar fasilitas. Klik gambar untuk
            menjadikannya sebagai gambar utama.
          </p>
        </div>

        {/* Preview Gambar Baru */}
        {gambarFiles.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium text-sm mb-2">
              Gambar Yang Akan Diunggah:
            </h3>
            <div className="flex flex-wrap gap-2">
              {gambarFiles.map((file, index) => (
                <div
                  key={`new-${index}`}
                  className={`relative border rounded-md overflow-hidden ${
                    gambarMain === index ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div
                    className="w-24 h-24 cursor-pointer"
                    onClick={() => handleSetMainImage(index)}
                  >
                    <Image
                      src={createPreviewUrl(file)}
                      alt={`Preview ${index}`}
                      className="object-cover"
                      fill
                    />
                  </div>
                  {gambarMain === index && (
                    <div className="absolute top-1 right-1 bg-primary text-xs text-white p-1 rounded-md">
                      Utama
                    </div>
                  )}
                  <button
                    type="button"
                    className="absolute bottom-1 right-1 bg-red-500 text-white rounded-full p-1"
                    onClick={() => handleRemoveNewImage(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gambar yang Sudah Ada (untuk Edit) */}
        {dtEdit &&
          dtEdit.gambar_fasilitas &&
          dtEdit.gambar_fasilitas.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-sm mb-2">Gambar Saat Ini:</h3>
              <div className="flex flex-wrap gap-2">
                {dtEdit.gambar_fasilitas
                  .filter(
                    (img) => !hapusGambar.includes(img.id as string | number)
                  )
                  .map((img: GambarFasilitasType) => {
                    return (
                      <div
                        key={`existing-${img.id}`}
                        className={`relative border rounded-md overflow-hidden ${
                          img.gambar_utama ||
                          watch("gambar_utama_id") === img.id
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                      >
                        <div
                          className="w-24 h-24 cursor-pointer"
                          onClick={() =>
                            handleSetExistingMainImage(
                              img.id as string | number
                            )
                          }
                        >
                          {/* Perbaiki path gambar - coba tanpa / di depan */}
                          <Image
                            src={
                              img.jalur_gambar.startsWith("/")
                                ? img.jalur_gambar
                                : `${url_storage}/${img.jalur_gambar}`
                            }
                            alt={`Fasilitas Image ${img.id}`}
                            className="object-cover"
                            fill
                          />
                        </div>
                        {(img.gambar_utama ||
                          watch("gambar_utama_id") === img.id) && (
                          <div className="absolute top-1 right-1 bg-primary text-xs text-white p-1 rounded-md">
                            Utama
                          </div>
                        )}
                        <button
                          type="button"
                          className="absolute bottom-1 right-1 bg-red-500 text-white rounded-full p-1"
                          onClick={() =>
                            handleRemoveExistingImage(img.id as string | number)
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

        {/* Tambahkan debugging jika tidak ada gambar */}
        {dtEdit &&
          (!dtEdit.gambar_fasilitas ||
            dtEdit.gambar_fasilitas.length === 0) && (
            <div className="mt-4 p-2 bg-gray-100 rounded-md">
              <p className="text-sm text-gray-600">
                Tidak ada gambar tersedia untuk fasilitas ini.
              </p>
            </div>
          )}
      </div>
    </>
  );
};

export default BodyForm;
