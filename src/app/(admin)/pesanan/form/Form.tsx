/** @format */

// app/pesanan/form/Form.tsx
"use client";
import toastShow from "@/utils/toast-show";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import ModalDef from "@/components/modal/ModalDef";
import usePesanan from "@/stores/crud/Pesanan";
import { ItemPesananType, PesananType, ProdukType } from "@/types";
import InputText from "@/components/input/InputText";
import { closeModal } from "@/utils/modalHelper";
import BodyForm from "./BodyForm";
import useProdukApi from "@/stores/api/Produk";

type Props = {
  dtEdit: PesananType | null;
  halaman: string;
};

const Form = ({ dtEdit, halaman }: Props) => {
  // store
  const { addData, updateData } = usePesanan();
  const { setProduk } = useProdukApi();

  // state
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProdukType[]>([]);

  // hook form
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm<PesananType>({
    defaultValues: {
      id: "",
      jenis_pesanan: "offline",
      total_jumlah: 0,
      catatan: "",
      item_pesanan: [
        {
          produk_id: "",
          jumlah: 1,
          harga_satuan: 0,
          subtotal: 0,
        } as ItemPesananType,
      ],
    },
  });

  // Item field array untuk mengelola item pesanan yang dinamis
  const { fields, append, remove } = useFieldArray({
    control,
    name: "item_pesanan",
  });

  // Load produk saat komponen dimuat
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await setProduk({});
      if (response.status === "berhasil" && response.data) {
        console.log(response.data.data);
        setProducts(response.data.data || []);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fungsi untuk mengkalkulasi total
  const calculateTotal = (items: any[]) => {
    return items.reduce((total, item) => {
      const subtotal = Number(item.harga_satuan) * Number(item.jumlah);
      return total + subtotal;
    }, 0);
  };

  // Pantau perubahan pada item pesanan untuk mengupdate total
  useEffect(() => {
    // Pantau perubahan hanya pada item pesanan
    const subscription = watch((value, { name }) => {
      // Periksa apakah perubahan terjadi pada item_pesanan, bukan pada total_jumlah
      if (
        name &&
        name.startsWith("item_pesanan") &&
        !name.includes("total_jumlah")
      ) {
        // Gunakan setTimeout untuk memindahkan kalkulasi ke akhir event loop
        setTimeout(() => {
          if (value.item_pesanan) {
            // Hitung total dan update
            const total = calculateTotal(value.item_pesanan);
            // Gunakan opsi tambahan untuk mencegah trigger validasi tambahan
            setValue("total_jumlah", total, {
              shouldDirty: true,
              shouldValidate: false,
              shouldTouch: false,
            });
          }
        }, 0);
      }
    });

    // Bersihkan subscription saat komponen unmount
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  // reset form
  const resetForm = () => {
    reset({
      id: "",
      jenis_pesanan: "offline",
      total_jumlah: 0,
      catatan: "",
      item_pesanan: [
        {
          produk_id: "",
          jumlah: 1,
          harga_satuan: 0,
          subtotal: 0,
        } as ItemPesananType,
      ],
    });
    closeModal("add_pesanan");
  };

  // data edit
  useEffect(() => {
    if (dtEdit) {
      setValue("id", dtEdit.id || "");
      setValue("jenis_pesanan", dtEdit.jenis_pesanan || "offline");
      setValue("total_jumlah", dtEdit.total_jumlah || 0);
      setValue("catatan", dtEdit.catatan || "");

      // Reset item_pesanan to empty first
      while (fields.length > 0) {
        remove(0);
      }

      // Then add all items from dtEdit
      if (dtEdit.item_pesanan && dtEdit.item_pesanan.length > 0) {
        dtEdit.item_pesanan.forEach((item) => {
          append({
            id: item.id,
            pesanan_id: item.pesanan_id,
            produk_id: item.produk_id,
            jumlah: item.jumlah,
            harga_satuan: item.harga_satuan,
            subtotal: item.subtotal,
          } as ItemPesananType);
        });
      } else {
        // Add at least one empty item
        append({
          produk_id: "",
          jumlah: 1,
          harga_satuan: 0,
          subtotal: 0,
        } as ItemPesananType);
      }
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dtEdit]);

  // simpan data
  const onSubmit: SubmitHandler<PesananType> = async (data) => {
    setIsLoading(true);

    try {
      // Transform data for API
      const formattedData = {
        jenis_pesanan: data.jenis_pesanan,
        catatan: data.catatan,
        items: data.item_pesanan?.map((item) => ({
          produk_id: item.produk_id,
          jumlah: item.jumlah,
        })),
      };

      let response;

      // Proses tambah atau update
      if (dtEdit) {
        response = await updateData(dtEdit.id as string, formattedData);
      } else {
        response = await addData(formattedData as any);
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

  // Menambah item pesanan baru
  const addItem = () => {
    append({
      produk_id: "",
      jumlah: 1,
      harga_satuan: 0,
      subtotal: 0,
    } as ItemPesananType);
  };

  // Menghapus item pesanan
  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toastShow({
        event: {
          judul: "Perhatian",
          type: "warning",
          message: "Minimal harus ada 1 item pesanan",
        },
      });
    }
  };

  // Update harga_satuan dan subtotal saat produk dipilih
  const updateItemPrice = (index: number, produk_id: string) => {
    const selectedProduct = products.find((p) => p.id === produk_id);
    if (selectedProduct) {
      const itemsValue = watch("item_pesanan");
      const jumlah = itemsValue?.[index]?.jumlah || 1;
      const harga = selectedProduct.harga;
      const subtotal = jumlah * harga;

      setValue(`item_pesanan.${index}.harga_satuan`, harga);
      setValue(`item_pesanan.${index}.subtotal`, subtotal);
    }
  };

  // Update subtotal saat jumlah diubah
  const updateItemSubtotal = (index: number, jumlah: number) => {
    const itemsValue = watch("item_pesanan");
    const harga = itemsValue?.[index]?.harga_satuan || 0;
    const subtotal = jumlah * harga;

    setValue(`item_pesanan.${index}.subtotal`, subtotal);
  };

  return (
    <ModalDef id="add_pesanan" title={`Form ${halaman}`} size="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText name="id" register={register} type="hidden" />
        <InputText name="total_jumlah" register={register} type="hidden" />

        <div className="grid grid-cols-12 gap-3 mb-4">
          <BodyForm
            register={register}
            errors={errors}
            control={control}
            watch={watch}
            fields={fields}
            products={products}
            addItem={addItem}
            removeItem={removeItem}
            updateItemPrice={updateItemPrice}
            updateItemSubtotal={updateItemSubtotal}
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
