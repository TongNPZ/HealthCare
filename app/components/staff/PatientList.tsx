import React from "react";
import { PatientCard } from "./PatientCard";
import { PatientSession } from "@/lib/types";
import { UserX } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PatientListProps {
    patients: PatientSession[];
    currentTime: number;
    onSelectPatient: (id: string) => void;
}

export const PatientList = ({ patients, currentTime, onSelectPatient }: PatientListProps) => {
    const { t } = useTranslation();

    if (patients.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <UserX className="w-10 h-10 text-slate-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-600 mb-2">{t("noActivePatients")}</h2>
                <p className="text-slate-400 font-medium">{t("waitingSubmissions")}</p>
            </div>
        );
    }

    return (
        // Changed from grid layout to flex column list layout
        <div className="flex flex-col gap-3">
            {patients.map((patient) => (
                <PatientCard
                    key={patient.patientId}
                    patient={patient}
                    currentTime={currentTime}
                    onClick={onSelectPatient}
                />
            ))}
        </div>
    );
};