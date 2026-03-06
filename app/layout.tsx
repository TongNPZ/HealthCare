// src/app/layout.tsx
import type { Metadata } from "next";
// 💡 เปลี่ยนจาก Inter เป็น Prompt
import { Prompt } from "next/font/google";
import "./globals.css";
import Header from "./components/ui/Header";

// 💡 ตั้งค่าฟอนต์ Prompt รองรับทั้งไทยและอังกฤษ
const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin", "thai"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "HealthCare+ Real-time System",
  description: "Patient Registration System built with Next.js and Pusher",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 💡 เรียกใช้คลาสของฟอนต์ Prompt ที่ tag body */}
      <body className={prompt.className}>
        {/* เรียกใช้ Header เปล่าๆ ไม่ต้องส่ง props อะไรไป */}
        <Header />

        {children}
      </body>
    </html>
  );
} 