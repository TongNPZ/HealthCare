import React from "react";
import { FormSectionProps, SelectOption } from "@/lib/types";
import { InputField } from "../ui/InputField";
import { SelectField } from "../ui/SelectField";
import { DatePickerField } from "../ui/DatePickerField";

interface Props extends FormSectionProps {
    nationalityOptions: SelectOption[];
    religionOptions: SelectOption[];
    languageOptions: SelectOption[];
}

export const PersonalInfoSection = ({ register, control, errors, t, nationalityOptions, religionOptions, languageOptions }: Props) => {
    return (
        <div className="mb-8">
            {/* Section Header */}
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                {/* Name Fields */}
                <InputField
                    label={t("firstName")}
                    registration={register("firstName")}
                    error={errors.firstName?.message}
                    placeholder={t("firstNamePlaceholder")}
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                />
                <InputField
                    label={t("middleName")}
                    registration={register("middleName")}
                    required={false}
                    error={errors.middleName?.message}
                    placeholder={t("optional")}
                />
                <InputField
                    label={t("lastName")}
                    registration={register("lastName")}
                    error={errors.lastName?.message}
                    placeholder={t("lastNamePlaceholder")}
                />

                {/* Demographics Fields */}
                <DatePickerField
                    name="dateOfBirth"
                    control={control}
                    label={t("dob")}
                    error={errors.dateOfBirth?.message}
                    placeholder={t("selectDate")}
                />

                <SelectField
                    name="gender"
                    control={control}
                    label={t("gender")}
                    options={[{ value: "Male", label: t("male") }, { value: "Female", label: t("female") }]}
                    error={errors.gender?.message}
                />

                <SelectField
                    name="religion"
                    control={control}
                    label={t("religion")}
                    required={false}
                    isClearable
                    options={religionOptions}
                    error={errors.religion?.message}
                    placeholder={t("selectReligion") || "Select Religion"}
                />

                <SelectField
                    name="nationality"
                    control={control}
                    label={t("nationality")}
                    options={nationalityOptions}
                    error={errors.nationality?.message}
                />

                <SelectField
                    name="preferredLanguage"
                    control={control}
                    label={t("language")}
                    isMulti
                    options={languageOptions}
                    error={errors.preferredLanguage?.message}
                />
            </div>
        </div>
    );
};