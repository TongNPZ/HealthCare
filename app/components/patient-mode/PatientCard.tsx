// src/app/components/patient-mode/PatientCard.tsx
import { X, FileEdit } from "lucide-react";
import { useRouter } from "next/navigation";

interface PatientCardProps {
    id: string;
    index: number;
    totalSessions: number;
    removeSingleUser: (id: string) => void;
    router: ReturnType<typeof useRouter>;
}

export const PatientCard = ({ id, index, totalSessions, removeSingleUser, router }: PatientCardProps) => {
    const isSubmitted = typeof window !== 'undefined' ? !!localStorage.getItem(`submitted_${id}`) : false;

    return (
        <div
            className={`bg-white p-6 rounded-[1.5rem] border transition-all shadow-sm flex flex-col justify-between group animate-in fade-in zoom-in-95 duration-300
        ${isSubmitted ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 hover:border-blue-400 hover:shadow-xl'}
      `}
        >
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg transition-colors
            ${isSubmitted ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}
          `}>
                        {totalSessions - index}
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 text-lg">Patient</p>
                        <p className="text-xs text-slate-400 font-mono font-medium mt-0.5">ID: {id}</p>
                    </div>
                </div>
                {!isSubmitted && (
                    <button
                        onClick={() => removeSingleUser(id)}
                        className="p-2 rounded-lg transition-colors text-slate-300 hover:text-rose-500 hover:bg-rose-50"
                        title="Delete this user"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
            <button
                // 💡 อัปเดต Path ให้ชี้ไปที่ /patient-form แทน /patient
                onClick={() => router.push(`/patient-form?id=${id}`)}
                className={`w-full flex items-center justify-center gap-2 py-3 font-bold rounded-xl transition-all border
          ${isSubmitted
                        ? 'bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white border-amber-200'
                        : 'bg-slate-50 text-slate-700 hover:bg-blue-600 hover:text-white border-slate-100'}
        `}
            >
                <FileEdit className="w-4 h-4" />
                {isSubmitted ? 'Edit Form' : 'Fill Form'}
            </button>
        </div>
    );
};