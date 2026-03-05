"use client";

import Link from "next/link";
import { ChevronLeft, Plus, User, Trash2 } from "lucide-react";
import { usePatientMode } from "@/hooks/usePatientMode";
// Update the import path and component name
import { SimulatorPatientCard } from "../components/patient-mode/SimulatorPatientCard";

export default function PatientModePage() {
  const {
    sessions, isMounted, createNewUser, removeSingleUser, clearSessions, router
  } = usePatientMode();

  // Prevent hydration errors
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl">
        {/* Navigation Back */}
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-6 transition-colors w-fit bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Main Menu
        </Link>

        {/* Main Simulator Card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 p-6 md:p-10 border border-slate-100 min-h-[70vh]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 border-b border-slate-100 pb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                Patient Simulator
              </h1>
              <p className="text-slate-500 mt-2 font-medium">Create user cards to test the real-time dashboard seamlessly.</p>
            </div>

            <button
              onClick={createNewUser}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95 shrink-0"
            >
              <Plus className="w-5 h-5" /> Create User Card
            </button>
          </div>

          {/* Empty State vs Grid View */}
          {sessions.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-slate-300" />
              </div>
              <h2 className="text-xl font-bold text-slate-600 mb-2">No active users</h2>
              <p className="text-slate-500 font-medium">Click the button above to create a new patient card.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Use the new component name here */}
              {sessions.map((id, index) => (
                <SimulatorPatientCard
                  key={id}
                  id={id}
                  index={index}
                  totalSessions={sessions.length}
                  removeSingleUser={removeSingleUser}
                  router={router}
                />
              ))}
            </div>
          )}

          {/* Clear All Action */}
          {sessions.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={clearSessions}
                className="flex items-center gap-2 text-sm text-rose-500 hover:text-rose-700 font-bold px-5 py-2.5 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Clear All Users
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}