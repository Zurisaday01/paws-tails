import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { addItemToCart } from '@/lib/actions/cart.actions';
import { Loader, Plus } from 'lucide-react';
import { useTransition } from 'react';

const AddButton = ({ item }: { item: CartItem }) => {
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();

	const handleAddItem = () => {
		startTransition(async () => {
			const res = await addItemToCart(item);

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
			onClick={handleAddItem}>
			{isPending ? (
				<Loader className='w-4 h-4 animate-spin' />
			) : (
				<Plus className='w-4 h-4' />
			)}
		</Button>
	);
};

export default AddButton;
