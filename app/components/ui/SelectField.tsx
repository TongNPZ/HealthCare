import React from "react";
import { Controller } from "react-hook-form";
import Select, { SingleValue, MultiValue, StylesConfig } from "react-select";
import { SelectFieldProps, SelectOption } from "@/lib/types";

export const getCustomSelectStyles = (hasError: boolean): StylesConfig<SelectOption, boolean> => ({
    control: (base, state) => ({
        ...base,
        borderRadius: "0.75rem",
        minHeight: "44px",
        borderColor: hasError ? "#fca5a5" : state.isFocused ? "#3b82f6" : "#e2e8f0",
        backgroundColor: hasError ? "#fef2f2" : state.isFocused ? "#ffffff" : "#f8fafc80",
        boxShadow: state.isFocused ? (hasError ? "0 0 0 4px rgba(244, 63, 94, 0.1)" : "0 0 0 4px rgba(59, 130, 246, 0.1)") : "none",
        "&:hover": { borderColor: hasError ? "#f43f5e" : "#93c5fd" },
        transition: "all 0.2s ease",
    }),
    menu: (base) => ({
        ...base,
        borderRadius: "0.75rem",
        overflow: "hidden",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#eff6ff" : "transparent",
        color: state.isSelected ? "white" : "#334155",
        cursor: "pointer",
        "&:active": { backgroundColor: "#2563eb" },
    }),
    singleValue: (base) => ({ ...base, color: "#1e293b" }),
    input: (base) => ({ ...base, color: "#1e293b" }),
});

export const SelectField = ({
    name, control, label, options, error, required = true, isMulti = false, isClearable = false, placeholder
}: SelectFieldProps) => (
    <div className="flex flex-col gap-1.5 mb-5">
        <label className="text-sm font-semibold text-slate-700 ml-1">
            {label} {required && <span className="text-rose-500">*</span>}
            {!required && <span className="text-slate-400 font-normal text-xs ml-1">(Optional)</span>}
        </label>
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Select
                    {...field}
                    isMulti={isMulti}
                    isClearable={isClearable}
                    options={options}
                    placeholder={placeholder || "Select..."}
                    styles={getCustomSelectStyles(!!error)}
                    value={
                        isMulti
                            ? options.filter(opt => field.value?.includes(opt.value))
                            : options.find(opt => opt.value === field.value) || null
                    }
                    onChange={(val) => {
                        if (isMulti) {
                            field.onChange((val as MultiValue<{ value: string; label: string }>).map(item => item.value));
                        } else {
                            field.onChange((val as SingleValue<{ value: string; label: string }>)?.value ?? "");
                        }
                    }}
                />
            )}
        />
        {error && <span className="text-rose-500 text-xs font-medium ml-1">{error}</span>}
    </div>
);