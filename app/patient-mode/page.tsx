// src/app/patient-mode/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, User, Trash2 } from "lucide-react";

export default function PatientModePage() {
  const [sessions, setSessions] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 💡 ครอบด้วย setTimeout เพื่อแก้ Error: Calling setState synchronously
    const timer = setTimeout(() => {
      setIsMounted(true);
      const saved = localStorage.getItem("mock_patient_sessions");
      if (saved) {
        setSessions(JSON.parse(saved));
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const createNewUser = () => {
    const newId =
      "USER-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    const updatedSessions = [...sessions, newId];
    setSessions(updatedSessions);
    localStorage.setItem(
      "mock_patient_sessions",
      JSON.stringify(updatedSessions),
    );

    // เปิดแท็บใหม่เพื่อจำลองอุปกรณ์ของคนละคนกัน
    window.open(`/patient?id=${newId}`, "_blank");
  };

  const clearSessions = () => {
    setSessions([]);
    localStorage.removeItem("mock_patient_sessions");
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-4xl">
        {/* ปุ่มย้อนกลับไปหน้าหลัก */}
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-6 transition-colors w-fit bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Main Menu
        </Link>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 p-6 md:p-10 border border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                Patient Simulator
              </h1>
              <p className="text-slate-500 mt-2">
                Create multiple users to test the real-time dashboard.
              </p>
            </div>

            <button
              onClick={createNewUser}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Create User {sessions.length + 1}
            </button>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">
                No active users. Click the button above to create one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {sessions.map((id, index) => (
                <div
                  key={id}
                  className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 hover:border-blue-300 transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">
                        User {index + 1}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">{id}</p>
                    </div>
                  </div>
                  <a
                    href={`/patient?id=${id}`}
                    target="_blank"
                    className="w-full text-center py-2 bg-white text-blue-600 border border-blue-200 rounded-lg text-sm font-bold hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Open Form
                  </a>
                </div>
              ))}
            </div>
          )}

          {sessions.length > 0 && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={clearSessions}
                className="flex items-center gap-2 text-sm text-rose-500 hover:text-rose-700 font-bold px-4 py-2 hover:bg-rose-50 rounded-lg transition-colors"
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
