// src/app/page.tsx
"use client";

import Link from "next/link";
import { Users, Activity } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-[2rem] shadow-2xl shadow-blue-900/5 p-8 md:p-12 border border-slate-100">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 rotate-3">
            <Activity className="w-10 h-10 text-white -rotate-3" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-4">
            HealthCare System
          </h1>
          <p className="text-slate-500 text-lg">
            Please select a module to access the system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ปุ่มไปหน้าสร้าง User จำลอง */}
          <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all group">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-3">
              Patient Mode
            </h2>
            <p className="text-blue-600/80 mb-8 h-12">
              Manage and simulate multiple concurrent patient sessions.
            </p>

            <Link
              href="/patient-simulator"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-colors shadow-md shadow-blue-500/20"
            >
              Enter Patient Mode
            </Link>
          </div>

          {/*  ปุ่มไปหน้า Staff Dashboard */}
          <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100 hover:border-indigo-300 hover:shadow-lg transition-all group">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-indigo-900 mb-3">
              Staff Dashboard
            </h2>
            <p className="text-indigo-600/80 mb-8 h-12">
              Real-time monitor for active patients and historical data (10 mins retention).
            </p>

            <Link
              href="/staff"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold transition-colors shadow-md shadow-indigo-500/20"
            >
              Open Live Monitor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}