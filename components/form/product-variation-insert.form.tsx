'use client';

import {
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { insertProductSchema } from '@/lib/validators';
import { UseFormRegister } from 'react-hook-form';
import { z } from 'zod';

interface ProductVatiationInsertFormProps {
	register: UseFormRegister<NonNullable<z.infer<typeof insertProductSchema>>>; // The register function from react-hook-form
	index: number;
}

const ProductVariationInsertForm = ({
	index,
	register,
}: ProductVatiationInsertFormProps) => {
	return (
		<div className='w-[600px]'>
			<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
				<FormItem>
					<FormLabel>Price</FormLabel>
					<FormControl>
						<Input
							type='number'
							autoComplete='off'
							{...register(`variants.${index}.price` as const)}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>

				<FormItem>
					<FormLabel>Sale Price</FormLabel>
					<FormControl>
						<Input
							type='number'
							autoComplete='off'
							{...register(`variants.${index}.salePrice` as const)}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>

				<FormItem>
					<FormLabel>Stock</FormLabel>
					<FormControl>
						<Input
							type='number'
							autoComplete='off'
							{...register(`variants.${index}.stock` as const)}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			</div>
		</div>
	);
};
export default ProductVariationInsertForm;
