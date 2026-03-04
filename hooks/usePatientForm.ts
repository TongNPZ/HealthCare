// src/hooks/usePatientForm.ts
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormSchema, PatientFormData } from "@/lib/schema";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import countries from "i18n-iso-countries";
import ISO6391 from 'iso-639-1';

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

  const { watch, reset, trigger, formState: { errors } } = formMethods;
  const allFields = watch();

  // จัดการ ID และโหลดข้อมูลเก่า
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      const urlId = searchParams.get("id");
      const currentId = urlId || "USER-" + Math.random().toString(36).substring(2, 6).toUpperCase();
      setPatientId(currentId);

      const savedData = localStorage.getItem(`saved_form_${currentId}`);
      if (savedData) {
        try { reset(JSON.parse(savedData)); } catch (e) { console.error(e); }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [reset, searchParams]);

  // Auto-save & Pusher Sync
  useEffect(() => {
    if (isMounted && !isSubmitted && patientId) {
      localStorage.setItem(`saved_form_${patientId}`, JSON.stringify(allFields));
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
      await fetch("/api/patient-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: data, status: "submitted", patientId }),
      });
      localStorage.removeItem(`saved_form_${patientId}`);
      Swal.fire({ title: t("successTitle"), icon: "success", timer: 2000, showConfirmButton: false });
    }
  };

  const nationalityOptions = useMemo(() => {
    const countryObj = countries.getNames(i18n.language === "th" ? "th" : "en", { select: "official" });
    return Object.entries(countryObj).map(([code, name]) => ({ value: name, label: name }));
  }, [i18n.language]);

  const languageOptions = useMemo(() => ISO6391.getAllNames().map(name => ({ value: name, label: name })), []);

  return { formMethods, patientId, isMounted, isSubmitted, onSubmit, t, i18n, router, nationalityOptions, languageOptions };
};