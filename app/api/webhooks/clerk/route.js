import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { clerkClient } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { NextResponse } from 'next/server';

export async function POST(req) {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400,
        });
    }

    // Handle the event
    const eventType = evt.type;

    if (eventType === 'user.created') {
        const { id, email_addresses, public_metadata, unsafe_metadata } = evt.data;

        await dbConnect();

        // In our custom sign-up flow, we pass role via unsafeMetadata
        const role = unsafe_metadata?.role || public_metadata?.role || 'FREE_USER';

        // Create user in MongoDB
        try {
            await User.create({
                clerkId: id,
                email: email_addresses[0].email_address,
                role: role,
            });

            // Critically, move the role from unsafe_metadata to public_metadata 
            // across Clerk so our middleware and components can see it easily.
            await clerkClient.users.updateUserMetadata(id, {
                publicMetadata: {
                    role: role,
                },
            });

        } catch (error) {
            console.error('Error saving user to DB:', error);
            return NextResponse.json({ error: 'Error saving user' }, { status: 500 });
        }
    }

    return new Response('', { status: 200 });
}
