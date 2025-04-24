'use client';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Minus, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { useTransition } from 'react';
import { getParamsObject } from '@/lib/utils';

interface AddToCartProps {
	isVariable: boolean;
	cart?: Cart;
	item: CartItem;
	variantsCombinationCount: number;
}

const AddToCart = ({
	isVariable,
	cart,
	item,
	variantsCombinationCount,
}: AddToCartProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toast } = useToast();

	const [isPending, startTransition] = useTransition();

	// This is necessary to disbale the button when the product is variable and the user has not selected all the variants
	// If the product is not variable, we don't need to check for the combination
	const isCombinationValid = isVariable
		? variantsCombinationCount === Object.keys(getParamsObject(searchParams)).length
		: true; 

	const handleAddToCart = async () => {
		startTransition(async () => {
			const res = await addItemToCart(item);

			if (!res.success) {
				toast({
					variant: 'destructive',
					description: res.message,
				});
				return;
			}

			// Handle success add to cart
			toast({
				description: res.message,
				action: (
					<ToastAction
						className='bg-primary dark:bg-gray-800 dark:hover:bg-gray-700 text-white hover:bg-gray-800'
						altText='Go To Cart'
						onClick={() => router.push('/cart')}>
						Go To Cart
					</ToastAction>
				),
			});
		});
	};

	// Handle remove from cart
	const handleRemoveFromCart = async () => {
		startTransition(async () => {
			const res = await removeItemFromCart(item.productId);

			toast({
				variant: res.success ? 'default' : 'destructive',
				description: res.message,
			});

			return;
		});
	};

	// Check if item is in cart
	const existItem =
		cart &&
		cart.items.find(
			(x: CartItem) =>
				x.productId === item.productId &&
				(item.variantId ? x.variantId === item.variantId : true)
		);

	return existItem ? (
		<div>
			<Button type='button' variant='outline' onClick={handleRemoveFromCart}>
				{isPending ? (
					<Loader className='w-4 h-4 animate-spin' />
				) : (
					<Minus className='w-4 h-4' />
				)}
			</Button>
			<span className='px-2'>{existItem.qty}</span>
			<Button type='button' variant='outline' onClick={handleAddToCart}>
				{isPending ? (
					<Loader className='w-4 h-4 animate-spin' />
				) : (
					<Plus className='w-4 h-4' />
				)}
			</Button>
		</div>
	) : (
		<Button disabled={!isCombinationValid} type='button' onClick={handleAddToCart}>
			{isPending ? (
				<Loader className='w-4 h-4 animate-spin' />
			) : (
				<Plus className='w-4 h-4' />
			)}{' '}
			Add To Cart
		</Button>
	);
};

export default AddToCart;
