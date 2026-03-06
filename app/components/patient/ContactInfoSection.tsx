import React from "react";
import { FormSectionProps } from "@/lib/types";
import { InputField, TextAreaField, PhoneInputField } from "../ui/FormFields";

export const ContactInfoSection = ({ register, control, errors, t }: FormSectionProps) => {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">{t("contactInfo")}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <PhoneInputField
                    name="phoneNumber"
                    control={control}
                    label={t("phone")}
                    error={errors.phoneNumber?.message}
                />

                <InputField
                    label={t("email")}
                    type="email"
                    registration={register("email")}
                    error={errors.email?.message}
                    placeholder="email@example.com"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                />
            </div>

            <TextAreaField
                label={t("addressSection") || t("address")}
                registration={register("address")}
                // 💡 แก้ไข Key ให้ตรงกับ i18n.ts
                placeholder={t("addressPlace") || "Enter your full address..."}
                error={errors.address?.message}
                icon={<svg className="w-5 h-5 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            />
        </div>
    );
};