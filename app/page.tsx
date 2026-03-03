// src/app/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, Controller, UseFormRegisterReturn, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormSchema, PatientFormData } from "@/lib/schema";
import Swal from 'sweetalert2';
import Header from "./components/Header";

import "@/lib/i18n";
import { useTranslation } from "react-i18next";

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select, { StylesConfig, SingleValue, MultiValue } from 'react-select';
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import thLocale from "i18n-iso-countries/langs/th.json";
import ISO6391 from 'iso-639-1';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

countries.registerLocale(enLocale);
countries.registerLocale(thLocale);

interface InputFieldProps {
  label: string;
  required?: boolean;
  type?: string;
  error?: string;
  placeholder?: string;
  registration: UseFormRegisterReturn<Path<PatientFormData>>;
  icon?: React.ReactNode;
}

type TextAreaFieldProps = Omit<InputFieldProps, 'type'>;

interface SelectOption {
  value: string;
  label: string;
}

const getCustomSelectStyles = (hasError: boolean): StylesConfig<SelectOption, boolean> => ({
  control: (base, state) => ({
    ...base,
    borderRadius: '0.75rem',
    minHeight: '44px',
    borderColor: hasError ? '#fca5a5' : (state.isFocused ? '#3b82f6' : '#e2e8f0'),
    backgroundColor: hasError ? '#fef2f2' : (state.isFocused ? '#ffffff' : '#f8fafc80'),
    boxShadow: state.isFocused ? (hasError ? '0 0 0 4px rgba(244, 63, 94, 0.1)' : '0 0 0 4px rgba(59, 130, 246, 0.1)') : 'none',
    '&:hover': { borderColor: hasError ? '#f43f5e' : '#93c5fd' },
    transition: 'all 0.2s ease',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '0.75rem',
    overflow: 'hidden',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'transparent',
    color: state.isSelected ? 'white' : '#334155',
    cursor: 'pointer',
    '&:active': { backgroundColor: '#2563eb' },
  })
});

const InputField = ({ label, required = true, type = "text", error, registration, placeholder, icon }: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-1.5 mb-5">
      <label className="text-sm font-semibold text-slate-700 ml-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          {...registration}
          placeholder={placeholder}
          className={`h-11 w-full rounded-xl border transition-all duration-200 outline-none
            ${icon ? 'pl-10 pr-4' : 'px-4'}
            ${error
              ? "border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
              : "border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 hover:border-blue-300"
            }
            ${type === 'date' ? 'text-slate-600 [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer' : ''}
          `}
        />
      </div>
      {error && <span className="text-rose-500 text-xs font-medium ml-1">{error}</span>}
    </div>
  );
}

const TextAreaField = ({ label, required = true, error, registration, placeholder, icon }: TextAreaFieldProps) => {
  return (
    <div className="flex flex-col gap-1.5 mb-5">
      <label className="text-sm font-semibold text-slate-700 ml-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-4 text-slate-400">
            {icon}
          </div>
        )}
        <textarea
          {...registration}
          placeholder={placeholder}
          rows={3}
          className={`w-full p-4 rounded-xl border transition-all duration-200 outline-none resize-none
            ${icon ? 'pl-10' : ''}
            ${error
              ? "border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
              : "border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 hover:border-blue-300"
            }`}
        />
      </div>
      {error && <span className="text-rose-500 text-xs font-medium ml-1">{error}</span>}
    </div>
  );
}

export default function PatientForm() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const genderOptions: SelectOption[] = [
    { value: "Male", label: t('male') },
    { value: "Female", label: t('female') }
  ];

  const nationalityOptions = useMemo<SelectOption[]>(() => {
    const currentLang = i18n.language === 'th' ? 'th' : 'en';
    const countryObj = countries.getNames(currentLang, { select: "official" });
    return Object.entries(countryObj).map(([code, name]) => ({
      value: name,
      label: name
    }));
  }, [i18n.language]);

  const languageOptions = useMemo<SelectOption[]>(() => {
    return ISO6391.getAllNames().map(name => ({ value: name, label: name }));
  }, []);

  const { register, handleSubmit, watch, control, trigger, formState: { errors } } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      firstName: "", middleName: "", lastName: "", dateOfBirth: "", gender: "",
      phoneNumber: "", email: "", address: "", preferredLanguage: [],
      nationality: "", emergencyContactName: "", emergencyContactRelationship: "", religion: "",
    },
  });

  const allFields = watch();

  useEffect(() => {
    const errorKeys = Object.keys(errors) as (keyof PatientFormData)[];
    if (errorKeys.length > 0) {
      trigger(errorKeys);
    }

  }, [i18n.language]);

  useEffect(() => {
    if (isSubmitted || !isMounted) return;
    const syncData = async (status: string) => {
      await fetch("/api/patient-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: allFields, status }),
      });
    };
    syncData("actively filling");
    const timeoutId = setTimeout(() => syncData("inactive"), 2000);
    return () => clearTimeout(timeoutId);
  }, [JSON.stringify(allFields), isSubmitted, isMounted]);

  const onSubmit = (data: PatientFormData) => {
    Swal.fire({
      title: t('confirmTitle'),
      text: t('confirmText'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#ff3939',
      confirmButtonText: t('btnConfirm'),
      cancelButtonText: t('btnCancel'),
      customClass: { popup: 'rounded-2xl' }
    }).then((result) => {
      if (result.isConfirmed) {
        setIsSubmitted(true);
        fetch("/api/patient-update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formData: data, status: "submitted" }),
        });

        Swal.fire({
          title: t('successTitle'),
          text: t('successText'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
          customClass: { popup: 'rounded-2xl' }
        });
      }
    });
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      <Header title={t('header')} />

      <main className="flex-1 p-4 md:p-8 flex justify-center items-start">
        <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 p-6 md:p-12 border border-slate-100">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800">{t('personalInfo')}</h2>
            <p className="text-slate-500">{t('subtitle')}</p>
          </div>

          {isSubmitted ? (
            <div className="text-center py-20 bg-blue-50 rounded-3xl border-2 border-dashed border-blue-200">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-blue-900 mb-2">{t('completedTitle')}</h2>
              <p className="text-blue-600">{t('completedText')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <InputField
                  label={t('firstName')}
                  registration={register("firstName")}
                  error={errors.firstName?.message}
                  placeholder={t('firstNamePlaceholder')}
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}
                />
                <InputField label={t('middleName')} registration={register("middleName")} required={false} error={errors.middleName?.message} placeholder={t('optional')} />
                <InputField label={t('lastName')} registration={register("lastName")} error={errors.lastName?.message} placeholder={t('lastNamePlaceholder')} />

                <div className="flex flex-col gap-1.5 mb-5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">{t('dob')} <span className="text-rose-500">*</span></label>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date: Date | null) => {
                          if (date) {
                            const yyyy = date.getFullYear();
                            const mm = String(date.getMonth() + 1).padStart(2, '0');
                            const dd = String(date.getDate()).padStart(2, '0');
                            field.onChange(`${yyyy}-${mm}-${dd}`);
                          } else {
                            field.onChange("");
                          }
                        }}

                        maxDate={new Date(new Date().getFullYear(), 11, 31)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText={t('selectDate')}
                        wrapperClassName="w-full"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className={`w-full h-11 px-4 rounded-xl border transition-all duration-200 outline-none
                          ${errors.dateOfBirth
                            ? "border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                            : "border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 hover:border-blue-300"
                          }`}
                      />
                    )}
                  />
                  {errors.dateOfBirth && <span className="text-rose-500 text-xs font-medium ml-1">{errors.dateOfBirth.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5 mb-5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">{t('gender')} <span className="text-rose-500">*</span></label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={genderOptions}
                        value={genderOptions.find(c => c.value === field.value)}
                        onChange={(val) => field.onChange((val as SingleValue<SelectOption>)?.value ?? "")}
                        placeholder={t('selectGender')}
                        instanceId="gender-select"
                        className="text-sm"
                        styles={getCustomSelectStyles(!!errors.gender)}
                      />
                    )}
                  />
                  {errors.gender && <span className="text-rose-500 text-xs font-medium ml-1">{errors.gender.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5 mb-5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">{t('phone')} <span className="text-rose-500">*</span></label>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <PhoneInput
                        country={'th'}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        containerClass="!w-full"
                        inputClass="!w-full !h-11 !text-base !border-slate-200 !bg-slate-50/50 !rounded-xl focus:!border-blue-500 focus:!ring-4 focus:!ring-blue-500/10 hover:!border-blue-300 transition-all duration-200"
                        buttonClass="!border-slate-200 !rounded-l-xl !bg-slate-100"
                        placeholder={t('phone')}
                      />
                    )}
                  />
                  {errors.phoneNumber && <span className="text-rose-500 text-xs font-medium ml-1">{errors.phoneNumber.message}</span>}
                </div>

                <InputField
                  label={t('email')}
                  type="email"
                  registration={register("email")}
                  error={errors.email?.message}
                  placeholder="email@example.com"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>}
                />

                <div className="flex flex-col gap-1.5 mb-5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">{t('nationality')} <span className="text-rose-500">*</span></label>
                  <Controller
                    name="nationality"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={nationalityOptions}
                        value={nationalityOptions.find(c => c.value === field.value)}
                        onChange={(val) => field.onChange((val as SingleValue<SelectOption>)?.value ?? "")}
                        placeholder={t('searchCountry')}
                        instanceId="nat-select"
                        className="text-sm"
                        styles={getCustomSelectStyles(!!errors.nationality)}
                      />
                    )}
                  />
                  {errors.nationality && <span className="text-rose-500 text-xs font-medium ml-1">{errors.nationality.message}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-5">
                <label className="text-sm font-semibold text-slate-700 ml-1">{t('language')} <span className="text-rose-500">*</span></label>
                <Controller
                  name="preferredLanguage"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      options={languageOptions}
                      value={languageOptions.filter(lang => field.value?.includes(lang.value))}
                      onChange={(val) => {
                        const selected = val as MultiValue<SelectOption>;
                        field.onChange(selected ? selected.map(s => s.value) : []);
                      }}
                      placeholder={t('searchLang')}
                      instanceId="lang-select"
                      className="text-sm"
                      styles={getCustomSelectStyles(!!errors.preferredLanguage)}
                    />
                  )}
                />
                {errors.preferredLanguage && <span className="text-rose-500 text-xs font-medium ml-1">{errors.preferredLanguage.message}</span>}
              </div>

              <TextAreaField
                label={t('address')}
                registration={register("address")}
                placeholder={t('addressPlaceholder')}
                error={errors.address?.message}
                icon={<svg className="w-5 h-5 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>}
              />

              <div className="pt-6 flex justify-center">
                <button
                  type="submit"
                  className="px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] text-base flex items-center justify-center gap-2"
                >
                  {t('submit')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}