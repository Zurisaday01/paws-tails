import ProductCard from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import {
	getAllCategoriesOptions,
	getCategoryById,
} from '@/lib/actions/category.actions';
import { getAllProducts } from '@/lib/actions/product.actions';
import { pricesOptions, ratingsOptions } from '@/lib/constants';
import Link from 'next/link';
import CatalogFilters from '@/components/catalog-filters';
import { toast } from '@/hooks/use-toast';

export async function generateMetadata(props: {
	searchParams: Promise<{
		q: string;
		categoryId: string;
		price: string;
		rating: string;
	}>;
}) {
	const {
		q = 'all',
		categoryId = 'all',
		price = 'all',
		rating = 'all',
	} = await props.searchParams;

	const isQuerySet = q && q !== 'all' && q.trim() !== '';
	const isCategorySet =
		categoryId && categoryId !== 'all' && categoryId.trim() !== '';
	const isPriceSet = price && price !== 'all' && price.trim() !== '';
	const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

	if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
		const category =
			categoryId !== 'all' ? await getCategoryById(categoryId ?? '') : '';

		return {
			title: `
      Search ${isQuerySet ? q : ''} 
      ${isCategorySet ? `: Category ${(category as Category)?.name}` : ''}
      ${isPriceSet ? `: Price ${price}` : ''}
      ${isRatingSet ? `: Rating ${rating}` : ''}`,
		};
	} else {
		return {
			title: 'Catalog',
		};
	}
}

const CatalogPage = async (props: {
	searchParams: Promise<{
		q?: string;
		categoryId?: string;
		price?: string;
		rating?: string;
		sort?: string;
		page?: string;
	}>;
}) => {
	const {
		q = 'all',
		categoryId = 'all',
		price = 'all',
		rating = 'all',
		sort = 'newest',
		page = '1',
	} = await props.searchParams;

	// Construct filter url
	const getFilterUrl = ({
		c,
		p,
		r,
		pg,
	}: {
		c?: string;
		p?: string;
		r?: string;
		pg?: string;
	}) => {
		const params = { q, categoryId, price, rating, sort, page };

		if (c) params.categoryId = c;
		if (p) params.price = p;
		if (r) params.rating = r;
		if (pg) params.page = pg;


		return `/catalog?${new URLSearchParams(params).toString()}`;
	};

	const products = await getAllProducts({
		query: q,
		categoryId,
		price,
		rating,
		sort,
		page: Number(page),
	});

	const categories = await getAllCategoriesOptions();

	const category =
		categoryId !== 'all' ? await getCategoryById(categoryId ?? '') : '';

	if (!products || !categories) return null;

	return (
		<div className='grid md:grid-cols-5 md:gap-5'>
			<CatalogFilters
				getFilterUrl={getFilterUrl}
				categories={categories?.data as Category[]}
				categoryId={categoryId}
				price={price}
				pricesOptions={pricesOptions}
				rating={rating}
				ratingsOptions={ratingsOptions}
			/>

			<div className='hidden md:block'>
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
						{categories?.data?.map(x => (
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

			<div className='md:col-span-4 space-y-4'>
				<div className='flex-between flex-col md:flex-row my-4'>
					<div className='flex items-center'>
						{q !== 'all' && q !== '' && 'Query: ' + q}
						{categoryId !== 'all' &&
							categoryId !== '' &&
							' Category: ' + (category as Category)?.name}
						{price !== 'all' && ' Price: ' + price}
						{rating !== 'all' && ' Rating: ' + rating + ' stars & up'}
						&nbsp;
						{(q !== 'all' && q !== '') ||
						(categoryId !== 'all' && categoryId !== '') ||
						rating !== 'all' ||
						price !== 'all' ? (
							<Button variant='link' asChild>
								<Link href='/catalog'>Clear</Link>
							</Button>
						) : null}
					</div>
				</div>
				<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
					{products?.data?.length === 0 && <div>No products found</div>}
					{products?.data?.map((product: Product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</div>
	);
};

export default CatalogPage;
