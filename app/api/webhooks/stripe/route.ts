import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderToPaid } from '@/lib/actions/order.actions';

export async function POST(req: NextRequest) {
	// Build the webhook event
	const event = await Stripe.webhooks.constructEvent(
		await req.text(),
		req.headers.get('stripe-signature') as string,
		process.env.STRIPE_WEBHOOK_SECRET as string
	);

	console.log('Received event:', event);

	// Check for successful payment
	if (event.type === 'charge.succeeded') {
		try {
			const charge = event.data.object as Stripe.Charge;

			await updateOrderToPaid({
				orderId: charge.metadata.orderId,
				paymentResult: {
					id: charge.id,
					status: 'COMPLETED',
					email_address: charge.billing_details.email!,
					pricePaid: (charge.amount / 100).toFixed(),
				},
			});

			return NextResponse.json({ message: 'updateOrderToPaid was successful' });
		} catch (err) {
			console.error('updateOrderToPaid error:', err);
			return new NextResponse('Webhook handler failed', { status: 500 });
		}
	}

	return NextResponse.json({
		message: 'event is not charge.succeeded',
	});
}
