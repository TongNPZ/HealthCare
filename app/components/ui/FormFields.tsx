import React from "react";
import { StylesConfig } from "react-select";
import { Controller } from "react-hook-form";
import Select, { SingleValue, MultiValue } from "react-select";
import DatePicker from "react-datepicker";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Import all required types from the centralized types definitions
import {
  SelectOption,
  InputFieldProps,
  TextAreaFieldProps,
  SelectFieldProps,
  DatePickerFieldProps,
  PhoneInputFieldProps
} from "../../../lib/types";

// ==========================================
// Base Form Fields
// ==========================================

// Shared custom styling for react-select components to maintain consistent UI
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

// Standard text input field
export const InputField = ({ label, required = true, type = "text", error, registration, placeholder, icon }: InputFieldProps) => (
  <div className="flex flex-col gap-1.5 mb-5">
    <label className="text-sm font-semibold text-slate-700 ml-1">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative">
      {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
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
    {error && <span className="text-rose-500 text-xs font-medium ml-1">{error}</span>}
  </div>
);

// Standard multiline text area field
export const TextAreaField = ({ label, required = true, error, registration, placeholder, icon }: TextAreaFieldProps) => (
  <div className="flex flex-col gap-1.5 mb-5">
    <label className="text-sm font-semibold text-slate-700 ml-1">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative">
      {icon && <div className="absolute left-3.5 top-4 text-slate-400">{icon}</div>}
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
    {error && <span className="text-rose-500 text-xs font-medium ml-1">{error}</span>}
  </div>
);

// ==========================================
// 1. SelectField (For Dropdown and Multi-select)
// ==========================================
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
          // Safely map form values back to react-select options
          value={
            isMulti
              ? options.filter(opt => (field.value as string[])?.includes(opt.value))
              : options.find(opt => opt.value === field.value) || null
          }
          onChange={(val) => {
            if (isMulti) {
              field.onChange((val as MultiValue<SelectOption>).map(item => item.value));
            } else {
              field.onChange((val as SingleValue<SelectOption>)?.value ?? "");
            }
          }}
        />
      )}
    />
    {error && <span className="text-rose-500 text-xs font-medium ml-1">{error}</span>}
  </div>
);

// ==========================================
// 2. DatePickerField (For selecting dates)
// ==========================================
export const DatePickerField = ({ name, control, label, error, required = true, placeholder }: DatePickerFieldProps) => (
  <div className="flex flex-col gap-1.5 mb-5">
    <label className="text-sm font-semibold text-slate-700 ml-1">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DatePicker
          // Cast field.value as string to fulfill Date constructor requirements
          selected={field.value ? new Date(field.value as string) : null}
          onChange={(date: Date | null) => field.onChange(date ? date.toISOString().split('T')[0] : "")}
          dateFormat="dd/MM/yyyy"
          placeholderText={placeholder || "DD/MM/YYYY"}
          wrapperClassName="w-full"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          className={`w-full h-11 px-4 rounded-xl border transition-all text-slate-800 outline-none
            ${error
              ? "border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
              : "border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"}`}
        />
      )}
    />
    {error && <span className="text-rose-500 text-xs font-medium ml-1">{error}</span>}
  </div>
);

// ==========================================
// 3. PhoneInputField (For phone number inputs)
// ==========================================
export const PhoneInputField = ({ name, control, label, error, required = true }: PhoneInputFieldProps) => (
  <div className="flex flex-col gap-1.5 mb-5">
    <label className="text-sm font-semibold text-slate-700 ml-1">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <PhoneInput
          country={"th"}
          // Cast field.value as string to fulfill PhoneInput value requirements
          value={field.value as string}
          onChange={field.onChange}
          inputClass={`!w-full !h-11 !text-slate-800 !rounded-xl transition-all outline-none
            ${error
              ? "!border-rose-300 !bg-rose-50 focus:!border-rose-500"
              : "!border-slate-200 !bg-slate-50/50 focus:!border-blue-500 focus:!bg-white"}`}
        />
      )}
    />
    {error && <span className="text-rose-500 text-xs font-medium ml-1">{error}</span>}
  </div>
);