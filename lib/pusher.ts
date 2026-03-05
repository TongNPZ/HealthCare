import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// Configure Pusher for the server-side (used in API routes to broadcast data)
export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
});

// Configure Pusher for the client-side (used in React components to receive real-time updates)
export const pusherClient =
    typeof window !== 'undefined'
        ? new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        })
        : null;