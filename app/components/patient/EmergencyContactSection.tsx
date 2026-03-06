import React from "react";
import { FormSectionProps } from "@/lib/types";
import { InputField } from "../ui/FormFields";

export const EmergencyContactSection = ({ register, errors, t }: FormSectionProps) => {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2 flex items-center gap-2">
                {t("emergencyContact")}
                <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{t("optional")}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <InputField
                    label={t("contactName")}
                    required={false}
                    placeholder={t("placeholderName")}
                    registration={register("emergencyContactName")}
                    error={errors.emergencyContactName?.message}
                />
                <InputField
                    label={t("relationship")}
                    required={false}
                    placeholder={t("placeholderRel")}
                    registration={register("emergencyContactRelationship")}
                    error={errors.emergencyContactRelationship?.message}
                />
            </div>
        </div>
    );
};