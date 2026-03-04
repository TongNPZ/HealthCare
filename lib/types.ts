// lib/types.ts
import { UseFormRegisterReturn, Path } from "react-hook-form";
import { PatientFormData } from "@/lib/schema";

// 💡 1. Type สำหรับผู้ป่วยในหน้า Staff Dashboard
export interface PatientSession {
  patientId: string;
  formData: PatientFormData;
  status: string;
  lastUpdated: number;
}

// 💡 2. Type สำหรับตัวเลือก (Dropdown Select)
export interface SelectOption {
  value: string;
  label: string;
}

// 💡 3. Type สำหรับ Input Fields ทั่วไป
export interface InputFieldProps {
  label: string;
  required?: boolean;
  type?: string;
  error?: string;
  placeholder?: string;
  registration: UseFormRegisterReturn<Path<PatientFormData>>;
  icon?: React.ReactNode;
}

// 💡 4. Type สำหรับ Text Area (ตัด property 'type' ออกจาก InputFieldProps)
export type TextAreaFieldProps = Omit<InputFieldProps, "type">;