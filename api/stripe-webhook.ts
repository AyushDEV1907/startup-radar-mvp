
import { buffer } from 'micro';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { 
  apiVersion: '2023-10-16' 
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const buf = await buffer(req);
  const signature = req.headers['stripe-signature']!;
  
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf, 
      signature, 
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id || session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (userId && plan) {
          const { error } = await supabase
            .from('users')
            .update({ plan })
            .eq('id', userId);

          if (error) {
            console.error('Error updating user plan:', error);
          } else {
            console.log(`Updated user ${userId} to ${plan} plan`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get customer email to find user
        const customer = await stripe.customers.retrieve(customerId);
        if (customer && !customer.deleted && customer.email) {
          const { error } = await supabase
            .from('users')
            .update({ plan: 'free' })
            .eq('email', customer.email);

          if (error) {
            console.error('Error downgrading user plan:', error);
          } else {
            console.log(`Downgraded user with email ${customer.email} to free plan`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
