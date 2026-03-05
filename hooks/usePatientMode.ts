import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export const usePatientMode = () => {
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

        // Store creation time to track users who haven't filled out the form yet
        localStorage.setItem(`created_${newId}`, Date.now().toString());

        fetch("/api/patient-update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ patientId: newId, status: "waiting", formData: {} }),
        }).catch((e) => console.error(e));
    };

    const removeSingleUser = (idToRemove: string) => {
        const isSubmitted = !!localStorage.getItem(`submitted_${idToRemove}`);

        if (isSubmitted) {
            Swal.fire({
                title: "ไม่อนุญาตให้ลบ!",
                text: "รายการนี้กรอกข้อมูลเสร็จแล้ว หากต้องการแก้ไขข้อมูลต้องเปิดเข้าไปทำข้างในฟอร์มเท่านั้น",
                icon: "warning",
                confirmButtonColor: "#3b82f6",
                customClass: { popup: "rounded-2xl" }
            });
            return;
        }

        const updatedSessions = sessions.filter(id => id !== idToRemove);
        setSessions(updatedSessions);

        if (updatedSessions.length === 0) {
            localStorage.removeItem("mock_patient_sessions");
        } else {
            localStorage.setItem("mock_patient_sessions", JSON.stringify(updatedSessions));
        }

        // Clear all related data completely
        localStorage.removeItem(`submitted_${idToRemove}`);
        localStorage.removeItem(`created_${idToRemove}`);
        localStorage.removeItem(`formData_${idToRemove}`);

        fetch("/api/patient-update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ patientId: idToRemove, status: "abandoned", formData: {} }),
        }).catch((e) => console.error(e));
    };

    // Self-destruct system linked to the Monitor page
    useEffect(() => {
        if (!isMounted) return;

        // Retention time before expiration (10 minutes = 10 * 60 * 1000)
        // Tip: For quick testing, change to 10 * 1000
        const RETENTION_TIME = 10 * 60 * 1000;

        const cleanupExpiredSessions = () => {
            setSessions(prev => {
                let isChanged = false;
                const now = Date.now();

                const validSessions = prev.filter(id => {
                    // Retrieve submission and creation times
                    const submittedAt = localStorage.getItem(`submitted_${id}`);
                    const createdAt = localStorage.getItem(`created_${id}`);

                    let shouldRemove = false;

                    // Check for expiration
                    if (submittedAt) {
                        if (submittedAt === "true") {
                            shouldRemove = true; // Handle legacy boolean bug
                        } else {
                            const timePassed = now - parseInt(submittedAt);
                            if (timePassed >= RETENTION_TIME) shouldRemove = true;
                        }
                    } else if (createdAt) {
                        const timePassed = now - parseInt(createdAt);
                        if (timePassed >= RETENTION_TIME) shouldRemove = true;
                    } else {
                        // If neither time exists, it's a ghost card, remove immediately
                        shouldRemove = true;
                    }

                    if (shouldRemove) {
                        // Remove junk data from local storage
                        localStorage.removeItem(`submitted_${id}`);
                        localStorage.removeItem(`created_${id}`);
                        localStorage.removeItem(`formData_${id}`);

                        // Crucial: Send API request to instruct Monitor to delete this card
                        fetch("/api/patient-update", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ patientId: id, status: "abandoned", formData: {} }),
                        }).catch(console.error);

                        isChanged = true;
                        return false; // Remove from UI list
                    }

                    return true; // Keep displaying
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

        cleanupExpiredSessions();
        const interval = setInterval(cleanupExpiredSessions, 5000); // Check every 5 seconds
        return () => clearInterval(interval);
    }, [isMounted]);

    const clearSessions = async () => {
        const sessionsToKeep: string[] = [];
        const sessionsToClear: string[] = [];

        sessions.forEach(id => {
            if (!!localStorage.getItem(`submitted_${id}`)) {
                sessionsToKeep.push(id);
            } else {
                sessionsToClear.push(id);
            }
        });

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

        if (sessionsToKeep.length > 0 && sessionsToClear.length > 0) {
            await Swal.fire({
                title: "ลบข้อมูลบางส่วน",
                text: `ระบบทำการลบ ${sessionsToClear.length} รายการ (และข้าม ${sessionsToKeep.length} รายการที่ส่งฟอร์มแล้ว)`,
                icon: "info",
                confirmButtonColor: "#3b82f6",
                customClass: { popup: "rounded-2xl" }
            });
        }

        setSessions(sessionsToKeep);
        if (sessionsToKeep.length === 0) {
            localStorage.removeItem("mock_patient_sessions");
        } else {
            localStorage.setItem("mock_patient_sessions", JSON.stringify(sessionsToKeep));
        }

        sessionsToClear.forEach((id) => {
            localStorage.removeItem(`submitted_${id}`);
            localStorage.removeItem(`created_${id}`);
            fetch("/api/patient-update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ patientId: id, status: "abandoned", formData: {} }),
            }).catch((e) => console.error("Failed to clear from monitor", e));
        });
    };

    return {
        sessions,
        isMounted,
        createNewUser,
        removeSingleUser,
        clearSessions,
        router
    };
};