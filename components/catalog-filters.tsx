import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ChevronsDown } from 'lucide-react';
import ProductsFilters from '@/app/(root)/catalog/products-filters';

interface CatalogFiltersProps {
	categories: Category[];
	pricesOptions: { value: string; name: string }[];
	ratingsOptions: number[];
}

const CatalogFilters = ({
	categories,
	pricesOptions,
	ratingsOptions,
}: CatalogFiltersProps) => {
	return (
		<Sheet>
			<SheetTrigger className='block md:hidden' asChild>
				<Button variant='outline' className='w-full'>
					Filters
					<ChevronsDown className='h-4 w-4' />
				</Button>
			</SheetTrigger>
			<SheetContent side='top'>
				<SheetHeader>
					<SheetTitle></SheetTitle>
					<SheetDescription></SheetDescription>
				</SheetHeader>
				<div>
					<ProductsFilters
						categories={categories || []}
						pricesOptions={pricesOptions}
						ratingsOptions={ratingsOptions}
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
};
export default CatalogFilters;
