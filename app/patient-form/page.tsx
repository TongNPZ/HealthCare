// src/app/patient-form/page.tsx
"use client";

import { Suspense } from "react";
import { usePatientForm } from "@/hooks/usePatientForm";

// Import separated form sections
import { PersonalInfoSection } from "../components/patient/PersonalInfoSection";
import { ContactInfoSection } from "../components/patient/ContactInfoSection";
import { EmergencyContactSection } from "../components/patient/EmergencyContactSection";

function PatientFormContent() {
  const {
    formMethods, isMounted, isSubmitted, onSubmit, t, router,
    nationalityOptions, languageOptions, religionOptions
  } = usePatientForm();

  const { register, handleSubmit, control, formState: { errors } } = formMethods;

  // Prevent hydration errors by ensuring the component is mounted on the client
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      <main className="flex-1 p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl">

          {/* Back button */}
          <button onClick={() => router.push("/patient-simulator")} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-6 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            {/* 💡 เปลี่ยนเป็น t("backToUserList") */}
            {t("backToUserList")}
          </button>

          <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 p-6 md:p-12 border border-slate-100">

            {/* Status: Displayed when form is successfully submitted */}
            {isSubmitted ? (
              <div className="text-center py-20 bg-blue-50 rounded-3xl border-2 border-dashed border-blue-200">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-blue-900 mb-2">{t("completedTitle")}</h2>
                <p className="text-blue-600 mb-8">{t("completedText")}</p>
                <button onClick={() => router.push("/patient-simulator")} className="px-6 py-2.5 bg-white border-2 border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm">
                  {/* 💡 เปลี่ยนเป็น t("returnToPatientList") */}
                  {t("returnToPatientList")}
                </button>
              </div>
            ) : (

              /* Status: Form input fields */
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">

                {/* Personal Information Section */}
                <PersonalInfoSection
                  register={register} control={control} errors={errors} t={t}
                  nationalityOptions={nationalityOptions}
                  religionOptions={religionOptions}
                  languageOptions={languageOptions}
                />

                {/* Contact Information Section */}
                <ContactInfoSection register={register} control={control} errors={errors} t={t} />

                {/* Emergency Contact Section */}
                <EmergencyContactSection register={register} control={control} errors={errors} t={t} />

                {/* Submit Button */}
                <div className="pt-6 flex justify-center border-t border-slate-100 mt-4">
                  <button type="submit" className="px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center gap-2">
                    {t("submitBtn")} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Wrapped with Suspense to handle loading states properly in Next.js
export default function PatientForm() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center animate-pulse">Loading...</div>}>
      <PatientFormContent />
    </Suspense>
  );
}