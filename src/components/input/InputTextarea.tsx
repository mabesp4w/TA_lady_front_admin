/** @format */

import React from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  label?: string;
  register: UseFormRegister<any>;
  required?: boolean;
  name: string;
  minLength?: number;
  maxLength?: number;
  errors?: any;
  readOnly?: boolean;
  placeholder?: string;
  autoComplete?: string;
  addClass?: string;
  labelClass?: string;
  value?: string;
  rows?: number;
  cols?: number;
};

const InputTextarea = ({
  label,
  register,
  required,
  name,
  minLength,
  maxLength,
  errors,
  readOnly,
  placeholder,
  autoComplete = "on",
  addClass,
  labelClass,
  value,
  rows = 4,
  cols,
}: Props) => {
  return (
    <label className={`relative ${addClass}`}>
      <div className="flex">
        {label && (
          <div className={`label ${labelClass}`}>
            <span className={`label-text ${labelClass}`}>{label}</span>
          </div>
        )}
        {required && label && (
          <span className="ml-1 text-red-600 self-center">*</span>
        )}
        {!required && label && (
          <span className="label-text ml-1 self-center">(Optional)</span>
        )}
      </div>
      <textarea
        placeholder={placeholder}
        className="textarea textarea-bordered w-full text-gray-600"
        readOnly={readOnly}
        autoComplete={autoComplete}
        rows={rows}
        cols={cols}
        {...register(name as any, {
          required,
          minLength,
          maxLength,
        })}
        defaultValue={value}
      />
      {errors?.type === "required" && (
        <p className="text-red-600 italic text-sm">
          {label} tidak boleh kosong
        </p>
      )}
      {errors?.type === "minLength" && (
        <p className="text-red-600 italic text-sm">
          {label} tidak boleh kurang dari {minLength} karakter
        </p>
      )}
      {errors?.type === "maxLength" && (
        <p className="text-red-600 italic text-sm">
          {label} tidak boleh lebih dari {maxLength} karakter
        </p>
      )}
    </label>
  );
};

export default InputTextarea;
