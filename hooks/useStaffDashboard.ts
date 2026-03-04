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

const RETENTION_TIME = 10 * 60 * 1000;

export const useStaffDashboard = () => {
    const [patients, setPatients] = useState<Record<string, PatientSession>>({});
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isMounted, setIsMounted] = useState(false);

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
                        if (now - parsed[k].lastUpdated < RETENTION_TIME) valid[k] = parsed[k];
                    }
                    setPatients(valid);
                } catch (e) { console.error(e); }
            }
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        const timeInterval = setInterval(() => setCurrentTime(Date.now()), 10000);
        return () => clearInterval(timeInterval);
    }, [isMounted]);

    useEffect(() => {
        if (!isMounted || !pusherClient) return;
        const channel = pusherClient.subscribe("patient-channel");
        channel.bind("form-update", (data: PatientSession) => {
            setPatients(prev => ({
                ...prev,
                [data.patientId]: { ...data, lastUpdated: Date.now() }
            }));
        });
        return () => { pusherClient?.unsubscribe("patient-channel"); };
    }, [isMounted]);

    useEffect(() => {
        if (isMounted && Object.keys(patients).length > 0) {
            localStorage.setItem("staff_dashboard_history", JSON.stringify(patients));
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