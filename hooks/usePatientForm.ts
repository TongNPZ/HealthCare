// hooks/usePatientForm.ts
import { useState, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormSchema, PatientFormData } from "@/lib/schema";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import ISO6391 from 'iso-639-1';

// 💡 1. Import ไลบรารีประเทศและไฟล์ภาษาที่ถูกต้อง
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import thLocale from "i18n-iso-countries/langs/th.json";

// 💡 2. ลงทะเบียนภาษาให้ระบบรู้จักชื่อประเทศ (ขาดบรรทัดนี้ไปทำให้ตัวเลือกหาย)
countries.registerLocale(enLocale);
countries.registerLocale(thLocale);

export const usePatientForm = () => {
  const [patientId, setPatientId] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const formMethods = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      firstName: "", middleName: "", lastName: "", dateOfBirth: "", gender: "",
      phoneNumber: "", email: "", address: "", preferredLanguage: [],
      nationality: "", emergencyContactName: "", emergencyContactRelationship: "", religion: "",
    },
  });

  const { watch, formState: { errors } } = formMethods;
  const allFields = watch();

  // 💡 สร้าง Ref เพื่อเก็บข้อมูลล่าสุด ป้องกันการส่ง abandoned ผิดจังหวะ
  const allFieldsRef = useRef(allFields);
  const isSubmittedRef = useRef(isSubmitted);

  useEffect(() => { allFieldsRef.current = allFields; }, [allFields]);
  useEffect(() => { isSubmittedRef.current = isSubmitted; }, [isSubmitted]);

  // 1. จัดการ ID และโหลดข้อมูลเก่า
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      const urlId = searchParams.get("id");
      const currentId = urlId || "USER-" + Math.random().toString(36).substring(2, 6).toUpperCase();
      setPatientId(currentId);

      // 💡 โหลดข้อมูลเก่ามาใส่ฟอร์มถ้าเคยกรอกไว้แล้ว
      const savedFormData = localStorage.getItem(`formData_${currentId}`);
      if (savedFormData) {
        try {
          const parsedData = JSON.parse(savedFormData);
          formMethods.reset(parsedData); // นำข้อมูลเดิมไปยัดใส่ช่อง Input อัตโนมัติ
        } catch (e) {
          console.error("Failed to parse saved form data", e);
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [searchParams, formMethods]); // 💡 อย่าลืมเพิ่ม formMethods เข้ามาใน Dependency Array

  // 2. Pusher Sync (ส่งข้อมูลปกติตอนกำลังพิมพ์)
  useEffect(() => {
    if (isMounted && !isSubmitted && patientId) {
      const sync = async () => {
        await fetch("/api/patient-update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formData: allFields, status: "actively filling", patientId }),
        });
      };
      sync();
    }
  }, [allFields, isMounted, isSubmitted, patientId]);

  useEffect(() => {
    const notifyAbandonment = () => {
      if (!isSubmittedRef.current && patientId) {
        // เช็กก่อนว่าเคยส่งข้อมูลฟอร์มนี้ไปแล้วหรือยัง
        const wasSubmitted = !!localStorage.getItem(`submitted_${patientId}`);

        if (wasSubmitted) {
          // 💡 กรณีเคยกด Submit ไปแล้ว (เข้าโหมด Edit แล้วเปลี่ยนใจกด Back)
          // ให้ดึงข้อมูลเก่าที่เคยเซฟไว้ ส่งกลับไปฟื้นคืนชีพในจอมอนิเตอร์
          const savedData = localStorage.getItem(`formData_${patientId}`);
          const originalData = savedData ? JSON.parse(savedData) : allFieldsRef.current;

          fetch("/api/patient-update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ formData: originalData, status: "submitted", patientId }),
            keepalive: true
          }).catch(e => console.error(e));

        } else {
          // 💡 กรณีสร้างการ์ดใหม่แต่เปลี่ยนใจไม่กรอก (กด Back ออกไปเลย)
          // 1. ลบ ID ตัวเองออกจากหน้า Patient Simulator
          const savedSessions = localStorage.getItem("mock_patient_sessions");
          if (savedSessions) {
            try {
              const sessions = JSON.parse(savedSessions);
              const updatedSessions = sessions.filter((id: string) => id !== patientId);
              if (updatedSessions.length === 0) {
                localStorage.removeItem("mock_patient_sessions");
              } else {
                localStorage.setItem("mock_patient_sessions", JSON.stringify(updatedSessions));
              }
            } catch (e) { console.error("Error updating sessions", e); }
          }

          // 2. เตะออกจากหน้า Staff Monitor
          fetch("/api/patient-update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ formData: allFieldsRef.current, status: "abandoned", patientId }),
            keepalive: true
          }).catch(e => console.error(e));
        }
      }
    };

    // ดักจับตอนปิดแท็บ หรือรีเฟรชหน้า
    window.addEventListener("beforeunload", notifyAbandonment);

    // ดักจับตอนกดย้อนกลับ (Unmount component)
    return () => {
      window.removeEventListener("beforeunload", notifyAbandonment);
      notifyAbandonment();
    };
  }, [patientId]);

  // 4. Submit Handler
  const onSubmit = async (data: PatientFormData) => {
    const result = await Swal.fire({
      title: t("confirmTitle"),
      text: t("confirmText"),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      customClass: { popup: "rounded-2xl" },
    });

    if (result.isConfirmed) {
      setIsSubmitted(true);

      localStorage.setItem(`submitted_${patientId}`, Date.now().toString());

      localStorage.setItem(`formData_${patientId}`, JSON.stringify(data));

      await fetch("/api/patient-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: data, status: "submitted", patientId }),
      });
      Swal.fire({ title: t("successTitle"), icon: "success", timer: 2000, showConfirmButton: false });
    }
  };

  const nationalityOptions = useMemo(() => {
    const countryObj = countries.getNames(i18n.language === "th" ? "th" : "en", { select: "official" });
    return Object.entries(countryObj).map(([code, name]) => ({ value: name, label: name }));
  }, [i18n.language]);

  const languageOptions = useMemo(() => ISO6391.getAllNames().map(name => ({ value: name, label: name })), []);

  const religionOptions = [
    { value: "Buddhism", label: t("buddhism") || "Buddhism" },
    { value: "Christianity", label: t("christianity") || "Christianity" },
    { value: "Islam", label: t("islam") || "Islam" },
    { value: "Hinduism", label: t("hinduism") || "Hinduism" },
    { value: "Sikhism", label: t("sikhism") || "Sikhism" },
    { value: "Others", label: t("others") || "Others" },
  ];

  return { formMethods, patientId, isMounted, isSubmitted, onSubmit, t, i18n, router, nationalityOptions, languageOptions, religionOptions };
};