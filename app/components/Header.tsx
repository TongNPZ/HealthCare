// src/components/Header.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import "@/lib/i18n";

import { HeartPulse, } from 'lucide-react';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { i18n } = useTranslation();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'th' ? 'en' : 'th';

        localStorage.setItem('appLang', newLang);

        i18n.changeLanguage(newLang);
    };

    if (!isMounted) return null;

    const currentLang = i18n.language || 'th';

    return (
        <header className="w-full bg-white border-b border-slate-100 py-6 font-sans">
            <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">


                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-indigo-50 rounded-2xl flex items-center justify-center shadow-inner border border-indigo-100 shrink-0">

                        <HeartPulse className="w-6 h-6 text-indigo-600" strokeWidth={2.5} />

                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">HealthCare+</h1>
                        <p className="text-xs font-medium text-indigo-600 uppercase tracking-widest">Medical Services</p>
                    </div>
                </div>

                <div className="flex justify-end items-center gap-3 w-full md:w-auto">
                    {/* Page Title */}
                    <div className="px-4 py-1.5 bg-slate-50 rounded-full border border-slate-200">
                        <span className="text-sm font-semibold text-slate-600">{title}</span>
                    </div>

                    <button
                        type="button"
                        onClick={toggleLanguage}
                        className="flex items-center justify-center gap-2 px-3 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 font-bold shadow-sm border border-slate-200 shrink-0"
                        title="Change Language"
                    >
                        <img
                            src={currentLang === "th" ? "https://flagcdn.com/w40/th.png" : "https://flagcdn.com/w40/gb.png"}
                            alt={currentLang === "th" ? "Thai Flag" : "UK Flag"}
                            className="w-6 h-4 object-cover rounded-[2px] shadow-sm border border-slate-200/50"
                        />
                        <span className="text-sm w-5 text-center">{currentLang === "th" ? "TH" : "EN"}</span>
                    </button>
                </div>

            </div>
        </header>
    );
};

export default Header;