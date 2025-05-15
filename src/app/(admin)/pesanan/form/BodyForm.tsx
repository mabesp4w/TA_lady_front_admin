/** @format */

// app/pesanan/form/BodyForm.tsx
import SelectDef from "@/components/select/SelectDef";
import { PesananType, ProdukType } from "@/types";
import { FC } from "react";
import { FieldErrors } from "react-hook-form";
import { formatRupiah } from "@/utils/formatRupiah";
import Image from "next/image";
import { BASE_URL } from "@/services/baseURL";
import InputTextarea from "@/components/input/InputTextarea";

type Props = {
  register: any;
  errors: FieldErrors<PesananType>;
  control: any;
  watch: any;
  fields: Record<"id", string>[];
  products: ProdukType[];
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItemPrice: (index: number, produk_id: string) => void;
  updateItemSubtotal: (index: number, jumlah: number) => void;
};

const BodyForm: FC<Props> = ({
  register,
  errors,
  control,
  watch,
  fields,
  products,
  addItem,
  removeItem,
  updateItemPrice,
  updateItemSubtotal,
}) => {
  // Opsi untuk jenis pesanan
  const jenisPesananOptions = [
    { value: "offline", label: "Offline (di tempat)" },
    { value: "online", label: "Online (pengiriman)" },
  ];

  // Mengubah produk menjadi opsi untuk select
  const productOptions = products.map((product) => ({
    value: product.id,
    label: product.nm_produk,
  }));

  // Total pesanan
  const total = watch("total_jumlah");
  const itemsValue = watch("item_pesanan");

  return (
    <>
      {/* Jenis Pesanan */}
      <div className="col-span-12 mb-4">
        <SelectDef
          label="Jenis Pesanan"
          name="jenis_pesanan"
          required={true}
          options={jenisPesananOptions}
          addClass="w-full"
          control={control}
          errors={errors.jenis_pesanan}
          menuPosition="absolute"
        />
      </div>

      {/* Catatan */}
      <div className="col-span-12 mb-4">
        <InputTextarea
          label="Catatan Pesanan"
          name="catatan"
          register={register}
          errors={errors.catatan}
          addClass="w-full"
          rows={2}
          placeholder="Tambahkan catatan untuk pesanan ini (opsional)"
        />
      </div>

      {/* Item Pesanan */}
      <div className="col-span-12">
        <div className="border rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Item Pesanan</h3>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-2 mb-4 pb-4 border-b border-dashed"
            >
              {/* Produk */}
              <div className="col-span-12 md:col-span-5">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">
                      Produk <span className="text-error">*</span>
                    </span>
                  </label>

                  <select
                    className={`select select-bordered w-full ${
                      errors.item_pesanan?.[index]?.produk_id
                        ? "select-error"
                        : ""
                    }`}
                    {...register(`item_pesanan.${index}.produk_id`, {
                      required: "Produk harus dipilih",
                    })}
                    onChange={(e) => {
                      register(`item_pesanan.${index}.produk_id`).onChange(e);
                      updateItemPrice(index, e.target.value);
                    }}
                  >
                    <option value="">Pilih Produk</option>
                    {productOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {errors.item_pesanan?.[index]?.produk_id && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.item_pesanan[index]?.produk_id?.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Preview Produk */}
              <div className="col-span-3 md:col-span-2">
                {itemsValue?.[index]?.produk_id && (
                  <div className="mt-8 flex items-center justify-center">
                    {products.find((p) => p.id === itemsValue[index].produk_id)
                      ?.jalur_gambar ? (
                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                          src={`${BASE_URL}/${
                            products.find(
                              (p) => p.id === itemsValue[index].produk_id
                            )?.jalur_gambar
                          }`}
                          alt="Product"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-base-300 rounded-md flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Jumlah */}
              <div className="col-span-5 md:col-span-2">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">
                      Jumlah <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className={`input input-bordered w-full ${
                      errors.item_pesanan?.[index]?.jumlah ? "input-error" : ""
                    }`}
                    {...register(`item_pesanan.${index}.jumlah`, {
                      required: "Jumlah harus diisi",
                      min: {
                        value: 1,
                        message: "Minimal 1",
                      },
                      valueAsNumber: true,
                    })}
                    onChange={(e) => {
                      register(`item_pesanan.${index}.jumlah`).onChange(e);
                      updateItemSubtotal(index, parseInt(e.target.value) || 0);
                    }}
                  />
                  {errors.item_pesanan?.[index]?.jumlah && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.item_pesanan[index]?.jumlah?.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Harga */}
              <div className="col-span-4 md:col-span-2">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Harga</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full bg-base-200"
                    value={formatRupiah(itemsValue?.[index]?.harga_satuan || 0)}
                    readOnly
                  />
                  <input
                    type="hidden"
                    {...register(`item_pesanan.${index}.harga_satuan`)}
                  />
                  <input
                    type="hidden"
                    {...register(`item_pesanan.${index}.subtotal`)}
                  />
                </div>
              </div>

              {/* Action (Delete) */}
              <div className="col-span-3 md:col-span-1 flex items-end justify-center mb-1">
                <button
                  type="button"
                  className="btn btn-error btn-sm"
                  onClick={() => removeItem(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
          ))}

          {/* Tombol Tambah Item */}
          <div className="flex justify-center">
            <button
              type="button"
              className="btn btn-outline btn-primary"
              onClick={addItem}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tambah Item
            </button>
          </div>
        </div>
      </div>

      {/* Total Pesanan */}
      <div className="col-span-12">
        <div className="flex justify-end items-center p-4 bg-base-200 rounded-lg">
          <div className="text-lg font-bold mr-4">Total:</div>
          <div className="text-xl font-bold text-primary">
            {formatRupiah(total)}
          </div>
        </div>
      </div>
    </>
  );
};

export default BodyForm;
