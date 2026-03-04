// src/components/Header.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { HeartPulse, Globe } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  title?: string; // 💡 ใส่ ? เพื่อให้เป็น optional
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { i18n, t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === "th" ? "en" : "th";
    localStorage.setItem("appLang", newLang);
    i18n.changeLanguage(newLang);
  };

  if (!isMounted) return null;

  const currentLang = i18n.language || "th";
  // 💡 ถ้าไม่มี title ส่งมา ให้ใช้คำแปล "header" เป็นค่าเริ่มต้น
  const displayTitle = title || t("header") || "HealthCare System";

  return (
    <header className="w-full bg-white border-b border-slate-100 py-4 font-sans sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <HeartPulse className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-slate-800 leading-none">
              HealthCare+
            </h1>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">
              Medical Service
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {/* Page Title Badge */}
          <div className="hidden xs:block px-4 py-1.5 bg-slate-50 rounded-full border border-slate-200">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              {displayTitle}
            </span>
          </div>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 h-9 rounded-xl bg-white hover:bg-slate-50 transition-all text-slate-700 font-bold border border-slate-200 shadow-sm active:scale-95"
          >
            <img
              src={
                currentLang === "th"
                  ? "https://flagcdn.com/w40/th.png"
                  : "https://flagcdn.com/w40/gb.png"
              }
              alt="flag"
              className="w-5 h-3.5 object-cover rounded-sm border border-slate-200"
            />
            <span className="text-xs">
              {currentLang === "th" ? "TH" : "EN"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
