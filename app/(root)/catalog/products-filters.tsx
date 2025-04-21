'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useTransition } from 'react';

type Props = {
	categories: Category[];
	pricesOptions: { name: string; value: string }[];
	ratingsOptions: number[];
};

const ProductsFilters = ({
	categories,
	pricesOptions,
	ratingsOptions,
}: Props) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const handleChange = (key: string, value: string) => {
		const params = new URLSearchParams(searchParams);
		if (value === 'all') {
			params.delete(key);
		} else {
			params.set(key, value);
		}

		startTransition(() => {
			router.push(`/catalog?${params.toString()}`, { scroll: false });
		});
	};

	useEffect(() => {
		if (isPending) {
			toast({
				title: 'Loading...',
				description: 'Please wait while we load the products',
				duration: 500,
			});
		}
	}, [isPending]);

	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-lg text-brown-100 dark:text-brown-50 font-bold mb-2 mt-3'>
					Department
				</h2>
				<ul>
					<li>
						<Button
							disabled={isPending}
							variant='link'
							onClick={() => handleChange('categoryId', 'all')}>
							Any
						</Button>
					</li>
					{categories.map(c => (
						<li key={c.id}>
							<Button
								disabled={isPending}
								variant='link'
								onClick={() => handleChange('categoryId', c.id)}>
								{c.name}
							</Button>
						</li>
					))}
				</ul>
			</div>

			<div>
				<h2 className='text-lg text-brown-100 dark:text-brown-50 font-bold mb-2 mt-3'>Price</h2>
				<ul>
					{pricesOptions.map(p => (
						<li key={p.name}>
							<Button
								disabled={isPending}
								variant='link'
								onClick={() => handleChange('price', p.value)}>
								{p.name}
							</Button>
						</li>
					))}
				</ul>
			</div>

			<div>
				<h2 className='text-lg text-brown-100 dark:text-brown-50 font-bold mb-2 mt-3'>Rating</h2>
				<ul>
					{ratingsOptions.map(r => (
						<li key={r}>
							<Button
								disabled={isPending}
								variant='link'
								onClick={() => handleChange('rating', `${r}`)}>
								{r} stars & up
							</Button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
export default ProductsFilters;
