'use client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import {
	updateOrderToPaidCOD,
	deliverOrder,
} from '@/lib/actions/order.actions';
import StripePayment from '@/components/payments/stripe-payment';
import ProductPrice from '@/components/product/product-price';

const OrderDetailsTable = ({
	order,
	isAdmin,
	stripeClientSecret,
}: {
	order: Omit<Order, 'paymentResult'>;
	isAdmin: boolean;
	stripeClientSecret: string | null;
}) => {
	const {
		id,
		shippingAddress,
		orderitems,
		itemsPrice,
		shippingPrice,
		taxPrice,
		totalPrice,
		paymentMethod,
		isDelivered,
		isPaid,
		paidAt,
		deliveredAt,
	} = order;


	// Button to mark order as paid
	const MarkAsPaidButton = () => {
		const [isPending, startTransition] = useTransition();
		const { toast } = useToast();

		return (
			<Button
				type='button'
				disabled={isPending}
				onClick={() =>
					startTransition(async () => {
						const res = await updateOrderToPaidCOD(order.id);
						toast({
							variant: res.success ? 'default' : 'destructive',
							description: res.message,
						});
					})
				}>
				{isPending ? 'processing...' : 'Mark As Paid'}
			</Button>
		);
	};

	// Button to mark order as delivered
	const MarkAsDeliveredButton = () => {
		const [isPending, startTransition] = useTransition();
		const { toast } = useToast();

		return (
			<Button
				type='button'
				disabled={isPending}
				onClick={() =>
					startTransition(async () => {
						const res = await deliverOrder(order.id);
						toast({
							variant: res.success ? 'default' : 'destructive',
							description: res.message,
						});
					})
				}>
				{isPending ? 'processing...' : 'Mark As Delivered'}
			</Button>
		);
	};

	return (
		<>
			<h1 className='py-4  font-bold text-2xl'>Order {formatId(id)}</h1>
			<div className='grid md:grid-cols-3 md:gap-5'>
				<div className='col-span-2 flex flex-col gap-6 overlow-x-auto'>
					<Card className='border-t-transparent border-l-transparent border-r-transparent border-b-2 rounded-none shadow-none'>
						<CardContent className='px-0 gap-4'>
							<h2 className='text-xl pb-4'>Payment Method</h2>
							<p className='mb-2'>{paymentMethod}</p>
							{isPaid ? (
								<Badge variant='secondary'>
									Paid at {formatDateTime(paidAt!).dateTime}
								</Badge>
							) : (
								<Badge variant='destructive'>Not paid</Badge>
							)}
						</CardContent>
					</Card>
					<Card className='border-t-transparent border-l-transparent border-r-transparent border-b-2 rounded-none shadow-none'>
						<CardContent className='px-0 gap-4'>
							<h2 className='text-xl pb-4'>Shipping Address</h2>
							<p>{shippingAddress.fullName}</p>
							<p className='mb-2'>
								{shippingAddress.streetAddress}, {shippingAddress.city}
								{shippingAddress.postalCode}, {shippingAddress.country}
							</p>
							{isDelivered ? (
								<Badge variant='secondary'>
									Delivered at {formatDateTime(deliveredAt!).dateTime}
								</Badge>
							) : (
								<Badge variant='destructive'>Not Delivered</Badge>
							)}
						</CardContent>
					</Card>
					<Card className='border-t-transparent border-l-transparent border-r-transparent border-b-2 rounded-none shadow-none'>
						<CardContent className='px-0 gap-4 '>
							<h2 className='text-xl pb-4'>Order Items</h2>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Item</TableHead>
										<TableHead className='text-center'>Variant</TableHead>
										<TableHead className='text-center'>Quantity</TableHead>
										<TableHead className='text-right'>Price</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{orderitems.map((item: OrderItem) => (
										<TableRow key={item.slug + (item.variantId ?? 'simple')}>
											<TableCell>
												<Link
													href={`/product/{item.slug}`}
													className='flex items-center'>
													<Image
														src={item.image}
														alt={item.name}
														width={50}
														height={50}
													/>
													<span className='px-2'>{item.name}</span>
												</Link>
											</TableCell>
											<TableCell className='text-center'>
												{item.variant}
											</TableCell>
											<TableCell className='text-center'>{item.qty}</TableCell>
											<TableCell className='text-right'>
												{formatCurrency(item.price)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>
				<div>
					<Card className='border-none shadow-none'>
						<CardContent className='p-4 gap-4 space-y-4'>
							<div className='flex gap-8 justify-between'>
								<div>Items</div>
								<div>{formatCurrency(itemsPrice)}</div>
							</div>
							<div className='flex justify-between'>
								<div>Tax</div>
								<div>{formatCurrency(taxPrice)}</div>
							</div>
							<div className='flex gap-8 justify-between'>
								<div>Shipping</div>
								<div>{formatCurrency(shippingPrice)}</div>
							</div>
							<div className='flex gap-8 justify-between'>
								<div>Total</div>
								<div>
									<ProductPrice
										className='text-2xl text-brown-50'
										value={+totalPrice}
									/>
								</div>
							</div>


							{/* Stripe Payment */}
							{!isPaid && paymentMethod === 'Stripe' && stripeClientSecret && (
								<StripePayment
									priceInCents={Number(order.totalPrice) * 100}
									orderId={order.id}
									clientSecret={stripeClientSecret}
								/>
							)}

							{/* Cash On Delivery */}
							{isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
								<MarkAsPaidButton />
							)}
							{isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
};

export default OrderDetailsTable;
