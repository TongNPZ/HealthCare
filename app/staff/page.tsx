// src/app/staff/staff-page.tsx
"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { PatientFormData } from "@/lib/schema";
import Header from "../components/Header";

import "@/lib/i18n";
import { useTranslation } from "react-i18next";

const DataRow = ({ label, value, tFallback }: { label: string; value?: string, tFallback: string }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 px-5 mb-3 rounded-2xl bg-white/60 border border-slate-100 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all">
        <span className="text-sm font-semibold text-slate-500 mb-1 sm:mb-0">{label}</span>
        <span className={`text-sm sm:text-base font-bold text-left sm:text-right ${value ? "text-slate-800" : "text-slate-400 italic"}`}>
            {value || tFallback}
        </span>
    </div>
);

export default function StaffPage() {
    const [patientData, setPatientData] = useState<Partial<PatientFormData>>({});
    const [status, setStatus] = useState<string>("Waiting for patient...");
    const [isMounted, setIsMounted] = useState<boolean>(false);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!pusherClient) return;

        const channel = pusherClient.subscribe("patient-channel");
        channel.bind("form-update", (data: { formData: PatientFormData; status: string }) => {
            setPatientData(data.formData);
            setStatus(data.status);
        });

        return () => {
            if (pusherClient) pusherClient.unsubscribe("patient-channel");
        };
    }, []);

    const getStatusBadge = () => {
        switch (status) {
            case "submitted":
                return (
                    <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold shadow-sm shadow-emerald-200/50 border border-emerald-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {t('statusSubmitted')}
                    </span>
                );
            case "actively filling":
                return (
                    <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-bold shadow-sm shadow-blue-200/50 border border-blue-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                        {t('statusFilling')}
                    </span>
                );
            case "inactive":
                return (
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-bold border border-slate-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                        {t('statusInactive')}
                    </span>
                );
            default:
                return (
                    <span className="px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-bold shadow-sm shadow-amber-200/50 border border-amber-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        {t('statusWaiting')}
                    </span>
                );
        }
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative">
            <Header title={t('header')} />

            <main className="flex-1 p-4 md:p-8 flex justify-center items-start pb-20">

                <div className="w-full max-w-6xl bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-6 md:p-12 border border-slate-100">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 pb-8 border-b border-slate-100">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3 flex-wrap">
                                {t('liveMonitor')}
                                <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-lg font-bold">{t('realtime')}</span>
                            </h1>
                            <p className="text-sm md:text-base text-slate-500 mt-2 font-medium">{t('watchProgress')}</p>
                        </div>
                        <div className="w-full md:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50 px-5 py-4 sm:py-3 rounded-2xl border border-slate-100">
                            <span className="text-sm font-bold text-slate-500">{t('currentStatus')}</span>
                            {getStatusBadge()}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        <div className="bg-slate-50/50 p-5 md:p-8 rounded-[1.5rem] border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                </div>
                                <h2 className="text-xl font-black text-slate-800">{t('personalInfo')}</h2>
                            </div>

                            <div className="space-y-1">
                                <DataRow label={t('firstName')} value={patientData.firstName} tFallback={t('waiting')} />
                                <DataRow label={t('middleName')} value={patientData.middleName} tFallback={t('notProvided')} />
                                <DataRow label={t('lastName')} value={patientData.lastName} tFallback={t('waiting')} />
                                <DataRow label={t('dob')} value={patientData.dateOfBirth} tFallback={t('waiting')} />
                                <DataRow label={t('gender')} value={patientData.gender} tFallback={t('waiting')} />
                                <DataRow label={t('nationality')} value={patientData.nationality} tFallback={t('waiting')} />
                            </div>
                        </div>

                        <div className="bg-slate-50/50 p-5 md:p-8 rounded-[1.5rem] border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                </div>
                                <h2 className="text-xl font-black text-slate-800">{t('contactInfo')}</h2>
                            </div>

                            <div className="space-y-1">
                                <DataRow label={t('phone')} value={patientData.phoneNumber} tFallback={t('waiting')} />
                                <DataRow label={t('email')} value={patientData.email} tFallback={t('waiting')} />
                                <DataRow label={t('address')} value={patientData.address} tFallback={t('waiting')} />
                                <DataRow
                                    label={t('language')}
                                    value={Array.isArray(patientData.preferredLanguage) ? patientData.preferredLanguage.join(", ") : patientData.preferredLanguage}
                                    tFallback={t('waiting')}
                                />
                            </div>

                            <div className="flex items-center gap-3 mb-6 mt-10">
                                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                </div>
                                <h2 className="text-xl font-black text-slate-800">{t('emergencyContact')}</h2>
                            </div>

                            <div className="space-y-1">
                                <DataRow label={t('contactName')} value={patientData.emergencyContactName} tFallback={t('notProvided')} />
                                <DataRow label={t('relationship')} value={patientData.emergencyContactRelationship} tFallback={t('notProvided')} />
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}