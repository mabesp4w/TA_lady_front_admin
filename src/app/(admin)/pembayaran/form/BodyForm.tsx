/** @format */

// app/pembayaran/form/BodyForm.tsx
import SelectDef from "@/components/select/SelectDef";
import {
  PembayaranType,
  PemesananFasilitasType,
  PemesananKamarType,
  PesananType,
} from "@/types";
import { FC, useEffect, useState } from "react";
import { FieldErrors } from "react-hook-form";
import { formatRupiah } from "@/utils/formatRupiah";
import { crud } from "@/services/baseURL";

type Props = {
  register: any;
  errors: FieldErrors<PembayaranType>;
  control: any;
  watch: any;
  setValue: any;
  getValues: any;
  isEdit: boolean;
};

type ReferenceOption = {
  id: string;
  kode: string;
  total: number;
  name?: string;
  type?: string;
};

const BodyForm: FC<Props> = ({
  register,
  errors,
  control,
  watch,
  setValue,
  isEdit,
}) => {
  // State for reference options
  const [pesananOptions, setPesananOptions] = useState<ReferenceOption[]>([]);
  const [pemesananKamarOptions, setPemesananKamarOptions] = useState<
    ReferenceOption[]
  >([]);
  const [pemesananFasilitasOptions, setPemesananFasilitasOptions] = useState<
    ReferenceOption[]
  >([]);
  const [isLoadingReferences, setIsLoadingReferences] = useState(false);

  // Watch form fields
  const jenisPembayaran = watch("jenis_pembayaran");
  const pesananId = watch("pesanan_id");
  const payableId = watch("payable_id");
  const total = watch("jumlah");

  // Options for select fields
  const jenisPembayaranOptions = [
    { value: "pesanan", label: "Pesanan Produk" },
    { value: "pemesanan_kamar", label: "Pemesanan Kamar" },
    { value: "pemesanan_fasilitas", label: "Pemesanan Fasilitas" },
  ];

  const metodePembayaranOptions = [
    { value: "cash", label: "Tunai" },
    { value: "transfer", label: "Transfer Bank" },
    { value: "midtrans", label: "Midtrans" },
  ];

  const statusOptions = [
    { value: "menunggu", label: "Menunggu" },
    { value: "selesai", label: "Selesai" },
    { value: "gagal", label: "Gagal" },
    { value: "dikembalikan", label: "Dikembalikan" },
  ];

  // Load reference options when type changes
  useEffect(() => {
    if (isEdit) return; // Don't load if in edit mode

    const loadReferenceOptions = async () => {
      setIsLoadingReferences(true);
      try {
        if (jenisPembayaran === "pesanan") {
          // Load unpaid pesanan
          const response = await crud({
            method: "get",
            url: "/pesanan",
            params: {
              status_pembayaran: "belum_dibayar",
              limit: 100,
            },
          });

          if (response.data && response.data.data && response.data.data.data) {
            const pesanan = response.data.data.data.map(
              (item: PesananType) => ({
                id: item.id,
                kode: item.kode_pesanan,
                total: item.total_jumlah,
                name: item.user?.name || "Tidak ada nama",
              })
            );
            setPesananOptions(pesanan);
          }
        } else if (jenisPembayaran === "pemesanan_kamar") {
          // Load unpaid pemesanan kamar
          const response = await crud({
            method: "get",
            url: "/pemesanan-kamar",
            params: {
              status_pembayaran: "belum_dibayar",
              limit: 100,
            },
          });

          if (response.data && response.data.data && response.data.data.data) {
            const pemesananKamar = response.data.data.data.map(
              (item: PemesananKamarType) => ({
                id: item.id,
                kode: item.kode_pemesanan,
                total: item.total_harga,
                name: item.user?.name || "Tidak ada nama",
                type: `App\\Models\\PemesananKamar`,
              })
            );
            setPemesananKamarOptions(pemesananKamar);
          }
        } else if (jenisPembayaran === "pemesanan_fasilitas") {
          // Load unpaid pemesanan fasilitas
          const response = await crud({
            method: "get",
            url: "/pemesanan-fasilitas",
            params: {
              status_pembayaran: "belum_dibayar",
              limit: 100,
            },
          });

          if (response.data && response.data.data && response.data.data.data) {
            const pemesananFasilitas = response.data.data.data.map(
              (item: PemesananFasilitasType) => ({
                id: item.id,
                kode: item.kode_pemesanan,
                total: item.total_harga,
                name: item.user?.name || "Tidak ada nama",
                type: `App\\Models\\PemesananFasilitas`,
              })
            );
            setPemesananFasilitasOptions(pemesananFasilitas);
          }
        }
      } catch (error) {
        console.error("Error loading reference options:", error);
      } finally {
        setIsLoadingReferences(false);
      }
    };

    loadReferenceOptions();
  }, [jenisPembayaran, isEdit]);

  // Update jumlah when reference changes
  useEffect(() => {
    if (isEdit) return; // Don't update if in edit mode

    if (jenisPembayaran === "pesanan" && pesananId) {
      const selected = pesananOptions.find((opt) => opt.id === pesananId);
      if (selected) {
        setValue("jumlah", selected.total);
      }
    } else if (jenisPembayaran === "pemesanan_kamar" && payableId) {
      const selected = pemesananKamarOptions.find(
        (opt) => opt.id === payableId
      );
      if (selected) {
        setValue("jumlah", selected.total);
        setValue("payable_type", selected.type);
      }
    } else if (jenisPembayaran === "pemesanan_fasilitas" && payableId) {
      const selected = pemesananFasilitasOptions.find(
        (opt) => opt.id === payableId
      );
      if (selected) {
        setValue("jumlah", selected.total);
        setValue("payable_type", selected.type);
      }
    }
  }, [
    jenisPembayaran,
    pesananId,
    payableId,
    setValue,
    pesananOptions,
    pemesananKamarOptions,
    pemesananFasilitasOptions,
    isEdit,
  ]);

  return (
    <>
      {/* Jenis Pembayaran */}
      <div className="col-span-12 sm:col-span-6">
        <SelectDef
          addClass="col-span-8"
          label="Jenis Pembayaran"
          name="jenis_pembayaran"
          required={true}
          options={jenisPembayaranOptions}
          control={control}
          errors={errors.jenis_pembayaran}
          menuPosition="absolute"
        />
      </div>

      {/* Metode Pembayaran */}
      <div className="col-span-12 sm:col-span-6">
        <SelectDef
          addClass="col-span-8"
          label="Metode Pembayaran"
          name="metode_pembayaran"
          required={true}
          options={metodePembayaranOptions}
          control={control}
          errors={errors.metode_pembayaran}
          menuPosition="absolute"
        />
      </div>

      {/* If edit, show status field */}
      {isEdit && (
        <div className="col-span-12">
          <SelectDef
            addClass="col-span-8"
            label="Status Pembayaran"
            name="status"
            required={true}
            options={statusOptions}
            control={control}
            errors={errors.status}
            menuPosition="absolute"
          />
        </div>
      )}

      {/* Reference ID based on payment type */}
      {!isEdit && (
        <>
          {jenisPembayaran === "pesanan" && (
            <div className="col-span-12">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">
                    Pilih Pesanan <span className="text-error">*</span>
                  </span>
                </label>
                <select
                  className={`select select-bordered w-full ${
                    errors.pesanan_id ? "select-error" : ""
                  }`}
                  {...register("pesanan_id", {
                    required: "Pesanan harus dipilih",
                  })}
                  disabled={isLoadingReferences}
                >
                  <option value="">
                    {isLoadingReferences ? "Memuat data..." : "Pilih Pesanan"}
                  </option>
                  {pesananOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.kode} - {option.name} (
                      {formatRupiah(option.total)})
                    </option>
                  ))}
                </select>
                {errors.pesanan_id && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.pesanan_id.message}
                    </span>
                  </label>
                )}
              </div>
            </div>
          )}

          {jenisPembayaran === "pemesanan_kamar" && (
            <div className="col-span-12">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">
                    Pilih Pemesanan Kamar <span className="text-error">*</span>
                  </span>
                </label>
                <select
                  className={`select select-bordered w-full ${
                    errors.payable_id ? "select-error" : ""
                  }`}
                  {...register("payable_id", {
                    required: "Pemesanan kamar harus dipilih",
                  })}
                  disabled={isLoadingReferences}
                >
                  <option value="">
                    {isLoadingReferences
                      ? "Memuat data..."
                      : "Pilih Pemesanan Kamar"}
                  </option>
                  {pemesananKamarOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.kode} - {option.name} (
                      {formatRupiah(option.total)})
                    </option>
                  ))}
                </select>
                {errors.payable_id && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.payable_id.message}
                    </span>
                  </label>
                )}
                <input type="hidden" {...register("payable_type")} />
              </div>
            </div>
          )}

          {jenisPembayaran === "pemesanan_fasilitas" && (
            <div className="col-span-12">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">
                    Pilih Pemesanan Fasilitas{" "}
                    <span className="text-error">*</span>
                  </span>
                </label>
                <select
                  className={`select select-bordered w-full ${
                    errors.payable_id ? "select-error" : ""
                  }`}
                  {...register("payable_id", {
                    required: "Pemesanan fasilitas harus dipilih",
                  })}
                  disabled={isLoadingReferences}
                >
                  <option value="">
                    {isLoadingReferences
                      ? "Memuat data..."
                      : "Pilih Pemesanan Fasilitas"}
                  </option>
                  {pemesananFasilitasOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.kode} - {option.name} (
                      {formatRupiah(option.total)})
                    </option>
                  ))}
                </select>
                {errors.payable_id && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.payable_id.message}
                    </span>
                  </label>
                )}
                <input type="hidden" {...register("payable_type")} />
              </div>
            </div>
          )}
        </>
      )}

      {/* Total Pembayaran */}
      <div className="col-span-12 mt-4">
        <div className="bg-base-200 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">Total Pembayaran:</div>
            <div className="text-2xl font-bold text-primary">
              {formatRupiah(total)}
            </div>
          </div>
          <input
            type="hidden"
            {...register("jumlah", {
              required: "Jumlah harus diisi",
              min: {
                value: 1,
                message: "Jumlah harus lebih dari 0",
              },
            })}
          />
          {errors.jumlah && (
            <div className="text-error text-sm mt-1">
              {errors.jumlah.message}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BodyForm;
