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
import ProductsFilters from './products-filters';

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
				categories={categories?.data as Category[]}
				pricesOptions={pricesOptions}
				ratingsOptions={ratingsOptions}
			/>

			<div className='hidden md:block'>
				<ProductsFilters
					categories={categories?.data || []}
					pricesOptions={pricesOptions}
					ratingsOptions={ratingsOptions}
				/>
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

				<div className='grid grid-cols-1 gap-4 justify-items-center md:grid-items-start md:grid-cols-3'>
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
