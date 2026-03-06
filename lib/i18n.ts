// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            // --- MAIN PAGE (Home) ---
            mainTitle: "Patient Real-time System",
            mainSubtitle: "Select a mode to start the application",
            patientModeBtn: "Patient Simulator",
            patientModeDesc: "Create and simulate patient form filling",
            staffModeBtn: "Staff Dashboard",
            staffModeDesc: "Monitor patient data in real-time",

            // --- NAVIGATION & COMMON ---
            backToMenu: "Back to Main Menu",
            loading: "Loading...",
            lastUpdated: "Last updated",
            justNow: "Just now",
            minsAgo: "m ago",
            // 💡 เพิ่มคำแปลปุ่ม Back ตรงนี้
            backToUserList: "Back to User List",
            returnToPatientList: "Return to Patient List",

            // --- PATIENT SIMULATOR PAGE ---
            simulatorTitle: "Patient Simulator",
            simulatorDesc: "Create user cards to test the real-time dashboard seamlessly.",
            createUserBtn: "Create User Card",
            clearAllBtn: "Clear All Users",
            noUsersTitle: "No active users",
            noUsersDesc: "Click the button above to create a new patient card.",
            fillForm: "Fill Form",
            editForm: "Edit Form",
            patientId: "ID",
            deleteUser: "Delete this user",

            // --- PATIENT FORM PAGE ---
            formHeader: "New Patient Registration",
            formSubtitle: "Please provide accurate information for medical records.",
            personalInfo: "Personal Information",
            contactInfo: "Contact Information",
            emergencyContact: "Emergency Contact",
            addressSection: "Complete Home Address",

            // Input Labels & Placeholders
            firstName: "First Name",
            firstNamePlace: "e.g. John",
            middleName: "Middle Name",
            middleNamePlace: "Optional",
            lastName: "Last Name",
            lastNamePlace: "e.g. Doe",
            dob: "Date of Birth",
            gender: "Gender",
            phone: "Phone Number",
            email: "Email Address",
            nationality: "Nationality",
            language: "Preferred Language(s)",
            religion: "Religion",
            contactName: "Contact Name",
            relationship: "Relationship",
            address: "Address Details",
            addressPlace: "House No., Street, District, Province...",

            searchCountry: "Search country...",
            searchLang: "Select languages...",
            placeholderName: "e.g. Jane Doe",
            placeholderRel: "e.g. Mother, Spouse",

            // Select Options
            selectGender: "Select Gender",
            male: "Male",
            female: "Female",
            selectDate: "Select Date",
            selectReligion: "Select Religion",
            buddhism: "Buddhism",
            christianity: "Christianity",
            islam: "Islam",
            hinduism: "Hinduism",
            sikhism: "Sikhism",
            others: "Others",

            // Form Actions & Modals
            submitBtn: "Submit Information",
            confirmTitle: "Confirm Submission?",
            confirmText: "Please verify all information before submitting.",
            btnConfirm: "Confirm",
            btnCancel: "Cancel",
            successTitle: "Success!",
            successText: "Your registration has been submitted securely.",
            completedTitle: "Registration Completed",
            completedText: "Our staff has received your data.",

            // Errors
            errRequired: "This field is required",
            errEmail: "Invalid email format",
            errPhone: "Valid phone number is required (9-15 digits)",

            // --- STAFF DASHBOARD PAGE ---
            staffTitle: "Staff Dashboard",
            liveMonitor: "Live Monitor",
            autoCleanup: "Auto-cleanup in 10 minutes",
            noActivePatients: "No active patients right now",
            waitingSubmissions: "Waiting for new form submissions...",
            selectPatient: "Select a patient to view details",
            patientDetails: "Patient Detail",
            backToList: "Back to List",

            // Status Tags
            statusActive: "ACTIVE",
            statusInactive: "INACTIVE",
            statusSubmitted: "SUBMITTED",
            statusFilling: "Filling form...",
            statusWaiting: "Waiting for data..."
        }
    },
    th: {
        translation: {
            // --- MAIN PAGE (Home) ---
            mainTitle: "ระบบจัดการข้อมูลผู้ป่วยเรียลไทม์",
            mainSubtitle: "เลือกโหมดการใช้งานเพื่อเริ่มต้น",
            patientModeBtn: "โปรแกรมจำลองผู้ป่วย",
            patientModeDesc: "สร้างและจำลองการกรอกข้อมูลของผู้ป่วย",
            staffModeBtn: "ระบบเจ้าหน้าที่",
            staffModeDesc: "ติดตามข้อมูลผู้ป่วยแบบเรียลไทม์",

            // --- NAVIGATION & COMMON ---
            backToMenu: "กลับหน้าหลัก",
            loading: "กำลังโหลด...",
            lastUpdated: "อัปเดตล่าสุด",
            justNow: "เมื่อสักครู่",
            minsAgo: "นาทีที่แล้ว",
            // 💡 เพิ่มคำแปลปุ่ม Back ตรงนี้
            backToUserList: "กลับไปยังหน้ารายชื่อผู้จำลอง",
            returnToPatientList: "กลับไปยังหน้ารายชื่อผู้ป่วย",

            // --- PATIENT SIMULATOR PAGE ---
            simulatorTitle: "โปรแกรมจำลองผู้ป่วย",
            simulatorDesc: "สร้างบัตรผู้ป่วยจำลองเพื่อทดสอบระบบมอนิเตอร์แบบเรียลไทม์",
            createUserBtn: "สร้างบัตรผู้ป่วยใหม่",
            clearAllBtn: "ลบผู้ป่วยทั้งหมด",
            noUsersTitle: "ไม่มีผู้ใช้ที่ใช้งานอยู่",
            noUsersDesc: "คลิกปุ่มด้านบนเพื่อสร้างบัตรผู้ป่วยใหม่",
            fillForm: "กรอกฟอร์ม",
            editForm: "แก้ไขข้อมูล",
            patientId: "รหัส",
            deleteUser: "ลบผู้ใช้คนนี้",

            // --- PATIENT FORM PAGE ---
            formHeader: "ลงทะเบียนผู้ป่วยใหม่",
            formSubtitle: "กรุณากรอกข้อมูลส่วนตัวเพื่อใช้ในการเข้ารับการรักษา",
            personalInfo: "ข้อมูลส่วนตัว",
            contactInfo: "ข้อมูลการติดต่อ",
            emergencyContact: "ผู้ติดต่อฉุกเฉิน",
            addressSection: "ที่อยู่ปัจจุบัน",

            // Input Labels & Placeholders
            firstName: "ชื่อจริง",
            firstNamePlace: "เช่น สมชาย",
            middleName: "ชื่อกลาง",
            middleNamePlace: "ไม่บังคับ",
            lastName: "นามสกุล",
            lastNamePlace: "เช่น ใจดี",
            dob: "วันเกิด",
            gender: "เพศ",
            phone: "เบอร์โทรศัพท์",
            email: "อีเมล",
            nationality: "สัญชาติ",
            language: "ภาษาที่สะดวกสื่อสาร",
            religion: "ศาสนา",
            contactName: "ชื่อผู้ติดต่อ",
            relationship: "ความสัมพันธ์",
            address: "รายละเอียดที่อยู่",
            addressPlace: "บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด...",

            searchCountry: "ค้นหาประเทศ...",
            searchLang: "เลือกภาษา...",
            placeholderName: "เช่น นางสมศรี ใจดี",
            placeholderRel: "เช่น มารดา, คู่สมรส",

            // Select Options
            selectGender: "เลือกเพศ",
            male: "ชาย",
            female: "หญิง",
            selectDate: "เลือกวันที่",
            selectReligion: "เลือกศาสนา",
            buddhism: "ศาสนาพุทธ",
            christianity: "ศาสนาคริสต์",
            islam: "ศาสนาอิสลาม",
            hinduism: "ศาสนาฮินดู",
            sikhism: "ศาสนาซิกข์",
            others: "อื่นๆ",

            // Form Actions & Modals
            submitBtn: "ยืนยันข้อมูล",
            confirmTitle: "ยืนยันข้อมูล?",
            confirmText: "กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดยืนยัน",
            btnConfirm: "ยืนยันการส่ง",
            btnCancel: "ยกเลิก",
            successTitle: "สำเร็จ!",
            successText: "ข้อมูลของคุณถูกส่งเข้าระบบแล้ว",
            completedTitle: "บันทึกเรียบร้อย",
            completedText: "เจ้าหน้าที่ได้รับข้อมูลของคุณแล้ว",

            // Errors
            errRequired: "กรุณากรอกข้อมูลช่องนี้",
            errEmail: "รูปแบบอีเมลไม่ถูกต้อง",
            errPhone: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (9-15 หลัก)",

            // --- STAFF DASHBOARD PAGE ---
            staffTitle: "ระบบเจ้าหน้าที่",
            liveMonitor: "จอมอนิเตอร์เรียลไทม์",
            autoCleanup: "ระบบล้างข้อมูลอัตโนมัติใน 10 นาที",
            noActivePatients: "ไม่มีผู้ป่วยออนไลน์ในขณะนี้",
            waitingSubmissions: "กำลังรอการส่งข้อมูลใหม่...",
            selectPatient: "เลือกผู้ป่วยเพื่อดูรายละเอียด",
            patientDetails: "รายละเอียดผู้ป่วย",
            backToList: "กลับไปหน้ารวม",

            // Status Tags
            statusActive: "กำลังกรอก",
            statusInactive: "หยุดนิ่ง",
            statusSubmitted: "ส่งแล้ว",
            statusFilling: "กำลังพิมพ์ข้อมูล...",
            statusWaiting: "รอข้อมูล..."
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