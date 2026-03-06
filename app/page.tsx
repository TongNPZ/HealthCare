"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

export default function HomePage() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration errors by ensuring component mounts before rendering translations
  // Using setTimeout avoids the synchronous setState cascading render warning
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4 font-sans selection:bg-blue-200">
      <div className="max-w-4xl w-full bg-white rounded-[2rem] shadow-2xl shadow-blue-900/5 p-8 md:p-12 border border-slate-100 animate-in fade-in zoom-in-95 duration-500">

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 rotate-3 transition-transform hover:rotate-0 duration-300">
            <Activity className="w-10 h-10 text-white -rotate-3 transition-transform hover:rotate-0 duration-300" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">
            {t("mainTitle")}
          </h1>
          <p className="text-slate-500 text-lg max-w-lg mx-auto">
            {t("mainSubtitle")}
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Patient Simulator Module */}
          <div className="bg-gradient-to-br from-blue-50/50 to-white p-8 rounded-3xl border border-blue-100 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all group flex flex-col h-full">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <Users className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors">
              {t("patientModeBtn")}
            </h2>
            <p className="text-slate-500 mb-8 flex-1 leading-relaxed">
              {t("patientModeDesc")}
            </p>

            <Link
              href="/patient-simulator"
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-blue-100 hover:bg-blue-600 hover:border-blue-600 hover:text-white text-blue-600 py-3.5 rounded-xl font-bold transition-all shadow-sm active:scale-[0.98] mt-auto"
            >
              {t("patientModeBtn")}
            </Link>
          </div>

          {/* Staff Dashboard Module */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-white p-8 rounded-3xl border border-indigo-100 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-900/5 transition-all group flex flex-col h-full">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <Activity className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-700 transition-colors">
              {t("staffModeBtn")}
            </h2>
            <p className="text-slate-500 mb-8 flex-1 leading-relaxed">
              {t("staffModeDesc")}
            </p>

            <Link
              href="/staff"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 border-2 border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98] mt-auto"
            >
              {t("staffModeBtn")}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}