// src/components/ui/FormFields.tsx
import React from "react";
import { UseFormRegisterReturn, Path } from "react-hook-form";
import { StylesConfig } from "react-select";
import { PatientFormData } from "@/lib/schema";

export interface InputFieldProps {
  label: string;
  required?: boolean;
  type?: string;
  error?: string;
  placeholder?: string;
  registration: UseFormRegisterReturn<Path<PatientFormData>>;
  icon?: React.ReactNode;
}

export interface SelectOption {
  value: string;
  label: string;
}

export const getCustomSelectStyles = (
  hasError: boolean,
): StylesConfig<SelectOption, boolean> => ({
  control: (base, state) => ({
    ...base,
    borderRadius: "0.75rem",
    minHeight: "44px",
    borderColor: hasError ? "#fca5a5" : state.isFocused ? "#3b82f6" : "#e2e8f0",
    backgroundColor: hasError
      ? "#fef2f2"
      : state.isFocused
        ? "#ffffff"
        : "#f8fafc80",
    boxShadow: state.isFocused
      ? hasError
        ? "0 0 0 4px rgba(244, 63, 94, 0.1)"
        : "0 0 0 4px rgba(59, 130, 246, 0.1)"
      : "none",
    "&:hover": { borderColor: hasError ? "#f43f5e" : "#93c5fd" },
    transition: "all 0.2s ease",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "0.75rem",
    overflow: "hidden",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
        ? "#eff6ff"
        : "transparent",
    color: state.isSelected ? "white" : "#334155",
    cursor: "pointer",
    "&:active": { backgroundColor: "#2563eb" },
  }),
  singleValue: (base) => ({ ...base, color: "#1e293b" }),
  input: (base) => ({ ...base, color: "#1e293b" }),
});

export const InputField = ({
  label,
  required = true,
  type = "text",
  error,
  registration,
  placeholder,
  icon,
}: InputFieldProps) => (
  <div className="flex flex-col gap-1.5 mb-5">
    <label className="text-sm font-semibold text-slate-700 ml-1">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        {...registration}
        placeholder={placeholder}
        className={`h-11 w-full rounded-xl border transition-all duration-200 outline-none text-slate-800
          ${icon ? "pl-10 pr-4" : "px-4"}
          ${error ? "border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10" : "border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 hover:border-blue-300"}
        `}
      />
    </div>
    {error && (
      <span className="text-rose-500 text-xs font-medium ml-1">{error}</span>
    )}
  </div>
);

export const TextAreaField = ({
  label,
  required = true,
  error,
  registration,
  placeholder,
  icon,
}: Omit<InputFieldProps, "type">) => (
  <div className="flex flex-col gap-1.5 mb-5">
    <label className="text-sm font-semibold text-slate-700 ml-1">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3.5 top-4 text-slate-400">{icon}</div>
      )}
      <textarea
        {...registration}
        placeholder={placeholder}
        rows={3}
        className={`w-full p-4 rounded-xl border transition-all duration-200 outline-none resize-none text-slate-800
          ${icon ? "pl-10" : ""}
          ${error ? "border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10" : "border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 hover:border-blue-300"}
        `}
      />
    </div>
    {error && (
      <span className="text-rose-500 text-xs font-medium ml-1">{error}</span>
    )}
  </div>
);
