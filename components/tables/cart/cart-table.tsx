'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import RemoveButton from './remove-button';
import AddButton from './add-button';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { ArrowRight, Loader, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ProductPrice from '@/components/product/product-price';

const CartTable = ({ cart }: { cart?: Cart }) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	return (
		<>
			<h1 className='py-4 text-2xl font-bold'>Shopping Cart</h1>
			{!cart || cart.items.length === 0 ? (
				<div className='flex items-center flex-col justify-center gap-4'>
					<ShoppingCart className='w-24 h-24 text-gray-500' />
					Your shopping cart is empty
					<Link href='/' className={cn(buttonVariants({ variant: 'default' }))}>
						Start Shopping
					</Link>
				</div>
			) : (
				<div className='grid md:grid-cols-4 md:gap-5'>
					<div className='overflow-x-auto md:col-span-3'>
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
								{cart.items.map((item: CartItem) => (
									<TableRow key={item.slug + (item.variantId ?? 'simple')}>
										<TableCell>
											<Link
												href={`/product/${item.slug}`}
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
										<TableCell className='flex items-center justify-center'>
											<div className='flex items-center gap-2'>
												<RemoveButton item={item} />
												<span>{item.qty}</span>
												<AddButton item={item} />
											</div>
										</TableCell>
										<TableCell className='text-right'>
											{formatCurrency(item.price)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					<Card className='border-none shadow-none'>
						<CardContent className='p-4 gap-4'>
							<div className='pb-3 flex flex-col text-xl'>
								<span className='text-base'>
									Subtotal (
									{cart.items.reduce((a: number, c: CartItem) => a + c.qty, 0)})
								</span>
								<span className='font-bold'>
									<ProductPrice
										className='text-2xl text-brown-50'
										value={+cart.itemsPrice}
									/>
								</span>
							</div>
							<Button
								className='w-full'
								disabled={isPending}
								onClick={() =>
									startTransition(() => router.push('/shipping-address'))
								}>
								{isPending ? (
									<Loader className='w-4 h-4 animate-spin' />
								) : (
									<ArrowRight className='w-4 h-4' />
								)}{' '}
								Proceed to Checkout
							</Button>
						</CardContent>
					</Card>
				</div>
			)}
		</>
	);
};

export default CartTable;
