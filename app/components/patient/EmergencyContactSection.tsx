import React from "react";
import { FormSectionProps } from "@/lib/types";
import { InputField } from "../ui/InputField";

export const EmergencyContactSection = ({ register, errors }: FormSectionProps) => {
    return (
        <div className="mb-8">
            {/* Section Header with Optional Badge */}
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2 flex items-center gap-2">
                Emergency Contact
                <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Optional</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {/* Emergency Contact Details */}
                <InputField
                    label="Contact Name"
                    required={false}
                    placeholder="e.g. Jane Doe"
                    registration={register("emergencyContactName")}
                    error={errors.emergencyContactName?.message}
                />
                <InputField
                    label="Relationship"
                    required={false}
                    placeholder="e.g. Mother, Spouse"
                    registration={register("emergencyContactRelationship")}
                    error={errors.emergencyContactRelationship?.message}
                />
            </div>
        </div>
    );
};