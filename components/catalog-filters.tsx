import Link from 'next/link';

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

interface CatalogFiltersProps {
	getFilterUrl: (filter: { c?: string; p?: string; r?: string }) => string;
	categories: Category[];
	categoryId: string;
	price: string;
	pricesOptions: { value: string; name: string }[];
	rating: string;
	ratingsOptions: number[];
}

const CatalogFilters = ({
	getFilterUrl,
	categories,
	categoryId,
	price,
	pricesOptions,
	rating,
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
					{/* Category Links */}
					<div className='text-xl mb-2 mt-3'>Department</div>
					<div>
						<ul className='space-y-1'>
							<li>
								<Link
									className={`${
										(categoryId === 'all' || categoryId === '') && 'font-bold'
									}`}
									href={getFilterUrl({ c: 'all' })}>
									Any
								</Link>
							</li>
							{categories?.map(x => (
								<li key={x.id}>
									<Link
										className={`${categoryId === x.id && 'font-bold'}`}
										href={getFilterUrl({ c: x.id })}>
										{x.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
					{/* Price Links */}
					<div className='text-xl mb-2 mt-8'>Price</div>
					<div>
						<ul className='space-y-1'>
							<li>
								<Link
									className={`${price === 'all' && 'font-bold'}`}
									href={getFilterUrl({ p: 'all' })}>
									Any
								</Link>
							</li>
							{pricesOptions.map(p => (
								<li key={p.value}>
									<Link
										className={`${price === p.value && 'font-bold'}`}
										href={getFilterUrl({ p: p.value })}>
										{p.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
					{/* Rating Links */}
					<div className='text-xl mb-2 mt-8'>Customer Ratings</div>
					<div>
						<ul className='space-y-1'>
							<li>
								<Link
									className={`${rating === 'all' && 'font-bold'}`}
									href={getFilterUrl({ r: 'all' })}>
									Any
								</Link>
							</li>
							{ratingsOptions.map(r => (
								<li key={r}>
									<Link
										className={`${rating === r.toString() && 'font-bold'}`}
										href={getFilterUrl({ r: `${r}` })}>
										{`${r} stars & up`}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};
export default CatalogFilters;
