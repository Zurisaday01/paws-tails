import ProductList from '@/components/product/product-list';
import ViewAllProductsButton from '@/components/view-all-products-button';
import { getLatestProducts } from '@/lib/actions/product.actions';

export default async function Home() {
	const latestProducts = await getLatestProducts();

	return (
		<>
			{/* VIDEO BANNER */}
			<video className='w-full' autoPlay controls loop muted>
				<source src='brand.mp4' type='video/mp4' />
			</video>
			<ProductList
				data={latestProducts as unknown as Product[]}
				title='Newest Arrivals'
				limit={4}
			/>
			<ViewAllProductsButton />
		</>
	);
}
