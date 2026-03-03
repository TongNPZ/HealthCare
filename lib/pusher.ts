// src/lib/pusher.ts
import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// 1. ตั้งค่า Pusher สำหรับฝั่ง Server (ใช้ใน API Route เพื่อ 'ส่ง' ข้อมูล)
export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
});

// 2. ตั้งค่า Pusher สำหรับฝั่ง Client (ใช้ใน React Components เพื่อ 'รับ' ข้อมูลแบบ Real-time)
// เช็คก่อนว่าไม่ได้อยู่บน Server (ป้องกัน error ตอน Build)
export const pusherClient =
    typeof window !== 'undefined'
        ? new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        })
        : null;