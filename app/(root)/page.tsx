import ProductCarousel from '@/components/product/product-carousel';
import ProductList from '@/components/product/product-list';
import ViewAllProductsButton from '@/components/view-all-products-button';
import {
	getFeaturedProducts,
	getLatestProducts,
} from '@/lib/actions/product.actions';

export default async function Home() {
	const latestProducts = await getLatestProducts();
	const featuredProducts = await getFeaturedProducts();

	return (
		<>
			<ProductCarousel data={featuredProducts as unknown as Product[]} />
			<ProductList
				data={latestProducts as unknown as Product[]}
				title='Newest Arrivals'
				limit={4}
			/>
			<ViewAllProductsButton />
			{/* <IconBoxes /> */}
		</>
	);
}
