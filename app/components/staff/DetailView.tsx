import React from 'react';
import { User, MapPin, Phone, ShieldAlert } from "lucide-react";
import { PatientSession } from "@/lib/types";

// Reusable component for displaying data rows
const DataRow = ({ label, value, tFallback }: { label: string; value?: string | string[]; tFallback: string }) => (
  <div className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
    <span className="text-sm text-slate-500 font-medium">{label}</span>
    <span className={`text-sm font-bold ${value && value.length > 0 ? "text-slate-800" : "text-slate-400"}`}>
      {Array.isArray(value) ? value.join(", ") : value || tFallback}
    </span>
  </div>
);

export const PatientDetailView = ({ patient, t }: { patient: PatientSession; t: (key: string) => string }) => {
  // Extract formData safely to handle loading states
  const formData = patient?.formData || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Personal Information Section */}
      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
          <User className="w-4 h-4 text-blue-500" /> {t("personalInfo") || "Personal Information"}
        </h3>
        <DataRow label={t("firstName") || "First Name"} value={formData.firstName} tFallback="-" />
        <DataRow label={t("middleName") || "Middle Name"} value={formData.middleName} tFallback="-" />
        <DataRow label={t("lastName") || "Last Name"} value={formData.lastName} tFallback="-" />
        <DataRow label={t("dob") || "Date of Birth"} value={formData.dateOfBirth} tFallback="-" />
        <DataRow label={t("gender") || "Gender"} value={formData.gender} tFallback="-" />
        <DataRow label={t("religion") || "Religion"} value={formData.religion} tFallback="-" />
      </div>

      {/* Contact Information Section */}
      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
          <Phone className="w-4 h-4 text-indigo-500" /> {t("contactInfo") || "Contact Information"}
        </h3>
        <DataRow label={t("phone") || "Phone"} value={formData.phoneNumber} tFallback="-" />
        <DataRow label={t("email") || "Email"} value={formData.email} tFallback="-" />
        <DataRow label={t("nationality") || "Nationality"} value={formData.nationality} tFallback="-" />
        <DataRow label={t("language") || "Preferred Language"} value={formData.preferredLanguage} tFallback="-" />
      </div>

      {/* Address Section */}
      <div className="md:col-span-2 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
          <MapPin className="w-4 h-4 text-emerald-500" /> {t("address") || "Address"}
        </h3>
        <p className="text-sm text-slate-700 bg-white p-4 rounded-xl border border-slate-100 mb-4">
          {formData.address || "No address provided"}
        </p>
      </div>

      {/* Emergency Contact Section */}
      <div className="md:col-span-2 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
          <ShieldAlert className="w-4 h-4 text-amber-500" /> {t("emergencyContact")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DataRow label={t("contactName")} value={formData.emergencyContactName} tFallback="-" />
          <DataRow label={t("relationship")} value={formData.emergencyContactRelationship} tFallback="-" />
        </div>
      </div>

    </div>
  );
};