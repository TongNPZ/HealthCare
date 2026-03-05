import { z } from "zod";
import i18n from "./i18n";

// Apply the custom error map directly to let TypeScript infer the exact v4 types automatically.
z.setErrorMap((issue) => {
    const code = String(issue.code);

    if (code === "invalid_type" || code === "too_small") {
        return { message: String(i18n.t("errRequired")) };
    }

    if (code === "invalid_string" || code === "invalid_format") {
        // Safely check for 'validation' property without using 'any'
        const issueRecord = issue as Record<string, unknown>;

        if (issueRecord.validation === "email") {
            return { message: String(i18n.t("errEmail")) };
        }
        if (issueRecord.validation === "regex") {
            return { message: String(i18n.t("errPhone")) };
        }
    }

    // Fallback message
    return { message: String(i18n.t("errRequired")) };
});

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