/** @format */

// app/kategori-produk/form/BodyForm.tsx
/** @format */

import InputText from "@/components/input/InputText";
import { KategoriProdukType } from "@/types";
import { FC } from "react";
import { FieldErrors } from "react-hook-form";

type Props = {
  register: any;
  errors: FieldErrors<KategoriProdukType>;
  dtEdit: KategoriProdukType | null;
  control: any;
  watch: any;
  setValue: any;
};

const BodyForm: FC<Props> = ({ register, errors }) => {
  return (
    <>
      <InputText
        label={`Nama Kategori Produk`}
        name="nm_kategori_produk"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.nm_kategori_produk}
      />
      <InputText
        label={`Deskripsi`}
        name="deskripsi"
        register={register}
        addClass="col-span-8"
        errors={errors.deskripsi}
      />
    </>
  );
};

export default BodyForm;
