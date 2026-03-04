// src/components/staff/DetailView.tsx
import React from 'react';
import { User, Mail, MapPin, Phone, ShieldAlert } from "lucide-react";

interface PatientFormData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  email?: string;
  nationality?: string;
  address?: string;
  preferredLanguage?: string[];
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
}

interface Patient {
  formData: PatientFormData;
}

type TranslationFunction = (key: string) => string;

const DataRow = ({ label, value, tFallback }: { label: string; value?: string; tFallback: string }) => (
  <div className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
    <span className="text-sm text-slate-500 font-medium">{label}</span>
    <span className={`text-sm font-bold ${value ? "text-slate-800" : "text-slate-400"}`}>{value || tFallback}</span>
  </div>
);

export const PatientDetailView = ({ patient, t }: { patient: Patient; t: TranslationFunction }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ข้อมูลส่วนตัว */}
      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4"><User className="w-4 h-4 text-blue-500" /> {t("personalInfo")}</h3>
        <DataRow label={t("firstName")} value={patient.formData.firstName} tFallback="-" />
        <DataRow label={t("lastName")} value={patient.formData.lastName} tFallback="-" />
        <DataRow label={t("dob")} value={patient.formData.dateOfBirth} tFallback="-" />
        <DataRow label={t("gender")} value={patient.formData.gender} tFallback="-" />
      </div>

      {/* การติดต่อ */}
      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4"><Phone className="w-4 h-4 text-indigo-500" /> {t("contactInfo")}</h3>
        <DataRow label={t("phone")} value={patient.formData.phoneNumber} tFallback="-" />
        <DataRow label={t("email")} value={patient.formData.email} tFallback="-" />
        <DataRow label={t("nationality")} value={patient.formData.nationality} tFallback="-" />
      </div>

      {/* ที่อยู่และภาษา */}
      <div className="md:col-span-2 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4"><MapPin className="w-4 h-4 text-rose-500" /> {t("address")}</h3>
        <p className="text-sm text-slate-700 bg-white p-4 rounded-xl border border-slate-100 mb-4">{patient.formData.address || "No address provided"}</p>
        <DataRow label={t("language")} value={patient.formData.preferredLanguage?.join(", ")} tFallback="-" />
      </div>

      {/* 💡 โชว์ Emergency Contact เฉพาะเมื่อมีข้อมูล (Conditional Rendering) */}
      {(patient.formData.emergencyContactName || patient.formData.emergencyContactRelationship) && (
        <div className="md:col-span-2 bg-rose-50/30 p-6 rounded-2xl border border-rose-100">
          <h3 className="flex items-center gap-2 font-bold text-rose-800 mb-4"><ShieldAlert className="w-4 h-4" /> Emergency Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DataRow label="Name" value={patient.formData.emergencyContactName} tFallback="-" />
            <DataRow label="Relationship" value={patient.formData.emergencyContactRelationship} tFallback="-" />
          </div>
        </div>
      )}
    </div>
  );
};