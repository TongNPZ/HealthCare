# 🏥 HealthCare+ Real-time Patient Registration System

A modern, robust, and real-time patient registration platform built with Next.js. This system features a highly responsive patient form and a live staff monitoring dashboard to demonstrate real-time WebSocket capabilities.

## 🔗 Links

- **Repository:** https://github.com/TongNPZ/HealthCare.git

## ✨ Core Features

- **📝 Comprehensive Patient Form:** Includes all required fields (Name, DoB, Gender, Contact details, Address, Nationality, Language) and optional fields (Middle Name, Emergency Contact, Religion).
- **🛡️ Robust Form Validation:** Powered by `react-hook-form` and `zod` for strict, type-safe validation (e.g., required fields, email format, 9-15 digit phone numbers).
- **⚡ Real-time Staff Dashboard:** Built with **Pusher (WebSockets)**, allowing medical staff to monitor patients filling out forms instantly.
- **📊 Live Status Indicators:** Displays clear statuses on the staff monitor:
  - `ACTIVE`: Patient is actively filling the form.
  - `INACTIVE`: Patient has been idle for 2+ minutes.
  - `SUBMITTED`: Patient has successfully submitted the form.
- **📱 Fully Responsive UI:** Crafted with Tailwind CSS to ensure a seamless experience across mobile and desktop devices.

## 🌟 Bonus Features (Extra Implementations)

Beyond the core requirements, the following features were added to enhance the application:

- **🌐 Full Localization (i18n):** Seamlessly switch between English (EN) and Thai (TH) across all pages, forms, placeholders, and dynamic dropdowns (using `@cospired/i18n-iso-languages`).
- **🧪 Built-in Patient Simulator:** A dedicated simulator interface (`/patient-simulator`) to mock concurrent users and easily test the real-time capabilities without needing multiple devices.
- **🧹 Auto-cleanup System:** Abandoned sessions (users who close the tab without submitting) are automatically cleared from the staff dashboard after 10 minutes to prevent memory leaks and clutter.
- **✨ Enhanced UX/Feedback:** Integrated SweetAlert2 for beautiful, animated confirmation dialogs and success feedback.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Real-time Communication:** Pusher (WebSockets)
- **Localization:** `react-i18next` + `i18n-iso-countries` + `@cospired/i18n-iso-languages`
- **Form Management:** React Hook Form + Zod

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have **Node.js (v18 or newer)** installed on your machine.

### 2. Environment Variables

Create a `.env.local` file in the root directory and add your Pusher credentials:

```env
NEXT_PUBLIC_PUSHER_APP_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
PUSHER_APP_ID=your_id
PUSHER_SECRET=your_secret
```

```Bash
# Install dependencies
npm install
# Run the development server
npm run dev
```
