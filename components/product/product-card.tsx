import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Rating from './rating';
import ProductPrice from './product-price';
import { Badge } from '../ui/badge';
import { getProductVariablePrice } from '@/lib/utils';

const ProductCard = ({ product }: { product: Product }) => {
	// variable product
	const { minPrice, maxPrice } = getProductVariablePrice(product);

	const isOutOfStock = product?.variants?.every(variant => variant.stock === 0);

	return (
		<Card className='w-full max-w-sm border-none shadow-none'>
			<CardHeader className='p-0 items-center'>
				<Link
					href={`/product/${product.slug}`}
					className='relative h-[250px] w-full'>
					{/* image cover is the first from the images collection */}
					<Image
						src={product.images[0]}
						alt={product.name}
						height={300}
						width={300}
						priority={true}
						className='object-cover object-center w-full h-full'
					/>
				</Link>
			</CardHeader>
			<CardContent className='p-0 pt-4 flex flex-col gap-2 h-[180px]'>
				<Link href={`/product/${product.slug}`} className="min-w-0">
					<h2 className='text-lg font-medium block truncate w-full'>{product.name}</h2>
				</Link>
				<div className='flex flex-col gap-2'>
					<div className='text-xs text-muted-foreground'>{product.category.name}</div>
					<div>
						{product.type === 'simple' &&
							(product.stock > 0 ? (
								<ProductPrice value={Number(product.price)} />
							) : (
								<Badge variant='destructive'>Out Of Stock</Badge>
							))}
					</div>
					<div>
						{product.type === 'variable' &&
							(!isOutOfStock ? (
								<div className='flex gap-2 items-center'>
									<ProductPrice value={Number(minPrice)} />
									<span>-</span>
									<ProductPrice value={Number(maxPrice)} />
								</div>
							) : (
								<Badge variant='destructive'>Out Of Stock</Badge>
							))}
					</div>
					<Rating
						value={Number(product.rating)}
						numReviews={product.numReviews as number}
					/>
				</div>
			</CardContent>
		</Card>
	);
};

export default ProductCard;
