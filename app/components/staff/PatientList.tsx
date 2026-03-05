// src/app/components/staff/PatientList.tsx
import React from "react";
import { PatientCard } from "./PatientCard";
// 💡 ดึง Type มาจากไฟล์กลาง
import { PatientListProps } from "@/lib/types";

// 💡 มีการ export const PatientList ตรงนี้ ซึ่งหน้า staff/page.tsx จะดึงไปใช้ครับ
export const PatientList = ({ patients, currentTime, onSelectPatient }: PatientListProps) => {
    if (patients.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-500">No active patients</h3>
                <p className="text-slate-400 mt-2">Waiting for new form submissions...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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