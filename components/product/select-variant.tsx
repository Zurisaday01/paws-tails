'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { getParamsObject } from '@/lib/utils';

const SelectVariant = ({ product }: { product: Product }) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	// Update URL parameters when a variant is selected
	const handleSelectVariant = (attributeId: string, variantId: string) => {
		const params = getParamsObject(searchParams);
		params[attributeId] = variantId; // Update or add the selected variant

		// Construct new search params string
		const searchString = new URLSearchParams(params).toString();

		// Update the URL without page reload
		router.replace(`${pathname}?${searchString}`);
	};

	return (
		<div>
			{product.attributes.map(attr => (
				<div key={attr.id}>
					<div className='flex items-center gap-2 mt-3 mb-3'>
						<h2 className='font-bold'>{attr.name}:</h2>
						<div className='flex gap-2 items-center'>
							{product?.attributeValues
								?.filter(attrVal => attrVal.attributeId === attr.id)
								?.map(attributeValue => (
									<div key={attributeValue.id}>
										<div className='flex'>
											<Button
												key={attributeValue.id}
												variant='ghost'
												className={
													searchParams.get(attr.id) === attributeValue.id
														? 'bg-brown-50 text-white hover:bg-brown-50/50' // Selected
														: ''
												}
												onClick={() =>
													handleSelectVariant(attr.id, attributeValue.id)
												}>
												{attributeValue?.value}
											</Button>
										</div>
									</div>
								))}
						</div>
					</div>
					<Separator />
				</div>
			))}
		</div>
	);
};

export default SelectVariant;
