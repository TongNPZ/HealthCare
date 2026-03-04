// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            header: "New Patient Registration",
            subtitle: "Please provide accurate information for medical records.",
            personalInfo: "Personal Information",
            firstName: "First Name",
            middleName: "Middle Name",
            lastName: "Last Name",
            dob: "Date of Birth",
            gender: "Gender",
            phone: "Phone Number",
            email: "Email Address",
            nationality: "Nationality",
            language: "Preferred Language(s)",
            address: "Complete Home Address",
            submit: "Submit",
            optional: "Optional",
            selectGender: "Select Gender",
            selectDate: "Select Date",
            searchCountry: "Search country...",
            searchLang: "Select languages...",
            confirmTitle: "Confirm Information?",
            confirmText: "Please verify that all information is accurate before submitting.",
            btnConfirm: "Submit",
            btnCancel: "Cancel",
            successTitle: "Success!",
            successText: "Your registration has been submitted securely.",
            completedTitle: "Completed",
            completedText: "Our staff has received your data.",
            male: "Male",
            female: "Female",
            firstNamePlaceholder: "John",
            lastNamePlaceholder: "Doe",
            addressPlaceholder: "Enter your full address...",

            errRequired: "This field is required",
            errEmail: "Invalid email format",
            errPhone: "Valid phone number is required",

            staffTitle: "Staff Dashboard",
            liveMonitor: "Patient Information",
            realtime: "Real-time",
            watchProgress: "Watch patient registration progress live.",
            currentStatus: "Current Status:",
            statusSubmitted: "Data Submitted",
            statusFilling: "Actively Filling...",
            statusInactive: "Patient Inactive",
            statusWaiting: "Waiting for connection...",
            contactInfo: "Contact Info",
            emergencyContact: "Emergency Contact",
            contactName: "Contact Name",
            relationship: "Relationship",
            notProvided: "Not provided",
            waiting: "Waiting...",

            // 💡 คำแปลใหม่สำหรับระบบ Dashboard หลายคน
            activePatients: "Active Patients",
            online: "Online",
            selectPatient: "Select a patient to view their real-time progress.",
            noActivePatients: "No active patients right now",
            phoneNotProvided: "Phone not provided",
            backToList: "Back to List",
            patientDetails: "Patient Details",
            patientId: "ID"
        }
    },
    th: {
        translation: {
            header: "ลงทะเบียนผู้ป่วยใหม่",
            subtitle: "กรุณากรอกข้อมูลส่วนตัวเพื่อใช้ในการเข้ารับการรักษา",
            personalInfo: "ข้อมูลส่วนตัว",
            firstName: "ชื่อจริง",
            middleName: "ชื่อกลาง",
            lastName: "นามสกุล",
            dob: "วันเกิด",
            gender: "เพศ",
            phone: "เบอร์โทรศัพท์",
            email: "อีเมล",
            nationality: "สัญชาติ",
            language: "ภาษาที่สะดวกสื่อสาร",
            address: "ที่อยู่ปัจจุบัน",
            submit: "ยืนยันข้อมูล",
            optional: "(ไม่บังคับ)",
            selectGender: "เลือกเพศ",
            selectDate: "เลือกวันที่",
            searchCountry: "ค้นหาประเทศ...",
            searchLang: "เลือกภาษา...",
            confirmTitle: "ยืนยันข้อมูล?",
            confirmText: "กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดยืนยัน",
            btnConfirm: "ยืนยันการส่ง",
            btnCancel: "ยกเลิก",
            successTitle: "สำเร็จ!",
            successText: "ข้อมูลของคุณถูกส่งเข้าระบบแล้ว",
            completedTitle: "บันทึกข้อมูลเรียบร้อย",
            completedText: "เจ้าหน้าที่ได้รับข้อมูลของคุณแล้ว",
            male: "ชาย",
            female: "หญิง",
            firstNamePlaceholder: "ชื่อ",
            lastNamePlaceholder: "นามสกุล",
            addressPlaceholder: "บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด...",

            errRequired: "กรุณากรอกข้อมูลช่องนี้",
            errEmail: "รูปแบบอีเมลไม่ถูกต้อง",
            errPhone: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง",

            staffTitle: "ระบบเจ้าหน้าที่",
            liveMonitor: "ข้อมูลของผู้ป่วย",
            realtime: "เรียลไทม์",
            watchProgress: "ดูความคืบหน้าการกรอกข้อมูลของผู้ป่วย",
            currentStatus: "สถานะปัจจุบัน:",
            statusSubmitted: "ส่งข้อมูลแล้ว",
            statusFilling: "กำลังพิมพ์...",
            statusInactive: "ผู้ป่วยหยุดพิมพ์",
            statusWaiting: "รอการเชื่อมต่อ...",
            contactInfo: "ข้อมูลการติดต่อ",
            emergencyContact: "ติดต่อฉุกเฉิน",
            contactName: "ชื่อผู้ติดต่อ",
            relationship: "ความสัมพันธ์",
            notProvided: "ไม่ได้ระบุ",
            waiting: "รอข้อมูล...",

            // 💡 คำแปลใหม่สำหรับระบบ Dashboard หลายคน
            activePatients: "ผู้ป่วยที่กำลังออนไลน์",
            online: "ออนไลน์",
            selectPatient: "เลือกผู้ป่วยเพื่อดูความคืบหน้าแบบเรียลไทม์",
            noActivePatients: "ไม่มีผู้ป่วยออนไลน์ในขณะนี้",
            phoneNotProvided: "ไม่ได้ระบุเบอร์โทร",
            backToList: "กลับไปหน้ารวม",
            patientDetails: "รายละเอียดผู้ป่วย",
            patientId: "รหัส"
        }
    }
};

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('appLang') || 'th' : 'th';

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: savedLang,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;