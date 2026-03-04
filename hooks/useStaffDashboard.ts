// src/hooks/useStaffDashboard.ts
import { useState, useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { PatientFormData } from "@/lib/schema";

export interface PatientSession {
    patientId: string;
    formData: PatientFormData;
    status: string;
    lastUpdated: number;
}

export interface PusherUpdatePayload {
    patientId: string;
    formData: PatientFormData;
    status: string;
}

const SUBMITTED_RETENTION = 10 * 60 * 1000; // 10 นาทีหลังจากส่งฟอร์ม
const ACTIVE_RETENTION = 60 * 60 * 1000;    // 1 ชั่วโมง (กันคอมดับ/เน็ตหลุด)
const WAITING_RETENTION = 5 * 60 * 1000;    // 5 นาที สำหรับคนที่เพิ่งกด Create แต่ยังไม่กรอก

export const useStaffDashboard = () => {
    const [patients, setPatients] = useState<Record<string, PatientSession>>({});
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isMounted, setIsMounted] = useState(false);

    // Initial Load จาก LocalStorage
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounted(true);
            setCurrentTime(Date.now());
            const saved = localStorage.getItem("staff_dashboard_history");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    const now = Date.now();
                    const valid: Record<string, PatientSession> = {};
                    for (const k in parsed) {
                        const p = parsed[k];
                        const retentionLimit = p.status === "submitted" ? SUBMITTED_RETENTION : (p.status === "waiting" ? WAITING_RETENTION : ACTIVE_RETENTION);
                        if (now - p.lastUpdated < retentionLimit) valid[k] = p;
                    }
                    setPatients(valid);
                } catch (e) { console.error(e); }
            }
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // ตัวนับเวลาสำหรับ UI (อัปเดตทุก 10 วิ)
    useEffect(() => {
        if (!isMounted) return;
        const timeInterval = setInterval(() => setCurrentTime(Date.now()), 10000);
        return () => clearInterval(timeInterval);
    }, [isMounted]);

    // รับข้อมูลจาก Pusher และล้างข้อมูลขยะ
    useEffect(() => {
        if (!isMounted || !pusherClient) return;

        const channel = pusherClient.subscribe("patient-channel");

        // ในไฟล์ hooks/useStaffDashboard.ts

        channel.bind("form-update", (data: PusherUpdatePayload) => {
            // 💡 1. ดึงเวลามาแค่ครั้งเดียว เพื่อให้เวลาของบอร์ดกับการ์ดตรงกันเป๊ะระดับมิลลิวินาที
            const now = Date.now();

            setCurrentTime(now);

            setPatients(prev => {
                if (data.status === "abandoned") {
                    const next = { ...prev };
                    delete next[data.patientId];
                    if (selectedId === data.patientId) setSelectedId(null);
                    return next;
                }

                return {
                    ...prev,
                    [data.patientId]: {
                        patientId: data.patientId,
                        formData: data.formData,
                        status: data.status,
                        lastUpdated: now // 💡 2. ใช้ตัวแปร now ตัวเดียวกัน
                    }
                };
            });
        });

        // Loop ล้างข้อมูลขยะทุก 1 นาที
        const cleanupInterval = setInterval(() => {
            setPatients(prev => {
                const now = Date.now();
                const next = { ...prev };
                let changed = false;

                for (const k in next) {
                    const p = next[k];
                    const retentionLimit = p.status === "submitted" ? SUBMITTED_RETENTION : (p.status === "waiting" ? WAITING_RETENTION : ACTIVE_RETENTION);

                    if (now - p.lastUpdated >= retentionLimit) {
                        delete next[k];
                        changed = true;
                        if (selectedId === k) setSelectedId(null);
                    }
                }
                return changed ? next : prev;
            });
        }, 60000);

        return () => {
            pusherClient?.unsubscribe("patient-channel");
            clearInterval(cleanupInterval);
        };
    }, [isMounted, selectedId]);

    // เซฟประวัติลง LocalStorage
    useEffect(() => {
        if (isMounted && Object.keys(patients).length > 0) {
            localStorage.setItem("staff_dashboard_history", JSON.stringify(patients));
        } else if (isMounted && Object.keys(patients).length === 0) {
            localStorage.removeItem("staff_dashboard_history");
        }
    }, [patients, isMounted]);

    return {
        patientList: Object.values(patients).sort((a, b) => b.lastUpdated - a.lastUpdated),
        activePatient: selectedId ? patients[selectedId] : null,
        selectedId,
        setSelectedId,
        currentTime,
        isMounted,
    };
};