import { Badge } from '@/components/ui/badge';
import { getProductBySlug } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';

import { getMyCart } from '@/lib/actions/cart.actions';
import { auth } from '@/auth';
import Rating from '@/components/product/rating';
import ProductPrice from '@/components/product/product-price';
import ProductImages from '@/components/product/product-images';
import AddToCart from '@/components/product/add-to-cart';
import { getProductVariablePrice } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SelectVariant from '@/components/product/select-variant';
import ReviewList from '@/components/reviews/review-list';

const ProductDetailsPage = async (props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ [key: string]: string }>;
}) => {
	const { slug } = await props.params;
	// const { attributeId, productVariantId } = await props.searchParams;
	const productVariantParams = await props.searchParams;

	const product = await getProductBySlug(slug);
	if (!product) notFound();

	const session = await auth();
	const userId = session?.user?.id;

	const cart = await getMyCart();

	// variable product
	const { minPrice, maxPrice } = getProductVariablePrice(
		product as unknown as Product
	);

	const isOutOfStock = product?.variants?.every(
		(variant: ProductVariation) => variant.stock === 0
	);

	// get variant from URL
	// attributeId: attributeValueId
	// variants are combination of attribute values, so I need to get the combinations
	const currentVariant = product?.variants?.find((variant: ProductVariation) =>
		Object.entries(productVariantParams).every(
			([attributeId, attributeValueId]) =>
				variant?.attributeValues?.some(
					(attr: AttributeValue) =>
						attr.attributeId === attributeId && attr.id === attributeValueId
				)
		)
	);

	const isCurrentVariantOutOfStock = currentVariant?.stock === 0;

	const variantName = currentVariant?.attributeValues
		?.map((attr: AttributeValue) => attr.value)
		.join(' / ');

	return (
		<>
			<section>
				<div className='grid grid-cols-1 md:grid-cols-5'>
					{/* Images Column */}
					<div className='col-span-2'>
						<ProductImages images={product.images} />
					</div>
					{/* Details Column */}
					<div className='col-span-2 p-5'>
						<div className='flex flex-col gap-3'>
							<p>{product.category.name}</p>
							<h1 className='text-2xl font-bold'>{product.name}</h1>
							<Rating
								value={Number(product.rating)}
								numReviews={product.numReviews}
								location='details'
							/>
							<div>
								{product.type === 'simple' &&
									((product.stock as number) > 0 ? (
										<div className='flex flex-col gap-1 items-start'>
											<ProductPrice
												className='text-2xl text-brown-50'
												value={Number(product.price)}
											/>

											<Badge variant='outline'>In Stock</Badge>
										</div>
									) : (
										<Badge variant='destructive'>Out Of Stock</Badge>
									))}
							</div>
							<div>
								{product.type === 'variable' &&
									(!isOutOfStock ? (
										<div className='flex flex-col gap-1 items-start'>
											{Object.keys(productVariantParams).length > 0 ? (
												<div>
													{currentVariant?.salePrice ? (
														<>
															<ProductPrice
																className='text-base text-dark line-through'
																value={Number(currentVariant?.price)}
															/>
															<ProductPrice
																className='text-2xl text-brown-50'
																value={Number(currentVariant?.salePrice)}
															/>
														</>
													) : (
														<ProductPrice
															className='text-2xl text-brown-50'
															value={Number(currentVariant?.price)}
														/>
													)}
													{!isCurrentVariantOutOfStock ? (
														<Badge variant='outline'>In Stock</Badge>
													) : (
														<Badge variant='destructive'>Out Of Stock</Badge>
													)}
												</div>
											) : (
												<div>
													<div className='flex gap-2 items-center'>
														<ProductPrice
															className='text-2xl text-brown-50'
															value={Number(minPrice)}
														/>
														<span className='text-brown-50'>-</span>
														<ProductPrice
															className='text-2xl text-brown-50'
															value={Number(maxPrice)}
														/>
													</div>
													<Badge variant='outline'>In Stock</Badge>
												</div>
											)}
										</div>
									) : (
										<Badge variant='destructive'>Out Of Stock</Badge>
									))}
							</div>

							{product.type === 'variable' && (
								<SelectVariant product={product as unknown as Product} />
							)}
							<div>
								<AddToCart
									cart={cart}
									item={{
										productId: product.id,
										name: product.name,
										slug: product.slug,
										price:
											product.type === 'variable'
												? currentVariant.salePrice ?? currentVariant.price
												: product.salePrice ?? product.price,
										variant:
											product.type === 'variable' ? variantName : 'simple',
										variantId:
											product.type === 'variable'
												? currentVariant?.id
												: undefined,
										qty: 1,
										image: product.images?.[0] ?? '',
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className='mt-10'>
				<Tabs defaultValue='reviews' className='w-full'>
					<TabsList className='grid  grid-cols-2 justify-start w-full md:w-[400px]'>
						<TabsTrigger value='reviews'>Customer Reviews</TabsTrigger>
						<TabsTrigger value='description'>Description</TabsTrigger>
					</TabsList>
					<TabsContent value='reviews'>
						<div className='mt-8'>
							<ReviewList
								userId={userId || ''}
								productId={product.id}
								productSlug={product.slug}
							/>
						</div>
					</TabsContent>
					<TabsContent value='description'>
						<div className='mt-8'>
							<p>{product.description}</p>
						</div>
					</TabsContent>
				</Tabs>
			</section>
		</>
	);
};

export default ProductDetailsPage;
