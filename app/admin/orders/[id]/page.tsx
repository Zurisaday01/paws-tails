import PageContainer from '@/components/layout/dashboard/page-container';
import OrderDetailsTable from '@/components/tables/orders/order-details-table';
import { getOrderById } from '@/lib/actions/order.actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Stripe from 'stripe';

export const metadata: Metadata = {
	title: 'Dashboard : Orders Details',
};

const AdminOrderPage = async (props: {
	params: Promise<{
		id: string;
	}>;
}) => {
	const { id } = await props.params;

	const order = await getOrderById(id);
	if (!order) notFound();

	let client_secret = null;

	// Check if is not paid and using stripe
	if (order.paymentMethod === 'Stripe' && !order.isPaid) {
		// Init stripe instance
		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
		// Create payment intent
		const paymentIntent = await stripe.paymentIntents.create({
			amount: Math.round(Number(order.totalPrice) * 100),
			currency: 'USD',
			metadata: { orderId: order.id },
		});
		client_secret = paymentIntent.client_secret;
	}

	return (
		<PageContainer scrollable>
			<div className='flex-1 space-y-4'>
				<OrderDetailsTable
					order={{
						...order,
						shippingAddress: order.shippingAddress as ShippingAddress,
					}}
					stripeClientSecret={client_secret}
					isAdmin={true}
				/>
			</div>
		</PageContainer>
	);
};

export default AdminOrderPage;
