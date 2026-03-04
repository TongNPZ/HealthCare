// src/app/patient/page.tsx
"use client";

import { Suspense } from "react";
import { Controller } from "react-hook-form";
import Select, { SingleValue, MultiValue } from "react-select";
import PhoneInput from "react-phone-input-2";
import DatePicker from "react-datepicker";
import { usePatientForm } from "@/hooks/usePatientForm";
import { InputField, TextAreaField, getCustomSelectStyles } from "../components/ui/FormFields";

import "react-phone-input-2/lib/style.css";
import "react-datepicker/dist/react-datepicker.css";

type SelectOption = { value: string; label: string };

function PatientFormContent() {
  const { formMethods, isMounted, isSubmitted, onSubmit, t, router, nationalityOptions, languageOptions, religionOptions } = usePatientForm();
  const { register, handleSubmit, control, formState: { errors } } = formMethods;

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      <main className="flex-1 p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <button onClick={() => router.push("/patient-mode")} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-6 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Back to User List
          </button>

          <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 p-6 md:p-12 border border-slate-100">
            {isSubmitted ? (
              <div className="text-center py-20 bg-blue-50 rounded-3xl border-2 border-dashed border-blue-200">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-blue-900 mb-2">{t("completedTitle")}</h2>
                <p className="text-blue-600 mb-8">{t("completedText")}</p>
                <button onClick={() => router.push("/patient-mode")} className="px-6 py-2.5 bg-white border-2 border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm">Return to Patient List</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">

                {/* 💡 เปิด Grid 2 คอลัมน์ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <InputField label={t("firstName")} registration={register("firstName")} error={errors.firstName?.message} placeholder={t("firstNamePlaceholder")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
                  <InputField label={t("middleName")} registration={register("middleName")} required={false} error={errors.middleName?.message} placeholder={t("optional")} />
                  <InputField label={t("lastName")} registration={register("lastName")} error={errors.lastName?.message} placeholder={t("lastNamePlaceholder")} />

                  <div className="flex flex-col gap-1.5 mb-5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">{t("dob")} *</label>
                    <Controller name="dateOfBirth" control={control} render={({ field }) => (
                      <DatePicker
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date: Date | null) => field.onChange(date ? date.toISOString().split('T')[0] : "")}
                        dateFormat="dd/MM/yyyy" placeholderText={t("selectDate")} wrapperClassName="w-full" showMonthDropdown showYearDropdown dropdownMode="select"
                        className={`w-full h-11 px-4 rounded-xl border transition-all text-slate-800 ${errors.dateOfBirth ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-slate-50/50"}`}
                      />
                    )} />
                    {errors.dateOfBirth && <span className="text-rose-500 text-xs font-medium ml-1">{errors.dateOfBirth.message}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5 mb-5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">{t("gender")} *</label>
                    <Controller name="gender" control={control} render={({ field }) => (
                      <Select
                        {...field}
                        options={[{ value: "Male", label: t("male") }, { value: "Female", label: t("female") }]}
                        value={[{ value: "Male", label: t("male") }, { value: "Female", label: t("female") }].find(c => c.value === field.value)}
                        onChange={(val) => field.onChange((val as SingleValue<{ value: string; label: string }>)?.value ?? "")}
                        styles={getCustomSelectStyles(!!errors.gender)}
                      />
                    )} />
                    {errors.gender && <span className="text-rose-500 text-xs font-medium ml-1">{errors.gender.message}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5 mb-5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                      {t("religion")} <span className="text-slate-400 font-normal text-xs">(Optional)</span>
                    </label>
                    <Controller
                      name="religion"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={religionOptions}
                          styles={getCustomSelectStyles(false)}
                          placeholder={t("selectReligion") || "Select Religion"}
                          isClearable
                          value={religionOptions.find((c) => c.value === field.value) || null}
                          onChange={(val) => field.onChange((val as SingleValue<SelectOption>)?.value ?? "")}
                        />
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 mb-5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">{t("phone")} *</label>
                    <Controller name="phoneNumber" control={control} render={({ field }) => (
                      <PhoneInput country={"th"} value={field.value} onChange={field.onChange} inputClass={`!w-full !h-11 !text-slate-800 !bg-slate-50/50 !rounded-xl ${errors.phoneNumber ? "!border-rose-300 !bg-rose-50" : "!border-slate-200"}`} />
                    )} />
                    {errors.phoneNumber && <span className="text-rose-500 text-xs font-medium ml-1">{errors.phoneNumber.message}</span>}
                  </div>

                  <InputField label={t("email")} type="email" registration={register("email")} error={errors.email?.message} placeholder="email@example.com" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />

                  <div className="flex flex-col gap-1.5 mb-5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">{t("nationality")} *</label>
                    <Controller name="nationality" control={control} render={({ field }) => (
                      <Select {...field} options={nationalityOptions} value={nationalityOptions.find(c => c.value === field.value)} onChange={(val) => field.onChange((val as SingleValue<SelectOption>)?.value ?? "")} styles={getCustomSelectStyles(!!errors.nationality)} />
                    )} />
                    {errors.nationality && <span className="text-rose-500 text-xs font-medium ml-1">{errors.nationality.message}</span>}
                  </div>

                  {/* 💡 ย้าย Language มาไว้ตรงนี้ เพื่อให้อยู่คู่ซ้ายขวากับ Nationality */}
                  <div className="flex flex-col gap-1.5 mb-5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">{t("language")} *</label>
                    <Controller name="preferredLanguage" control={control} render={({ field }) => (
                      <Select {...field} isMulti options={languageOptions} value={languageOptions.filter(lang => field.value?.includes(lang.value))} onChange={(val) => field.onChange((val as MultiValue<{ value: string; label: string }>).map(s => s.value))} styles={getCustomSelectStyles(!!errors.preferredLanguage)} />
                    )} />
                    {errors.preferredLanguage && <span className="text-rose-500 text-xs font-medium ml-1">{errors.preferredLanguage.message}</span>}
                  </div>

                </div>
                {/* 💡 ปิด Grid 2 คอลัมน์ตรงนี้ */}

                <TextAreaField label={t("address")} registration={register("address")} placeholder={t("addressPlaceholder")} error={errors.address?.message} icon={<svg className="w-5 h-5 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />

                {/* 💡 หมวด: ผู้ติดต่อฉุกเฉิน (Emergency Contact) - เอาสีพื้นหลังสีแดงออกให้คลีน */}
                <div className="pt-4 mb-8">
                  <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    Emergency Contact <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Optional</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <InputField
                      label="Contact Name"
                      required={false}
                      placeholder="e.g. Jane Doe"
                      registration={register("emergencyContactName")}
                    />
                    <InputField
                      label="Relationship"
                      required={false}
                      placeholder="e.g. Mother, Spouse"
                      registration={register("emergencyContactRelationship")}
                    />
                  </div>
                </div>

                <div className="pt-6 flex justify-center">
                  <button type="submit" className="px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center gap-2">
                    {t("submit")} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
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

export default function PatientForm() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center animate-pulse">Loading...</div>}>
      <PatientFormContent />
    </Suspense>
  );
}