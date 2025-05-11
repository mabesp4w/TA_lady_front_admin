/** @format */

// app/produk/form/BodyForm.tsx
import InputText from "@/components/input/InputText";
import { ProdukType } from "@/types";
import { FC, useEffect, useState } from "react";
import { FieldErrors } from "react-hook-form";
import Image from "next/image";
import { BASE_URL } from "@/services/baseURL";
import SelectFromDb from "@/components/select/SelectFromDB";
import useKategoriProdukApi from "@/stores/api/KategoriProduk";

type Props = {
  register: any;
  errors: FieldErrors<ProdukType>;
  dtEdit: ProdukType | null;
  control: any;
  watch: any;
  setValue: any;
  handleAddImage: (file: File) => void;
  handleRemoveImage: () => void;
  gambarFile: File | null;
};

const BodyForm: FC<Props> = ({
  register,
  errors,
  dtEdit,
  watch,
  handleAddImage,
  handleRemoveImage,
  gambarFile,
  control,
}) => {
  // Membuat URL untuk preview gambar yang dipilih
  const createPreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  // store
  const { dtKategoriProduk, setKategoriProduk } = useKategoriProdukApi();
  // state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setKategoriProduk({});
    setIsLoading(false);
  }, [setKategoriProduk]);

  // Nilai tersedia dari watch
  const tersedia = watch("tersedia");

  return (
    <>
      {!isLoading && dtKategoriProduk.length > 0 && (
        <SelectFromDb
          label="Kategori Produk"
          name="kategori_produk_id"
          required={true}
          dataDb={dtKategoriProduk}
          body={["id", "nm_kategori_produk"]}
          addClass="col-span-12 md:col-span-6"
          control={control}
          errors={errors.kategori_produk_id}
          menuPosition="absolute"
        />
      )}
      <InputText
        label="Nama Produk"
        name="nm_produk"
        register={register}
        addClass="col-span-12 md:col-span-6"
        required
        errors={errors.nm_produk}
      />

      <InputText
        label="Harga"
        name="harga"
        register={register}
        addClass="col-span-12 md:col-span-6"
        required
        errors={errors.harga}
        type="currency"
      />

      <InputText
        label="Jumlah Stok"
        name="jumlah_stok"
        register={register}
        addClass="col-span-12 md:col-span-6"
        required
        errors={errors.jumlah_stok}
        type="number"
      />

      <div className="col-span-12 md:col-span-6 flex items-end mb-2">
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text mr-2">Tersedia untuk pembelian</span>
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
          <span className="label-text">Deskripsi</span>
        </label>
        <textarea
          {...register("deskripsi")}
          className="textarea textarea-bordered h-24"
          placeholder="Deskripsi produk"
        ></textarea>
      </div>

      {/* Upload Gambar */}
      <div className="col-span-12 mt-4">
        <div className="flex flex-col">
          <label className="label">
            <span className="label-text text-base font-medium">
              Gambar Produk
            </span>
          </label>

          <input
            type="file"
            className="file-input file-input-bordered w-full"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleAddImage(e.target.files[0]);
              }
            }}
          />

          <p className="text-xs text-gray-500 mt-1">
            Unggah gambar produk. Format yang didukung: JPG, PNG.
          </p>
        </div>

        {/* Preview Gambar Baru */}
        {gambarFile && (
          <div className="mt-4">
            <h3 className="font-medium text-sm mb-2">
              Gambar Yang Akan Diunggah:
            </h3>
            <div className="relative inline-block">
              <div className="w-32 h-32 border rounded-md overflow-hidden">
                <Image
                  src={createPreviewUrl(gambarFile)}
                  alt="Preview gambar"
                  className="object-cover"
                  fill
                />
              </div>
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                onClick={handleRemoveImage}
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
          </div>
        )}

        {/* Gambar yang Sudah Ada (untuk Edit) */}
        {dtEdit && dtEdit.jalur_gambar && !gambarFile && (
          <div className="mt-4">
            <h3 className="font-medium text-sm mb-2">Gambar Saat Ini:</h3>
            <div className="relative inline-block">
              <div className="w-32 h-32 border rounded-md overflow-hidden">
                <Image
                  src={`${BASE_URL}/${dtEdit.jalur_gambar}`}
                  alt="Gambar saat ini"
                  className="object-cover"
                  fill
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BodyForm;
