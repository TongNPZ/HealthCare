```markdown
# 🏗️ Development Planning Documentation

This document outlines the architectural choices, design decisions, and system flow for the HealthCare+ Real-time Patient Registration System.

## 📁 1. Project Structure

The project is organized to separate concerns and maintain clean code:

- `app/`: Contains the main Next.js App Router pages (`/patient-form`, `/staff`, `/patient-simulator`) and API routes (`/api/patient-update`).
- `components/`: Modularized UI components grouped by feature:
  - `ui/`: Reusable, generic base components (Inputs, Selects, Headers).
  - `patient/`: Specific sections of the patient form (PersonalInfo, ContactInfo, etc.).
  - `staff/`: Dashboard elements (PatientList, PatientCard, DetailView).
- `hooks/`: Custom Hooks (`usePatientForm`, `useStaffDashboard`) that encapsulate complex business logic and state management, keeping UI components purely presentational.
- `lib/`: Shared utilities, i18n configurations, Pusher setup, and Zod schemas.

## 🎨 2. Design Decisions (UI/UX)

- **Mobile-First Responsiveness:** Utilized Tailwind CSS to ensure a seamless experience. On mobile, form fields stack vertically for ease of typing. On larger screens, fields span into a multi-column grid to efficiently use screen real estate.
- **Staff Dashboard Layout:** Transitioned the staff monitor from a standard grid to a list-based layout. This improves scannability and allows staff to track multiple active patients and their statuses (ACTIVE/INACTIVE/SUBMITTED) at a glance.
- **Visual Feedback:** Integrated SweetAlert2 to provide clear, accessible confirmation dialogs before form submission, preventing accidental data entries.

## 🧩 3. Component Architecture

- **Separation of Concerns:** Components are strictly responsible for rendering the UI. Data fetching, form state (`react-hook-form`), and Pusher event subscriptions are delegated to Custom Hooks.
- **Modular Forms:** The extensive registration form is split into `PersonalInfoSection`, `ContactInfoSection`, and `EmergencyContactSection`. This prevents a massive, unreadable monolithic form component and makes validation handling much easier.

## 🔄 4. Real-Time Synchronization Flow

The real-time aspect is powered by Pusher (WebSockets) using the following flow:

1. **Trigger (Client-side):** As a patient inputs data into the form, a `useEffect` hook listens to changes in the form state. A POST request containing the current form data and status (`actively filling`) is sent to the Next.js API route.
2. **Broadcast (Server-side):** The `/api/patient-update` route receives the payload and securely triggers a Pusher event on the `patient-updates` channel using server credentials.
3. **Consumption (Staff-side):** The Staff Dashboard uses `useStaffDashboard` to subscribe to the `patient-updates` channel. Upon receiving an event, it updates the local state array instantly, reflecting the changes in the UI without needing a page refresh.
4. **Lifecycle Management:** The system captures browser `beforeunload` events to explicitly notify the dashboard if a user closes their browser unexpectedly, marking the session as "Abandoned" to maintain dashboard accuracy.
```
