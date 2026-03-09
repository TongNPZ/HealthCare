import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
// 💡 1. Import PatientSession to avoid using 'any'
import { PatientSession } from "@/lib/types";

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

        // Initialize empty form data so the staff dashboard can pick it up if they sweep the local storage
        const emptyFormData = {
            firstName: "", middleName: "", lastName: "", dateOfBirth: "", gender: "",
            phoneNumber: "", email: "", address: "", preferredLanguage: [],
            nationality: "", emergencyContactName: "", emergencyContactRelationship: "", religion: "",
        };
        localStorage.setItem(`formData_${newId}`, JSON.stringify(emptyFormData));

        // Notify staff dashboard that a new user is waiting
        fetch("/api/patient-update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ patientId: newId, status: "waiting", formData: emptyFormData }),
        }).catch((e) => console.error(e));
    };

    const removeSingleUser = (idToRemove: string) => {
        const isSubmitted = !!localStorage.getItem(`submitted_${idToRemove}`);

        if (isSubmitted) {
            Swal.fire({
                title: "Deletion Not Allowed!",
                text: "This record has already been submitted. To edit the information, you must open the form directly.",
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

        // Clear history in the staff dashboard card (supports single-tab testing)
        const historyStr = localStorage.getItem("staff_dashboard_history");
        if (historyStr) {
            try {
                // 💡 Replace 'any' with 'PatientSession'
                const history: Record<string, PatientSession> = JSON.parse(historyStr);
                delete history[idToRemove];
                localStorage.setItem("staff_dashboard_history", JSON.stringify(history));
            } catch (e) { }
        }

        // Notify staff dashboard to remove the card
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
        const RETENTION_TIME = 10 * 60 * 1000;

        const cleanupExpiredSessions = () => {
            setSessions(prev => {
                let isChanged = false;
                const now = Date.now();

                const validSessions = prev.filter(id => {
                    const submittedAt = localStorage.getItem(`submitted_${id}`);
                    const createdAt = localStorage.getItem(`created_${id}`);
                    let shouldRemove = false;

                    if (submittedAt) {
                        if (submittedAt === "true") {
                            shouldRemove = true;
                        } else {
                            const timePassed = now - parseInt(submittedAt);
                            if (timePassed >= RETENTION_TIME) shouldRemove = true;
                        }
                    } else if (createdAt) {
                        const timePassed = now - parseInt(createdAt);
                        if (timePassed >= RETENTION_TIME) shouldRemove = true;
                    } else {
                        shouldRemove = true;
                    }

                    if (shouldRemove) {
                        // Remove junk data from local storage
                        localStorage.removeItem(`submitted_${id}`);
                        localStorage.removeItem(`created_${id}`);
                        localStorage.removeItem(`formData_${id}`);

                        // Clear history in the staff dashboard card (supports single-tab testing)
                        const historyStr = localStorage.getItem("staff_dashboard_history");
                        if (historyStr) {
                            try {
                                // 💡 Replace 'any' with 'PatientSession'
                                const history: Record<string, PatientSession> = JSON.parse(historyStr);
                                delete history[id];
                                localStorage.setItem("staff_dashboard_history", JSON.stringify(history));
                            } catch (e) { }
                        }

                        fetch("/api/patient-update", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ patientId: id, status: "abandoned", formData: {} }),
                        }).catch(console.error);

                        isChanged = true;
                        return false;
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

        cleanupExpiredSessions();
        const interval = setInterval(cleanupExpiredSessions, 5000);
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
                title: "Cannot Delete!",
                text: "All items on this page have been successfully submitted and cannot be deleted.",
                icon: "warning",
                confirmButtonColor: "#3b82f6",
                customClass: { popup: "rounded-2xl" }
            });
            return;
        }

        if (sessionsToKeep.length > 0 && sessionsToClear.length > 0) {
            await Swal.fire({
                title: "Partial Deletion",
                text: `Successfully removed ${sessionsToClear.length} items (skipped ${sessionsToKeep.length} submitted items).`,
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

        // 💡 2. Replace 'any' with 'PatientSession' for strict typing
        let history: Record<string, PatientSession> | null = null;
        const historyStr = localStorage.getItem("staff_dashboard_history");
        if (historyStr) {
            try { history = JSON.parse(historyStr); } catch (e) { }
        }

        sessionsToClear.forEach((id) => {
            localStorage.removeItem(`submitted_${id}`);
            localStorage.removeItem(`created_${id}`);
            localStorage.removeItem(`formData_${id}`);
            if (history) delete history[id]; // Remove data from Staff cache

            fetch("/api/patient-update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ patientId: id, status: "abandoned", formData: {} }),
            }).catch((e) => console.error("Failed to clear from monitor", e));
        });

        if (history) {
            localStorage.setItem("staff_dashboard_history", JSON.stringify(history));
        }
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