import { Webhook } from 'svix';
// import { WebhookEvent } from '@clerk/backend';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function handleClerkWebhook(req, res) {
  try {
    // Get the webhook secret from environment variables
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!WEBHOOK_SECRET) {
      throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard');
    }

    // Get the headers
    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({ error: "Error occurred -- no svix headers" });
    }

    // Get the body
    const payload = JSON.stringify(req.body);
    
    // Create a new SVIX instance with your webhook secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;
    try {
      // Verify the webhook payload
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return res.status(400).json({ error: 'Error verifying webhook' });
    }

    // Handle the webhook
    const eventType = evt.type;
    const eventData = evt.data;

    console.log(`Webhook received: ${eventType}`);

    // Handle user creation/update
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, created_at, updated_at } = eventData;
      const email = email_addresses?.find(email => email.id === eventData.primary_email_address_id)?.email_address;

      if (!email) {
        console.error('No email found for user:', id);
        return res.status(400).json({ error: 'No email found' });
      }

      try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        const userData = {
          id,
          name: `${first_name || ''} ${last_name || ''}`.trim() || email.split('@')[0],
          email,
          passwordHash: 'oauth2', // Since we're using Clerk for auth
          createdAt: new Date(created_at),
          updatedAt: new Date(updated_at || created_at),
        };

        if (existingUser) {
          // Update existing user
          await prisma.user.update({
            where: { email },
            data: userData,
          });
          console.log(`Updated user: ${email}`);
        } else {
          // Create new user
          await prisma.user.create({
            data: userData,
          });
          console.log(`Created user: ${email}`);
        }
      } catch (error) {
        console.error('Error processing user:', error);
        return res.status(500).json({ error: 'Error processing user' });
      }
    }
    // Handle user deletion
    else if (eventType === 'user.deleted') {
      const { id } = eventData;
      
      try {
        await prisma.user.deleteMany({
          where: { id },
        });
        console.log(`Deleted user with Clerk ID: ${id}`);
      } catch (error) {
        console.error('Error deleting user:', error);
        // Don't fail the webhook if user doesn't exist in our DB
        if (error.code !== 'P2025') {
          return res.status(500).json({ error: 'Error deleting user' });
        }
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
