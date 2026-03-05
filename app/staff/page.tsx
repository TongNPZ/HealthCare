"use client";

import { useStaffDashboard } from "@/hooks/useStaffDashboard";
import { PatientList } from "../components/staff/PatientList";
import { PatientDetailView } from "@/app/components/staff/DetailView";
import { useTranslation } from "react-i18next";
import { ChevronLeft, LayoutDashboard } from "lucide-react";

export default function StaffPage() {
  const { patientList, activePatient, selectedId, setSelectedId, currentTime, isMounted } = useStaffDashboard();
  const { t } = useTranslation();

  // Prevent hydration errors and ensure timer is initialized
  if (!isMounted || currentTime === 0) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {!selectedId ? (
          // Main Dashboard View
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-200 pb-6 gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                  <LayoutDashboard className="text-blue-600 w-8 h-8" /> Live Monitor
                </h1>
                <p className="text-slate-500 font-medium">Auto-cleanup in 10 minutes</p>
              </div>
              <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold animate-pulse flex items-center gap-2 shadow-md shadow-blue-500/20">
                <span className="w-2 h-2 bg-white rounded-full"></span> LIVE
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
          <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={() => setSelectedId(null)}
              className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 mb-10 transition-colors bg-slate-50 hover:bg-blue-50 px-4 py-2 rounded-xl w-fit"
            >
              <ChevronLeft className="w-5 h-5" /> BACK TO LIST
            </button>
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Patient Detail</h2>
              <p className="text-blue-600 font-bold mt-2 text-lg">ID: {activePatient?.patientId}</p>
            </div>

            {activePatient && <PatientDetailView patient={activePatient} t={t} />}
          </div>
        )}

      </div>
    </div>
  );
}