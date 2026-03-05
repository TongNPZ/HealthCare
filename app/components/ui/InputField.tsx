import React from "react";
import { InputFieldProps, TextAreaFieldProps } from "@/lib/types";
import "react-phone-input-2/lib/style.css";
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