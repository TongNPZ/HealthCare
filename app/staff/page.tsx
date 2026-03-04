// src/app/staff/page.tsx
"use client";

import { useStaffDashboard } from "../../hooks/useStaffDashboard";
import { PatientDetailView } from "../components/staff/DetailView";
import { useTranslation } from "react-i18next";
import { User, Clock, ChevronLeft, LayoutDashboard } from "lucide-react";

export default function StaffPage() {
  const { patientList, activePatient, selectedId, setSelectedId, currentTime, isMounted } = useStaffDashboard();
  const { t } = useTranslation();

  if (!isMounted || currentTime === 0) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {!selectedId ? (
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-slate-200 pb-6">
              <div>
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                  <LayoutDashboard className="text-blue-600 w-8 h-8" /> Live Monitor
                </h1>
                <p className="text-slate-500 font-medium">Auto-cleanup in 10 minutes</p>
              </div>
              <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold animate-pulse">LIVE</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {patientList.map((p) => (
                <div key={p.patientId} onClick={() => setSelectedId(p.patientId)} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 cursor-pointer transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <User className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{Math.floor((currentTime - p.lastUpdated) / 60000)}m ago</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg truncate">
                    {p.formData.firstName ? `${p.formData.firstName} ${p.formData.lastName}` : p.patientId}
                  </h3>
                  <div className="mt-4 flex items-center justify-between">
                     <span className={`text-[10px] font-black px-3 py-1 rounded-lg border ${p.status === 'submitted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {p.status.toUpperCase()}
                     </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100">
            <button onClick={() => setSelectedId(null)} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 mb-10 transition-colors">
              <ChevronLeft className="w-4 h-4" /> BACK TO LIST
            </button>
            <div className="mb-12">
              <h2 className="text-4xl font-black text-slate-800 tracking-tight">Patient Detail</h2>
              <p className="text-blue-600 font-bold mt-2">ID: {activePatient?.patientId}</p>
            </div>
            {activePatient && <PatientDetailView patient={activePatient} t={t} />}
          </div>
        )}
      </div>
    </div>
  );
}