import { useState, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormSchema, PatientFormData } from "@/lib/schema";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

// Import country libraries and corresponding locales
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import thLocale from "i18n-iso-countries/langs/th.json";

// 💡 Import language libraries and corresponding locales
import languages from "@cospired/i18n-iso-languages";
import enLangLocale from "@cospired/i18n-iso-languages/langs/en.json";
import thLangLocale from "@cospired/i18n-iso-languages/langs/th.json";

// Register locales so the system recognizes country names
countries.registerLocale(enLocale);
countries.registerLocale(thLocale);

// 💡 Register locales so the system recognizes language names
languages.registerLocale(enLangLocale);
languages.registerLocale(thLangLocale);

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

  const allFieldsRef = useRef(allFields);
  const isSubmittedRef = useRef(isSubmitted);

  useEffect(() => { allFieldsRef.current = allFields; }, [allFields]);
  useEffect(() => { isSubmittedRef.current = isSubmitted; }, [isSubmitted]);

  // 1. Manage ID and load existing data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      const urlId = searchParams.get("id");
      const currentId = urlId || "USER-" + Math.random().toString(36).substring(2, 6).toUpperCase();
      setPatientId(currentId);

      const savedFormData = localStorage.getItem(`formData_${currentId}`);
      if (savedFormData) {
        try {
          const parsedData = JSON.parse(savedFormData);
          formMethods.reset(parsedData);
        } catch (e) {
          console.error("Failed to parse saved form data", e);
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [searchParams, formMethods]);

  // 2. Pusher Sync
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

  // 3. Handle abandonment
  useEffect(() => {
    const notifyAbandonment = () => {
      if (!isSubmittedRef.current && patientId) {
        const wasSubmitted = !!localStorage.getItem(`submitted_${patientId}`);

        if (wasSubmitted) {
          const savedData = localStorage.getItem(`formData_${patientId}`);
          const originalData = savedData ? JSON.parse(savedData) : allFieldsRef.current;

          fetch("/api/patient-update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ formData: originalData, status: "submitted", patientId }),
            keepalive: true
          }).catch(e => console.error(e));

        } else {
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
            } catch (e) {
              console.error("Error updating sessions", e);
            }
          }

          fetch("/api/patient-update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ formData: allFieldsRef.current, status: "abandoned", patientId }),
            keepalive: true
          }).catch(e => console.error(e));
        }
      }
    };

    window.addEventListener("beforeunload", notifyAbandonment);
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
      confirmButtonText: t("btnConfirm"),
      cancelButtonText: t("btnCancel"),
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

      Swal.fire({
        title: t("successTitle"),
        text: t("successText"),
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  // Country Options
  const nationalityOptions = useMemo(() => {
    const countryObj = countries.getNames(i18n.language === "th" ? "th" : "en", { select: "official" });
    return Object.entries(countryObj).map(([code, name]) => ({ value: name, label: name }));
  }, [i18n.language]);

  // 💡 Language Options (Using reliable i18n-iso-languages library)
  const languageOptions = useMemo(() => {
    const currentLang = i18n.language === "th" ? "th" : "en";
    const langObj = languages.getNames(currentLang);

    return Object.entries(langObj).map(([code, translatedName]) => ({
      // Keep English name for backend consistency (value)
      value: languages.getName(code, "en") || translatedName,
      // Show beautifully translated name to user (label)
      label: translatedName
    })).sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically
  }, [i18n.language]);

  // Religion Options
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