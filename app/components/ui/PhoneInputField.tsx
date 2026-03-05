import React from "react";
import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { PhoneInputFieldProps } from "@/lib/types";

export const PhoneInputField = ({ name, control, label, error, required = true }: PhoneInputFieldProps) => (
    <div className="flex flex-col gap-1.5 mb-5">
        {/* Field label with required indicator */}
        <label className="text-sm font-semibold text-slate-700 ml-1">
            {label} {required && <span className="text-rose-500">*</span>}
        </label>

        {/* React Hook Form Controller to manage PhoneInput state */}
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <PhoneInput
                    country={"th"}
                    value={field.value as string}
                    onChange={field.onChange}
                    // Use important flags (!) to override default react-phone-input-2 styles
                    inputClass={`!w-full !h-11 !text-slate-800 !rounded-xl transition-all outline-none
                    ${error
                            ? "!border-rose-300 !bg-rose-50 focus:!border-rose-500"
                            : "!border-slate-200 !bg-slate-50/50 focus:!border-blue-500 focus:!bg-white"}`}
                />
            )}
        />

        {/* Error message display */}
        {error && <span className="text-rose-500 text-xs font-medium ml-1">{error}</span>}
    </div>
);