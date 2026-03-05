// src/lib/types.ts
import React from "react";
import {
  UseFormRegisterReturn,
  Path,
  Control,
  UseFormRegister,
  // 💡 1. เอา PatientCardProps ออกจากตรงนี้ เพราะ react-hook-form ไม่มีตัวนี้ครับ
  FieldErrors
} from "react-hook-form";
import { PatientFormData } from "@/lib/schema";

// 💡 1. Type สำหรับข้อมูลผู้ป่วยและ Pusher
export interface PatientSession {
  patientId: string;
  formData: PatientFormData;
  status: string;
  lastUpdated: number;
}

export interface PusherUpdatePayload {
  patientId: string;
  formData: PatientFormData;
  status: string;
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

export type TextAreaFieldProps = Omit<InputFieldProps, "type">;

// 💡 4. Types สำหรับ Form Controls ใหม่ (DatePicker, Select, Phone)
export interface BaseFieldProps {
  name: Path<PatientFormData>;
  control: Control<PatientFormData>;
  label: string;
  error?: string;
  required?: boolean;
}

export interface SelectFieldProps extends BaseFieldProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  isMulti?: boolean;
  isClearable?: boolean;
}

export interface DatePickerFieldProps extends BaseFieldProps {
  placeholder?: string;
}

export type PhoneInputFieldProps = BaseFieldProps;

// 💡 5. Type สำหรับ Props ของแต่ละ Section ในหน้าฟอร์ม (Patient)
export interface FormSectionProps {
  register: UseFormRegister<PatientFormData>;
  control: Control<PatientFormData>;
  errors: FieldErrors<PatientFormData>;
  t: (key: string) => string;
}

// 💡 6. Types สำหรับ Component ของหน้า Staff Dashboard
// 💡 เพิ่มคำว่า export และแก้ onClick ให้รับ id เป็น string ครับ
export interface PatientCardProps {
  patient: PatientSession;
  currentTime: number;
  onClick: (id: string) => void;
  t?: (key: string) => string; // ใส่ ? เผื่อไว้ในกรณีที่ไม่ได้ใช้งาน
  statusBadge?: (status: string) => React.ReactNode; // ใส่ ? เผื่อไว้
}

export interface PatientListProps {
  patients: PatientSession[];
  currentTime: number;
  onSelectPatient: (id: string) => void;
}