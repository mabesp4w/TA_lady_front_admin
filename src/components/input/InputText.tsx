/** @format */

import React, { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { BsEyeSlash, BsEye } from "react-icons/bs";

type Props = {
  label?: string;
  register: UseFormRegister<any>;
  required?: boolean;
  name: string;
  minLength?: number;
  maxLength?: number;
  errors?: any;
  valueAsNumber?: boolean;
  type?:
    | "text"
    | "password"
    | "number"
    | "email"
    | "date"
    | "time"
    | "hidden"
    | "currency";
  readOnly?: boolean;
  placeholder?: string;
  autoComplete?: string;
  addClass?: string;
  labelClass?: string;
  value?: string | number;
};

const InputText = ({
  label,
  register,
  required,
  name,
  minLength,
  maxLength,
  errors,
  valueAsNumber,
  type = "text",
  readOnly,
  placeholder,
  autoComplete = "on",
  addClass,
  labelClass,
  value,
}: Props) => {
  const [isTypePassword, setIsTypePassword] = useState(false);
  const tooglePassword = () => {
    setIsTypePassword(!isTypePassword);
  };

  // Format number to currency format
  const formatCurrency = (value: string | number) => {
    if (!value) return "";
    // Remove all non-digit characters
    const numbers = value.toString().replace(/\D/g, "");
    // Format to Indonesian currency
    return new Intl.NumberFormat("id-ID").format(Number(numbers));
  };

  // Handle currency input
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatCurrency(value);
    e.target.value = formattedValue;
  };

  // Parse currency value to number for form submission
  const parseCurrency = (value: string | number) => {
    // Check if value is undefined or null
    if (value === undefined || value === null) {
      return 0;
    }

    // Ensure value is a string before using replace
    const stringValue = String(value);
    // Jika string berisi titik atau koma sebagai pemisah ribuan, pastikan kita mengambil angka saja
    const numericValue = stringValue.replace(/\D/g, "");
    return Number(numericValue);
  };

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

      {type === "currency" ? (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
            Rp
          </span>
          <input
            type="text"
            placeholder={placeholder || "0"}
            className="input input-bordered w-full text-gray-600 pl-10"
            readOnly={readOnly}
            autoComplete={autoComplete}
            {...register(name as any, {
              required,
              // Don't use valueAsNumber here as we handle conversion ourselves
              // Custom validation for currency
              validate: {
                isNumber: (value) => {
                  // Handle potential non-string values safely
                  try {
                    const numValue = parseCurrency(value);
                    return !isNaN(numValue) || "Harus berupa angka";
                  } catch (error) {
                    console.error("Validation error:", error);
                    return "Format nilai tidak valid";
                  }
                },
                ...(minLength && {
                  minValue: (value) => {
                    try {
                      const numValue = parseCurrency(value);
                      return (
                        numValue >= minLength ||
                        `Minimal ${new Intl.NumberFormat("id-ID").format(
                          minLength
                        )}`
                      );
                    } catch (error) {
                      console.log({ error });
                      return "Format nilai tidak valid";
                    }
                  },
                }),
                ...(maxLength && {
                  maxValue: (value) => {
                    try {
                      const numValue = parseCurrency(value);
                      return (
                        numValue <= maxLength ||
                        `Maksimal ${new Intl.NumberFormat("id-ID").format(
                          maxLength
                        )}`
                      );
                    } catch (error) {
                      console.log({ error });
                      return "Format nilai tidak valid";
                    }
                  },
                }),
              },
              setValueAs: (value) => {
                try {
                  // Ensure we return the full numeric value, not just the first part
                  return parseCurrency(value);
                } catch (error) {
                  console.error("setValueAs error:", error);
                  return 0; // Return default value on error
                }
              },
            })}
            defaultValue={value ? formatCurrency(value) : ""}
            onChange={(e) => {
              handleCurrencyChange(e);
              register(name as any).onChange(e);
            }}
          />
        </div>
      ) : (
        <input
          type={
            type === "password" ? (isTypePassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className="input input-bordered w-full text-gray-600"
          readOnly={readOnly}
          autoComplete={autoComplete}
          {...register(name as any, {
            required,
            minLength,
            maxLength,
            valueAsNumber,
          })}
          defaultValue={value}
        />
      )}

      {type === "password" && (
        <div
          className="absolute right-2 h-fit top-12 cursor-pointer text-accent flex items-center"
          onClick={tooglePassword}
        >
          <div className="">
            {isTypePassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
          </div>
        </div>
      )}

      {/* Error messages */}
      {errors?.type === "oneOf" && (
        <p className="text-red-600 italic text-sm">{errors.message}</p>
      )}
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
      {errors?.type === "pattern" && (
        <p className="text-red-600 italic text-sm">
          {label} hanya boleh angka.
        </p>
      )}
      {errors?.type === "isNumber" && (
        <p className="text-red-600 italic text-sm">
          {label} harus berupa angka
        </p>
      )}
      {errors?.type === "minValue" && (
        <p className="text-red-600 italic text-sm">{errors.message}</p>
      )}
      {errors?.type === "maxValue" && (
        <p className="text-red-600 italic text-sm">{errors.message}</p>
      )}
    </label>
  );
};

export default InputText;
