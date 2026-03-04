// app/api/patient-update/route.ts
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // 💡 รับ patientId เข้ามาด้วย
        const { formData, status, patientId } = body;

        await pusherServer.trigger("patient-channel", "form-update", {
            formData,
            status,
            patientId, // 💡 ส่งต่อให้ Staff
            timestamp: Date.now()
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to sync" }, { status: 500 });
    }
}