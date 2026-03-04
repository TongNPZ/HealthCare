// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header"; 

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 💡 เรียกใช้ Header เปล่าๆ ไม่ต้องส่ง props อะไรไป */}
        <Header /> 
        
        {children}
      </body>
    </html>
  );
}