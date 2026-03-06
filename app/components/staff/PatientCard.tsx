import React from "react";
import { User, ChevronRight } from "lucide-react";
import { PatientCardProps } from "@/lib/types";
import { useTranslation } from "react-i18next";

export const PatientCard = ({ patient, currentTime, onClick }: PatientCardProps) => {
  const { t } = useTranslation();

  const safeLastUpdated = patient.lastUpdated || currentTime;
  const minutesAgo = Math.floor((currentTime - safeLastUpdated) / 60000);

  const displayName = patient.formData.firstName
    ? `${patient.formData.firstName} ${patient.formData.lastName}`
    : patient.patientId;

  // Determine indicator status based on assignment requirements and translate them
  let displayStatus = t("statusActive");
  let statusBadgeClass = "bg-blue-50 text-blue-600 border-blue-100";

  if (patient.status === 'submitted') {
    displayStatus = t("statusSubmitted");
    statusBadgeClass = "bg-emerald-50 text-emerald-600 border-emerald-100";
  } else if (minutesAgo >= 2) {
    // Consider inactive if there is no update in the last 2 minutes
    displayStatus = t("statusInactive");
    statusBadgeClass = "bg-amber-50 text-amber-600 border-amber-100";
  }

  // Format time display using i18n
  const timeDisplay = minutesAgo < 1 ? t("justNow") : `${minutesAgo} ${t("minsAgo")}`;

  return (
    <div
      onClick={() => onClick(patient.patientId)}
      className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-400 cursor-pointer transition-all group flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Avatar Icon */}
        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shrink-0">
          <User className="w-6 h-6" />
        </div>

        {/* Patient Name and ID */}
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-800 text-base md:text-lg truncate group-hover:text-indigo-700 transition-colors">
            {displayName}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
              {patient.patientId}
            </span>
          </div>
        </div>
      </div>

      {/* Status, Time, and Action */}
      <div className="flex items-center gap-4 md:gap-6 shrink-0">
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-[10px] md:text-xs font-black px-3 py-1 rounded-lg border ${statusBadgeClass}`}>
            {displayStatus}
          </span>
          <span className="text-[10px] md:text-xs font-bold text-slate-400">
            {timeDisplay}
          </span>
        </div>

        {/* Arrow indicator for better UX */}
        <div className="text-slate-300 group-hover:text-indigo-500 transition-colors hidden sm:block">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};