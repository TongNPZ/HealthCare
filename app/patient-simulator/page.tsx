"use client";

import Link from "next/link";
import { ChevronLeft, Plus, User, Trash2 } from "lucide-react";
import { usePatientMode } from "@/hooks/usePatientMode";
import { SimulatorPatientCard } from "../components/patient-mode/SimulatorPatientCard";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

export default function PatientModePage() {
  const {
    sessions, isMounted, createNewUser, removeSingleUser, clearSessions, router
  } = usePatientMode();

  const { t } = useTranslation();

  // Prevent hydration errors
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Navigation Back */}
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-6 transition-colors w-fit bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-200"
        >
          <ChevronLeft className="w-4 h-4" /> {t("backToMenu")}
        </Link>

        {/* Main Simulator Container */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-6 md:p-10 lg:p-12 border border-slate-100 min-h-[70vh] flex flex-col">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 border-b border-slate-100 pb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                {t("simulatorTitle")}
              </h1>
              <p className="text-slate-500 mt-2.5 font-medium text-base">
                {t("simulatorDesc")}
              </p>
            </div>

            <button
              onClick={createNewUser}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] w-full sm:w-auto shrink-0"
            >
              <Plus className="w-5 h-5" /> {t("createUserBtn")}
            </button>
          </div>

          {/* Empty State vs Grid View */}
          {sessions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-5 border border-slate-100">
                <User className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-700 mb-2">
                {t("noUsersTitle")}
              </h2>
              <p className="text-slate-500 font-medium">
                {t("noUsersDesc")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((id, index) => (
                <SimulatorPatientCard
                  key={id}
                  id={id}
                  index={index}
                  totalSessions={sessions.length}
                  removeSingleUser={removeSingleUser}
                  router={router}
                // Assuming the card handles its own translations internally or receives them via context
                />
              ))}
            </div>
          )}

          {/* Clear All Action */}
          {sessions.length > 0 && (
            <div className="mt-auto pt-10 flex justify-center sm:justify-end">
              <button
                onClick={clearSessions}
                className="flex items-center justify-center gap-2 text-sm text-rose-500 hover:text-rose-700 font-bold px-6 py-3 hover:bg-rose-50 rounded-xl transition-colors w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4" /> {t("clearAllBtn")}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}