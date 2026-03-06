"use client";

import { useStaffDashboard } from "@/hooks/useStaffDashboard";
import { PatientList } from "../components/staff/PatientList";
import { PatientDetailView } from "@/app/components/staff/DetailView";
import { useTranslation } from "react-i18next";
import { ChevronLeft, LayoutDashboard, Activity } from "lucide-react";

export default function StaffPage() {
  const { patientList, activePatient, selectedId, setSelectedId, currentTime, isMounted } = useStaffDashboard();
  const { t } = useTranslation();

  // Prevent hydration errors and ensure timer is initialized
  if (!isMounted || currentTime === 0) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

        {!selectedId ? (
          // Main Dashboard View
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-200 pb-6 gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                  <LayoutDashboard className="text-indigo-600 w-8 h-8 md:w-10 md:h-10" />
                  {t("liveMonitor")}
                </h1>
                <p className="text-slate-500 font-medium mt-2">
                  {t("autoCleanup")}
                </p>
              </div>
              <div className="bg-indigo-600 text-white px-5 py-2 rounded-full text-xs font-bold animate-pulse flex items-center gap-2.5 shadow-md shadow-indigo-500/20">
                <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                LIVE SYSTEM
              </div>
            </div>

            <PatientList
              patients={patientList}
              currentTime={currentTime}
              onSelectPatient={(id) => setSelectedId(id)}
            />
          </div>
        ) : (
          // Detailed View
          <div className="bg-white rounded-[2.5rem] p-6 md:p-10 lg:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 animate-in slide-in-from-right-8 duration-300">
            <button
              onClick={() => setSelectedId(null)}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 mb-10 transition-colors bg-slate-50 hover:bg-indigo-50 px-5 py-2.5 rounded-xl w-fit border border-slate-100"
            >
              <ChevronLeft className="w-5 h-5" /> {t("backToList")}
            </button>

            <div className="mb-10 pb-8 border-b border-slate-100">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                <Activity className="w-8 h-8 text-indigo-500" />
                {t("patientDetails")}
              </h2>
              <div className="flex items-center gap-3 mt-4">
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-sm font-bold border border-indigo-100">
                  {t("patientId")}
                </span>
                <p className="text-slate-600 font-mono font-medium text-lg">
                  {activePatient?.patientId}
                </p>
              </div>
            </div>

            {activePatient && <PatientDetailView patient={activePatient} t={t} />}
          </div>
        )}

      </div>
    </div>
  );
}