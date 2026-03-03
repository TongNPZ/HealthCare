// src/app/api/patient-update/route.ts
import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        await pusherServer.trigger('patient-channel', 'form-update', body);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Pusher error:', error);
        return NextResponse.json({ error: 'Failed to sync data' }, { status: 500 });
    }
}