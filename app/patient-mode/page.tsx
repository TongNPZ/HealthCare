// app/patient-mode/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, User, Trash2, FileEdit, X } from "lucide-react";
import Swal from "sweetalert2";

export default function PatientModePage() {
  const [sessions, setSessions] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
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
    const newId = "USER-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    const updatedSessions = [newId, ...sessions];

    setSessions(updatedSessions);
    localStorage.setItem("mock_patient_sessions", JSON.stringify(updatedSessions));

    fetch("/api/patient-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId: newId, status: "waiting", formData: {} }),
    }).catch((e) => console.error(e));
  };

  // 💡 ฟังก์ชันลบแบบรายบุคคล (มีระบบป้องกัน)
  const removeSingleUser = (idToRemove: string) => {
    // 1. ตรวจสอบว่ากรอกเสร็จไปหรือยัง
    const isSubmitted = !!localStorage.getItem(`submitted_${idToRemove}`);

    if (isSubmitted) {
      // โชว์ Alert แล้วหยุดการลบ
      Swal.fire({
        title: "ไม่อนุญาตให้ลบ!",
        text: "รายการนี้กรอกข้อมูลเสร็จแล้ว หากต้องการแก้ไขข้อมูลต้องเปิดเข้าไปทำข้างในฟอร์มเท่านั้น",
        icon: "warning",
        confirmButtonColor: "#3b82f6",
        customClass: { popup: "rounded-2xl" }
      });
      return;
    }

    // 2. ถ้ายังไม่เสร็จ ก็ลบได้ตามปกติ
    const updatedSessions = sessions.filter(id => id !== idToRemove);
    setSessions(updatedSessions);

    if (updatedSessions.length === 0) {
      localStorage.removeItem("mock_patient_sessions");
    } else {
      localStorage.setItem("mock_patient_sessions", JSON.stringify(updatedSessions));
    }

    localStorage.removeItem(`submitted_${idToRemove}`); // ล้างขยะ

    fetch("/api/patient-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId: idToRemove, status: "abandoned", formData: {} }),
    }).catch((e) => console.error(e));
  };

  // 💡 ระบบทำลายตัวเอง: ล้างการ์ดที่ส่งไปแล้วเกิน 10 นาที
  useEffect(() => {
    if (!isMounted) return;
    const SUBMITTED_RETENTION = 10 * 60 * 1000; // 10 นาที

    const cleanupExpiredSessions = () => {
      setSessions(prev => {
        let isChanged = false;
        const now = Date.now();

        const validSessions = prev.filter(id => {
          const submittedAt = localStorage.getItem(`submitted_${id}`);
          if (submittedAt) {
            // คำนวณเวลาที่ผ่านไป
            const timePassed = now - parseInt(submittedAt);
            if (timePassed >= SUBMITTED_RETENTION) {
              // ลบข้อมูลขยะออกจากเครื่อง
              localStorage.removeItem(`submitted_${id}`);
              localStorage.removeItem(`formData_${id}`);
              isChanged = true;
              return false; // เตะออกจากรายการ
            }
          }
          return true;
        });

        if (isChanged) {
          if (validSessions.length === 0) {
            localStorage.removeItem("mock_patient_sessions");
          } else {
            localStorage.setItem("mock_patient_sessions", JSON.stringify(validSessions));
          }
          return validSessions;
        }
        return prev;
      });
    };

    // ตรวจสอบทันทีที่เปิดหน้าเว็บ และวนลูปเช็กทุกๆ 1 นาที
    cleanupExpiredSessions();
    const interval = setInterval(cleanupExpiredSessions, 60000);
    return () => clearInterval(interval);
  }, [isMounted]);

  // 💡 ฟังก์ชันลบทั้งหมด (ข้ามคนที่กรอกเสร็จแล้ว)
  const clearSessions = async () => {
    const sessionsToKeep: string[] = [];
    const sessionsToClear: string[] = [];

    // 1. คัดแยกการ์ดที่ส่งแล้ว (เก็บไว้) กับยังไม่ส่ง (ลบออก)
    sessions.forEach(id => {
      if (!!localStorage.getItem(`submitted_${id}`)) {
        sessionsToKeep.push(id);
      } else {
        sessionsToClear.push(id);
      }
    });

    // 2. ถ้าทุกการ์ดถูกส่งแล้วทั้งหมด จะไม่มีอะไรให้ลบ
    if (sessionsToKeep.length > 0 && sessionsToClear.length === 0) {
      Swal.fire({
        title: "ลบไม่ได้!",
        text: "ทุกรายการในหน้านี้กรอกข้อมูลเสร็จแล้วทั้งหมด ไม่สามารถลบได้",
        icon: "warning",
        confirmButtonColor: "#3b82f6",
        customClass: { popup: "rounded-2xl" }
      });
      return;
    }

    // 3. ถ้ามีการลบแค่บางส่วน ให้แจ้งเตือนว่าข้ามอันไหนไปบ้าง
    if (sessionsToKeep.length > 0 && sessionsToClear.length > 0) {
      await Swal.fire({
        title: "ลบข้อมูลบางส่วน",
        text: `ระบบทำการลบ ${sessionsToClear.length} รายการ (และข้าม ${sessionsToKeep.length} รายการที่ส่งฟอร์มแล้ว)`,
        icon: "info",
        confirmButtonColor: "#3b82f6",
        customClass: { popup: "rounded-2xl" }
      });
    }

    // 4. ลบจริง (เฉพาะอันที่ลบได้)
    setSessions(sessionsToKeep);
    if (sessionsToKeep.length === 0) {
      localStorage.removeItem("mock_patient_sessions");
    } else {
      localStorage.setItem("mock_patient_sessions", JSON.stringify(sessionsToKeep));
    }

    sessionsToClear.forEach((id) => {
      localStorage.removeItem(`submitted_${id}`);
      fetch("/api/patient-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: id, status: "abandoned", formData: {} }),
      }).catch((e) => console.error("Failed to clear from monitor", e));
    });
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-6 transition-colors w-fit bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Main Menu
        </Link>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 p-6 md:p-10 border border-slate-100 min-h-[70vh]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 border-b border-slate-100 pb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                Patient Simulator
              </h1>
              <p className="text-slate-500 mt-2 font-medium">Create user cards to test the real-time dashboard seamlessly.</p>
            </div>

            <button
              onClick={createNewUser}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95 shrink-0"
            >
              <Plus className="w-5 h-5" />
              Create User Card
            </button>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-slate-300" />
              </div>
              <h2 className="text-xl font-bold text-slate-600 mb-2">No active users</h2>
              <p className="text-slate-500 font-medium">Click the button above to create a new patient card.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((id, index) => {
                // เช็กสถานะเพื่อเปลี่ยนสีไอคอนและกรอบให้คนไข้ที่ลบไม่ได้
                const isSubmitted = typeof window !== 'undefined' ? !!localStorage.getItem(`submitted_${id}`) : false;

                return (
                  <div
                    key={id}
                    className={`bg-white p-6 rounded-[1.5rem] border transition-all shadow-sm flex flex-col justify-between group animate-in fade-in zoom-in-95 duration-300
                      ${isSubmitted ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 hover:border-blue-400 hover:shadow-xl'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg transition-colors
                          ${isSubmitted ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}
                        `}>
                          {sessions.length - index}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-lg">Patient</p>
                          <p className="text-xs text-slate-400 font-mono font-medium mt-0.5">ID: {id}</p>
                        </div>
                      </div>
                      {!isSubmitted && (
                        <button
                          onClick={() => removeSingleUser(id)}
                          className={`p-2 rounded-lg transition-colors
                          ${isSubmitted ? 'text-slate-300 hover:text-amber-500 hover:bg-amber-50' : 'text-slate-300 hover:text-rose-500 hover:bg-rose-50'}
                        `}
                          title="Delete this user"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => router.push(`/patient?id=${id}`)}
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
              })}
            </div>
          )}

          {sessions.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={clearSessions}
                className="flex items-center gap-2 text-sm text-rose-500 hover:text-rose-700 font-bold px-5 py-2.5 hover:bg-rose-50 rounded-xl transition-colors"
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