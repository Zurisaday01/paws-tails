'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/product-card';

const ProductsList = () => {
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(true);
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);

			const params = new URLSearchParams(searchParams.toString());
			const res = await fetch(`/catalog?${params}`);
			const data = await res.json();

      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }



			setProducts(data.products);
			setLoading(false);
		};

		fetchProducts();
	}, [searchParams]);

	if (loading) return <div>Loading...</div>;

	if (products.length === 0) return <div>No products found</div>;

	return (
		<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
			{products.map((product: Product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
};

export default ProductsList;
