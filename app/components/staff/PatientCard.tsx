import React from "react";
import { User } from "lucide-react";
import { PatientCardProps } from "@/lib/types";

export const PatientCard = ({ patient, currentTime, onClick }: PatientCardProps) => {
  const safeLastUpdated = patient.lastUpdated || currentTime;
  const minutesAgo = Math.floor((currentTime - safeLastUpdated) / 60000);

  const displayName = patient.formData.firstName
    ? `${patient.formData.firstName} ${patient.formData.lastName}`
    : patient.patientId;

  // Determine indicator status based on assignment requirements
  let displayStatus = "ACTIVE";
  let statusBadgeClass = "bg-blue-50 text-blue-600 border-blue-100";

  if (patient.status === 'submitted') {
    displayStatus = "SUBMITTED";
    statusBadgeClass = "bg-emerald-50 text-emerald-600 border-emerald-100";
  } else if (minutesAgo >= 2) {
    // Consider inactive if there is no update in the last 2 minutes
    displayStatus = "INACTIVE";
    statusBadgeClass = "bg-amber-50 text-amber-600 border-amber-100";
  }

  return (
    <div
      onClick={() => onClick(patient.patientId)}
      className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 cursor-pointer transition-all group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
          <User className="w-6 h-6" />
        </div>

        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
          {minutesAgo < 1 ? "Just now" : `${minutesAgo}m ago`}
        </span>
      </div>

      <h3 className="font-bold text-slate-800 text-lg truncate mb-4">
        {displayName}
      </h3>

      <div className="flex items-center justify-between mt-auto">
        <span className={`text-[10px] font-black px-3 py-1 rounded-lg border ${statusBadgeClass}`}>
          {displayStatus}
        </span>
      </div>
    </div>
  );
};