import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CheckoutSteps from '@/components/checkout-steps';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import PlaceOrderForm from '@/components/form/place-order-form';
import ProductPrice from '@/components/product/product-price';

export const metadata: Metadata = {
	title: 'Place Order',
};

const PlaceOrderPage = async () => {
	const cart = await getMyCart();
	const session = await auth();
	const userId = session?.user?.id;

	if (!userId) throw new Error('User not found');

	const user = await getUserById(userId);

	if (!cart || cart.items.length === 0) redirect('/cart');
	if (!user.address) redirect('/shipping-address');
	if (!user.paymentMethod) redirect('/payment-method');

	const userAddress = user.address as ShippingAddress;

	return (
		<>
			<CheckoutSteps current={3} />
			<h1 className='py-4 text-2xl font-bold'>Place Order</h1>
			<div className='grid md:grid-cols-3 md:gap-5'>
				<div className='md:col-span-2 overflow-x-auto space-y-4'>
					<Card className='border-x-transparent border-t-transparent border-b-2 rounded-none shadow-none'>
						<CardContent className='p-4 px-0 px-none gap-4'>
							<h2 className='text-xl pb-4'>Shipping Address</h2>
							<p>{userAddress.fullName}</p>
							<p>
								{userAddress.streetAddress}, {userAddress.city}{' '}
								{userAddress.postalCode}, {userAddress.country}{' '}
							</p>
							<div className='mt-3'>
								<Link href='/shipping-address'>
									<Button variant='outline'>Edit</Button>
								</Link>
							</div>
						</CardContent>
					</Card>

					<Card className='border-x-transparent border-t-transparent border-b-2 rounded-none shadow-none'>
						<CardContent className='p-4 px-0 gap-4'>
							<h2 className='text-xl pb-4'>Payment Method</h2>
							<p>{user.paymentMethod}</p>
							<div className='mt-3'>
								<Link href='/payment-method'>
									<Button variant='outline'>Edit</Button>
								</Link>
							</div>
						</CardContent>
					</Card>

					<Card className='border-x-transparent border-t-transparent border-b-2 rounded-none shadow-none'>
						<CardContent className='p-4 px-0 gap-4'>
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
									{cart.items.map(item => (
										<TableRow key={item.slug + (item.variantId ?? 'simple')}>
											<TableCell className='flex items-center'>
												<Image
													src={item.image}
													alt={item.name + (item.variantId ?? 'simple')}
													width={50}
													height={50}
												/>
												<span className='px-2'>{item.name}</span>
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
							<div className='flex justify-between'>
								<div>Items</div>
								<div>{formatCurrency(cart.itemsPrice)}</div>
							</div>
							<div className='flex justify-between'>
								<div>Tax</div>
								<div>{formatCurrency(cart.taxPrice)}</div>
							</div>
							<div className='flex justify-between'>
								<div>Shipping</div>
								<div>{formatCurrency(cart.shippingPrice)}</div>
							</div>
							<div className='flex justify-between'>
								<div>Total</div>

								<ProductPrice
									className='text-2xl text-brown-50'
									value={+cart.totalPrice}
								/>
							</div>
							<PlaceOrderForm />
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
};

export default PlaceOrderPage;
