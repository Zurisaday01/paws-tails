import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { removeItemFromCart } from '@/lib/actions/cart.actions';
import { Loader, Minus } from 'lucide-react';
import { useTransition } from 'react';

const RemoveButton = ({ item }: { item: CartItem }) => {
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();

	const handleRemoveItem = () => {
		startTransition(async () => {
			const res = await removeItemFromCart(item.productId);

			if (!res.success) {
				toast({
					variant: 'destructive',
					description: res.message,
				});
			}
		});
	};

	return (
		<Button
			disabled={isPending}
			variant='outline'
			type='button'
			onClick={handleRemoveItem}>
			{isPending ? (
				<Loader className='w-4 h-4 animate-spin' />
			) : (
				<Minus className='w-4 h-4' />
			)}
		</Button>
	);
};

export default RemoveButton;
