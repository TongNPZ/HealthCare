// src/hooks/usePatientMode.ts
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

        // 💡 1. จำเวลา "ตอนสร้างการ์ด" ไว้ เพื่อให้จับเวลาคนที่ยังไม่ได้กรอกฟอร์มได้
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

        // 💡 2. ล้างข้อมูลทุกอย่างที่เกี่ยวข้องทิ้งให้เกลี้ยง
        localStorage.removeItem(`submitted_${idToRemove}`);
        localStorage.removeItem(`created_${idToRemove}`);
        localStorage.removeItem(`formData_${idToRemove}`);

        fetch("/api/patient-update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ patientId: idToRemove, status: "abandoned", formData: {} }),
        }).catch((e) => console.error(e));
    };

    // 💡 ระบบทำลายตัวเองที่ทำงานสมบูรณ์แบบ ลิงก์กับหน้า Monitor
    useEffect(() => {
        if (!isMounted) return;

        // ⏳ เวลาที่ต้องการให้หมดอายุ (10 นาที = 10 * 60 * 1000)
        // 👉 ทริค: ถ้าอยากเทสให้เห็นผลไวๆ เปลี่ยนเป็น 10 * 1000 ก่อนได้ครับ
        const RETENTION_TIME = 10 * 60 * 1000;

        const cleanupExpiredSessions = () => {
            setSessions(prev => {
                let isChanged = false;
                const now = Date.now();

                const validSessions = prev.filter(id => {
                    // ดึงเวลาที่ส่งฟอร์ม และ เวลาที่สร้างการ์ด
                    const submittedAt = localStorage.getItem(`submitted_${id}`);
                    const createdAt = localStorage.getItem(`created_${id}`);

                    let shouldRemove = false;

                    // 💡 3. ตรวจสอบการหมดเวลา
                    if (submittedAt) {
                        if (submittedAt === "true") {
                            shouldRemove = true; // ดักจับบั๊กเก่า
                        } else {
                            const timePassed = now - parseInt(submittedAt);
                            if (timePassed >= RETENTION_TIME) shouldRemove = true;
                        }
                    } else if (createdAt) {
                        const timePassed = now - parseInt(createdAt);
                        if (timePassed >= RETENTION_TIME) shouldRemove = true;
                    } else {
                        // 💡 4. ถ้าไม่มีทั้ง 2 เวลา แสดงว่าเป็นการ์ดขยะ ให้ลบทิ้งทันที!
                        shouldRemove = true;
                    }

                    if (shouldRemove) {
                        // ลบข้อมูลขยะออกจากเครื่อง
                        localStorage.removeItem(`submitted_${id}`);
                        localStorage.removeItem(`created_${id}`);
                        localStorage.removeItem(`formData_${id}`);

                        // 💡 5. สำคัญมาก: ยิง API ไปสั่งให้ฝั่ง Monitor ลบการ์ดนี้ด้วย
                        fetch("/api/patient-update", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ patientId: id, status: "abandoned", formData: {} }),
                        }).catch(console.error);

                        isChanged = true;
                        return false; // เตะออกจากรายการหน้าจอ
                    }

                    return true; // เก็บไว้แสดงผลต่อ
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
        const interval = setInterval(cleanupExpiredSessions, 5000); // เช็กทุก 5 วิ
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