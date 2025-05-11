/** @format */

// app/kamar/form/BodyForm.tsx
import InputText from "@/components/input/InputText";
import { KamarType, GambarKamarType } from "@/types";
import { FC, useEffect, useState } from "react";
import { FieldErrors } from "react-hook-form";
import Image from "next/image";
import { BASE_URL } from "@/services/baseURL";
import SelectDef from "@/components/select/SelectDef";
import useJenisKamarApi from "@/stores/api/JenisKamar";
import SelectFromDb from "@/components/select/SelectFromDB";

type Props = {
  register: any;
  errors: FieldErrors<KamarType>;
  dtEdit: KamarType | null;
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
  control,
}) => {
  // Membuat URL untuk preview gambar yang dipilih
  const createPreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  // store
  const { dtJenisKamar, setJenisKamar } = useJenisKamarApi();
  // state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setJenisKamar({});
    setIsLoading(false);
  }, [setJenisKamar]);

  console.log(dtJenisKamar);

  // Opsi untuk lantai
  const lantaiOptions = [
    { value: "Lantai 1", label: "Lantai 1" },
    { value: "Lantai 2", label: "Lantai 2" },
    { value: "Lantai 3", label: "Lantai 3" },
    { value: "Lantai 4", label: "Lantai 4" },
    { value: "Lantai 5", label: "Lantai 5" },
  ];

  // Nilai tersedia dari watch
  const tersedia = watch("tersedia");

  return (
    <>
      {!isLoading && dtJenisKamar.length > 0 && (
        <SelectFromDb
          label="Jenis Kamar"
          name="jenis_kamar_id"
          required={true}
          dataDb={dtJenisKamar}
          body={["id", "nm_jenis_kamar"]}
          addClass="col-span-6"
          control={control}
          errors={errors.jenis_kamar_id}
          menuPosition="absolute"
        />
      )}
      <InputText
        label="Nomor Kamar"
        name="no_kamar"
        register={register}
        addClass="col-span-6"
        required
        errors={errors.no_kamar}
      />

      <SelectDef
        label="Lantai"
        name="lantai"
        required={true}
        options={lantaiOptions}
        addClass="col-span-6"
        control={control}
        errors={errors.lantai}
        menuPosition="absolute"
      />

      <div className="col-span-6 flex items-end mb-2">
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text mr-2">Tersedia untuk pemesanan</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              {...register("tersedia")}
              checked={tersedia}
            />
          </label>
        </div>
      </div>

      <div className="col-span-12 flex flex-col">
        <label className="label">
          <span className="label-text">Catatan</span>
        </label>
        <textarea
          {...register("catatan")}
          className="textarea textarea-bordered h-24"
          placeholder="Catatan tambahan untuk kamar ini"
        ></textarea>
      </div>

      {/* Upload Gambar */}
      <div className="col-span-12 mt-4">
        <div className="flex flex-col">
          <label className="label">
            <span className="label-text text-base font-medium">
              Gambar Kamar
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
            Unggah satu atau beberapa gambar kamar. Klik gambar untuk
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
        {dtEdit && dtEdit.gambar_kamar && dtEdit.gambar_kamar.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium text-sm mb-2">Gambar Saat Ini:</h3>
            <div className="flex flex-wrap gap-2">
              {dtEdit.gambar_kamar
                .filter(
                  (img) => !hapusGambar.includes(img.id as string | number)
                )
                .map((img: GambarKamarType) => {
                  return (
                    <div
                      key={`existing-${img.id}`}
                      className={`relative border rounded-md overflow-hidden ${
                        img.gambar_utama || watch("gambar_utama_id") === img.id
                          ? "ring-2 ring-primary"
                          : ""
                      }`}
                    >
                      <div
                        className="w-24 h-24 cursor-pointer"
                        onClick={() =>
                          handleSetExistingMainImage(img.id as string | number)
                        }
                      >
                        <Image
                          src={
                            img.jalur_gambar.startsWith("/")
                              ? img.jalur_gambar
                              : `${BASE_URL}/${img.jalur_gambar}`
                          }
                          alt={`Kamar Image ${img.id}`}
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

        {/* Tampilkan pesan jika tidak ada gambar */}
        {dtEdit &&
          (!dtEdit.gambar_kamar || dtEdit.gambar_kamar.length === 0) && (
            <div className="mt-4 p-2 bg-gray-100 rounded-md">
              <p className="text-sm text-gray-600">
                Tidak ada gambar tersedia untuk kamar ini.
              </p>
            </div>
          )}
      </div>
    </>
  );
};

export default BodyForm;
