// src/lib/types.ts
import React from "react";
import {
  UseFormRegisterReturn,
  Path,
  Control,
  UseFormRegister,
  FieldErrors
} from "react-hook-form";
import { PatientFormData } from "@/lib/schema";

// Patient session and Pusher real-time payload types
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

// Dropdown select option type
export interface SelectOption {
  value: string;
  label: string;
}

// General input field types
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

// Base properties for specialized form controls
export interface BaseFieldProps {
  name: Path<PatientFormData>;
  control: Control<PatientFormData>;
  label: string;
  error?: string;
  required?: boolean;
}

export interface SelectFieldProps extends BaseFieldProps {
  options: SelectOption[];
  placeholder?: string;
  isMulti?: boolean;
  isClearable?: boolean;
}

export interface DatePickerFieldProps extends BaseFieldProps {
  placeholder?: string;
}

export type PhoneInputFieldProps = BaseFieldProps;

// Props for patient form sections
export interface FormSectionProps {
  register: UseFormRegister<PatientFormData>;
  control: Control<PatientFormData>;
  errors: FieldErrors<PatientFormData>;
  t: (key: string) => string;
}

// Staff dashboard component types
export interface PatientCardProps {
  patient: PatientSession;
  currentTime: number;
  onClick: (id: string) => void;
  t?: (key: string) => string;
  statusBadge?: (status: string) => React.ReactNode;
}

export interface PatientListProps {
  patients: PatientSession[];
  currentTime: number;
  onSelectPatient: (id: string) => void;
}
