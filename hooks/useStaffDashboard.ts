// src/hooks/useStaffDashboard.ts
import { useState, useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { PatientSession, PusherUpdatePayload } from "@/lib/types";

const SUBMITTED_RETENTION = 10 * 60 * 1000; // 10 minutes after form submission
const ACTIVE_RETENTION = 60 * 60 * 1000;    // 1 hour (fallback for computer sleep/disconnect)
const WAITING_RETENTION = 5 * 60 * 1000;    // 5 minutes for newly created but unfilled forms

export const useStaffDashboard = () => {
    const [patients, setPatients] = useState<Record<string, PatientSession>>({});
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isMounted, setIsMounted] = useState(false);

    // Initial load from LocalStorage to persist data upon refresh
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
                        if (now - p.lastUpdated < retentionLimit) {
                            valid[k] = p;
                        }
                    }
                    setPatients(valid);
                } catch (e) {
                    console.error(e);
                }
            }
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    // Timer for UI updates (triggers re-renders every 10 seconds for "time ago" logic)
    useEffect(() => {
        if (!isMounted) return;
        const timeInterval = setInterval(() => setCurrentTime(Date.now()), 10000);
        return () => clearInterval(timeInterval);
    }, [isMounted]);

    // Handle incoming data from Pusher and perform periodic memory cleanup
    useEffect(() => {
        if (!isMounted || !pusherClient) return;

        const channel = pusherClient.subscribe("patient-channel");

        channel.bind("form-update", (data: PusherUpdatePayload) => {
            // Fetch time once to ensure dashboard and card times match perfectly down to the millisecond
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
                        lastUpdated: now
                    }
                };
            });
        });

        // Cleanup loop running every 1 minute to remove inactive sessions
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

    // Sync state with LocalStorage for persistence
    useEffect(() => {
        if (isMounted && Object.keys(patients).length > 0) {
            localStorage.setItem("staff_dashboard_history", JSON.stringify(patients));
        } else if (isMounted && Object.keys(patients).length === 0) {
            localStorage.removeItem("staff_dashboard_history");
        }
    }, [patients, isMounted]);

    return {
        // Sort patients by most recently updated
        patientList: Object.values(patients).sort((a, b) => b.lastUpdated - a.lastUpdated),
        activePatient: selectedId ? patients[selectedId] : null,
        selectedId,
        setSelectedId,
        currentTime,
        isMounted,
    };
};