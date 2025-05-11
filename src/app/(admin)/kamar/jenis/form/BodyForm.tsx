/** @format */

// app/kamar/jenis/form/BodyForm.tsx
/** @format */

import InputText from "@/components/input/InputText";
import InputTextarea from "@/components/input/InputTextarea";
import { JenisKamarType } from "@/types";
import { FC } from "react";
import { FieldErrors } from "react-hook-form";

type Props = {
  register: any;
  errors: FieldErrors<JenisKamarType>;
  dtEdit: JenisKamarType | null;
  control: any;
  watch: any;
  setValue: any;
};

const BodyForm: FC<Props> = ({ register, errors }) => {
  return (
    <>
      <InputText
        label={`Nama Jenis Kamar`}
        name="nm_jenis_kamar"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.nm_jenis_kamar}
      />
      <InputText
        label={`Kapasitas`}
        name="kapasitas"
        register={register}
        addClass="md:col-span-2 col-span-8"
        required
        errors={errors.kapasitas}
        type="number"
      />
      <InputText
        label={`Harga`}
        name="harga_per_malam"
        register={register}
        addClass="md:col-span-6 col-span-8"
        required
        errors={errors.harga_per_malam}
        type="currency"
      />
      <InputTextarea
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
