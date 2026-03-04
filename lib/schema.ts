// src/lib/schema.ts
import { z } from "zod";
import i18n from "./i18n";

const customErrorMap = (...args: any[]): { message: string } => {

    const issue = args[0];
    const ctx = args[1];

    const code = String(issue?.code);

    if (code === "invalid_type" || code === "too_small") {
        return { message: String(i18n.t("errRequired")) };
    }

    if (code === "invalid_string" || code === "invalid_format") {
        const validation = issue?.validation ? String(issue.validation) : "";

        if (validation === "email") {
            return { message: String(i18n.t("errEmail")) };
        }
        if (validation === "regex") {
            return { message: String(i18n.t("errPhone")) };
        }
    }

    return { message: ctx?.defaultError ?? String(i18n.t("errRequired")) };
};

z.setErrorMap(customErrorMap as any);

export const patientFormSchema = z.object({
    firstName: z.string().min(1),
    middleName: z.string().optional(),
    lastName: z.string().min(1),
    dateOfBirth: z.string().min(1),
    gender: z.string().min(1),
    phoneNumber: z.string().regex(/^\d{9,15}$/),
    email: z.string().email(),
    address: z.string().min(1),
    preferredLanguage: z.array(z.string()).min(1),
    nationality: z.string().min(1),
    emergencyContactName: z.string().optional(),
    emergencyContactRelationship: z.string().optional(),
    religion: z.string().optional(),
});

export type PatientFormData = z.infer<typeof patientFormSchema>;