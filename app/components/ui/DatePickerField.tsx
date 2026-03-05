import React from "react";
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { DatePickerFieldProps } from "@/lib/types";
import "react-datepicker/dist/react-datepicker.css";

export const DatePickerField = ({ name, control, label, error, required = true, placeholder }: DatePickerFieldProps) => (
    <div className="flex flex-col gap-1.5 mb-5">
        {/* Field label with required indicator */}
        <label className="text-sm font-semibold text-slate-700 ml-1">
            {label} {required && <span className="text-rose-500">*</span>}
        </label>

        {/* React Hook Form Controller to manage DatePicker state */}
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <DatePicker
                    selected={field.value ? new Date(field.value as string) : null}
                    // Convert the selected date to ISO string (YYYY-MM-DD) for standardized form data
                    onChange={(date: Date | null) => field.onChange(date ? date.toISOString().split('T')[0] : "")}
                    dateFormat="dd/MM/yyyy"
                    placeholderText={placeholder || "DD/MM/YYYY"}
                    wrapperClassName="w-full"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    // Apply dynamic styling based on error state
                    className={`w-full h-11 px-4 rounded-xl border transition-all text-slate-800 outline-none
                    ${error
                            ? "border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                            : "border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"}`}
                />
            )}
        />

        {/* Error message display */}
        {error && <span className="text-rose-500 text-xs font-medium ml-1">{error}</span>}
    </div>
);