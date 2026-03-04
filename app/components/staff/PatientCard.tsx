// src/components/staff/PatientCard.tsx
import { User } from "lucide-react";
import { PatientSession } from "@/lib/types";

interface PatientCardProps {
  patient: PatientSession;
  currentTime: number;
  onClick: () => void;
  t: (key: string) => string;
  statusBadge: (status: string) => React.ReactNode;
}

export const PatientCard = ({
  patient,
  currentTime,
  onClick,
  t,
  statusBadge,
}: PatientCardProps) => {
  // 💡 แก้สูตรการคำนวณบรรทัดนี้: หาผลลัพธ์ออกมาก่อน ถ้าติดลบให้ปัดเป็น 0
  const timeAgo = Math.max(0, Math.floor((currentTime - patient.lastUpdated) / 60000));

  const isExpiredSoon = timeAgo >= 8;

  return (
    <div
      onClick={onClick}
      className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-indigo-400 cursor-pointer transition-all flex flex-col min-h-[160px]"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
        {isExpiredSoon && (
          <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-md animate-pulse">
            EXPIRING
          </span>
        )}
      </div>
      <h3 className="font-bold text-slate-800 truncate mb-1">
        {patient.formData.firstName
          ? `${patient.formData.firstName} ${patient.formData.lastName || ""}`
          : patient.patientId}
      </h3>
      <div className="flex items-center justify-between mt-auto">
        {statusBadge(patient.status)}
        <span className="text-[10px] text-slate-400 font-bold">
          {timeAgo}m ago
        </span>
      </div>
    </div>
  );
};