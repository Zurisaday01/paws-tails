'use server';
import { z } from 'zod';
import { insertProductSchema } from '../validators';
import { prisma } from '../db/prisma';
import { revalidatePath } from 'next/cache';
import { convertToPlainObject, formatError } from '../utils';
import { Prisma } from '@prisma/client';
import { LATEST_PRODUCTS_LIMIT } from '../constants';

export async function getLatestProducts() {
	const data = await prisma.product.findMany({
		take: LATEST_PRODUCTS_LIMIT,
		orderBy: { createdAt: 'desc' },
		include: {
			category: true,
			attributes: true,
			attributeValues: true,
			variants: {
				include: {
					attributeValues: {
						include: {
							attribute: true,
						},
					},
				},
			},
		},
	});

	return convertToPlainObject(data);
}

export const createProduct = async (
	data: z.infer<typeof insertProductSchema>
) => {
	try {
		// Validate and parse the input data
		const {
			name,
			slug,
			categoryId,
			type,
			description,
			stock,
			images,
			price,
			salePrice,
			attributes,
			variants,
			attributeValues,
		} = insertProductSchema.parse(data);
		// Create the new attribute along with its values

		// if it is a variations
		if (type === 'variable') {
			await prisma.product.create({
				data: {
					name,
					slug,
					categoryId,
					type,
					description,
					stock,
					images,
					price,
					salePrice,
					attributes: {
						connect: attributes?.map(attribute => ({
							id: attribute.id,
						})),
					},
					attributeValues: {
						connect: attributeValues?.map(value => ({
							id: value.attributeValueId,
						})),
					},
					variants: {
						create: variants?.map(variant => ({
							stock: variant.stock ?? 0,
							price: variant.price ?? '0',
							salePrice: variant.salePrice ?? '0',
							attributeValues: {
								connect: variant.attributeValues.map(valueId => ({
									id: valueId,
								})),
							},
						})),
					},
				},
			});
		}

		if (type === 'simple') {
			await prisma.product.create({
				data: {
					name,
					slug,
					categoryId,
					type,
					description,
					stock,
					images,
					price,
					salePrice,
				},
			});
		}

		// Revalidate the cache
		revalidatePath('/admin/products');

		// Return success message
		return {
			success: true,
			message: 'Product created successfully',
		};
	} catch (error) {
		console.log('error', (error as Error).message);
		return { success: false, message: formatError(error) };
	}
};

export const updateProduct = async (
	data: z.infer<typeof insertProductSchema> // Assumed to be your validation schema for updating products
) => {
	try {
		// Validate and parse the input data
		const {
			id, // Product ID to update
			name,
			slug,
			categoryId,
			type,
			description,
			stock,
			images,
			price,
			salePrice,
			attributes,
			variants, // Updated list of variants
			attributeValues,
		} = insertProductSchema.parse(data);

		// Handle the 'variable' product type (with variants)
		if (type === 'variable') {
			// First, update the main product fields
			await prisma.product.update({
				where: { id },
				data: {
					name,
					slug,
					categoryId,
					type,
					description,
					stock,
					images,
					price,
					salePrice,
					attributes: {
						connect: attributes?.map(attribute => ({
							id: attribute.id,
						})),
					},
					attributeValues: {
						connect: attributeValues?.map(value => ({
							id: value.attributeValueId,
						})),
					},
				},
			});

			// Get the current variants for this product
			const currentVariants = await prisma.productVariation.findMany({
				where: { productId: id },
			});
			// Create or update the remaining variants
			await Promise.all(
				variants?.map(async variant => {
					if (currentVariants.some(v => v.id === variant.id)) {
						// If the variant already exists, update it
						await prisma.productVariation.update({
							where: { id: variant.id },
							data: {
								stock: variant.stock ?? 0,
								price: variant.price ?? '0',
								salePrice: variant.salePrice ?? '0',
								attributeValues: {
									connect: variant.attributeValues.map(valueId => ({
										id: valueId,
									})),
								},
							},
						});
					} else {
						// If it's a new variant, create it
						await prisma.productVariation.create({
							data: {
								stock: variant.stock ?? 0,
								price: variant.price ?? '0',
								salePrice: variant.salePrice ?? '0',
								productId: id, // Make sure to associate with the correct product
								attributeValues: {
									connect: variant.attributeValues.map(valueId => ({
										id: valueId,
									})),
								},
							},
						});
					}
				}) ?? []
			);
		}

		// Handle the 'simple' product type (no variants)
		if (type === 'simple') {
			await prisma.product.update({
				where: { id },
				data: {
					name,
					slug,
					categoryId,
					type,
					description,
					stock,
					images,
					price,
					salePrice,
				},
			});
		}

		// Revalidate the cache after update
		revalidatePath('/admin/products');

		// Return success message
		return {
			success: true,
			message: 'Product updated successfully',
		};
	} catch (error) {
		console.log('error', (error as Error).message);
		return { success: false, message: formatError(error) };
	}
};

export const getAllProducts = async ({
	query,
	limit = 10,
	page,
	categoryId,
	price,
	rating,
	sort,
}: {
	query: string;
	limit?: number;
	page: number;
	categoryId?: string;
	price?: string;
	rating?: string;
	sort?: string;
}) => {
	try {
		const queryFilter: Prisma.ProductWhereInput =
			query && query !== 'all'
				? {
						name: {
							contains: query,
							mode: 'insensitive',
						} as Prisma.StringFilter,
				  }
				: {};

		// Category filter
		const categoryFilter =
			categoryId && categoryId !== 'all'
				? { category: { id: categoryId } }
				: {};

		// Price filter
		const priceFilter: Prisma.ProductWhereInput =
			price && price !== 'all'
				? {
						OR: [
							// For simple products, check price directly
							{
								type: 'simple',
								price: {
									gte: Number(price.split('-')[0]),
									lte: Number(price.split('-')[1]),
								},
							},
							// For variable products, if some of the variations price falls in the range
							{
								type: 'variable',
								variants: {
									some: {
										price: {
											gte: Number(price.split('-')[0]),
											lte: Number(price.split('-')[1]),
										},
									},
								},
							},
						],
				  }
				: {};

		// Rating filter
		const ratingFilter =
			rating && rating !== 'all'
				? {
						rating: {
							gte: Number(rating),
						},
				  }
				: {};

		const data = await prisma.product.findMany({
			include: {
				category: true,
				attributes: true,
				attributeValues: true,
				variants: {
					include: {
						attributeValues: {
							include: {
								attribute: true,
							},
						},
					},
				},
			},
			where: {
				...queryFilter,
				...categoryFilter,
				...priceFilter,
				...ratingFilter,
			},
			orderBy:
				sort === 'rating'
					? { rating: 'desc' }
					: sort === 'oldest'
					? { createdAt: 'asc' }
					: { createdAt: 'desc' }, // default is newest

			skip: (page - 1) * limit,
			take: limit,
		});

		const dataCount = await prisma.category.count();

		return {
			data: JSON.parse(JSON.stringify(data)),
			totalPages: Math.ceil(dataCount / limit),
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export const getReviewsCount = async (productId: string) => {
	try {
		const data = await prisma.review.count({
			where: {
				productId,
			},
		});

		return {
			success: true,
			data,
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

// for the product details page
export async function getProductBySlug(slug: string) {
	const product = await prisma.product.findUnique({
		where: { slug: slug },
		include: {
			category: true,
			attributes: true,
			attributeValues: true,
			variants: {
				include: {
					attributeValues: {
						include: {
							attribute: true,
						},
					},
				},
			},
		},
	});

	return JSON.parse(JSON.stringify(product));
}

export const getProductById = async (id: string) => {
	const product = await prisma.product.findUnique({
		where: { id },
		include: {
			category: true,
			attributes: true,
			attributeValues: {
				include: {
					attribute: true,
				},
			},
			variants: {
				include: {
					attributeValues: {
						include: {
							attribute: true,
						},
					},
				},
			},
		},
	});

	return JSON.parse(JSON.stringify(product));
};

export const deleteProduct = async (id: string) => {
	try {
		await prisma.product.delete({
			where: {
				id,
			},
		});

		// Revalidate the cache
		revalidatePath('/admin/products');

		return {
			success: true,
			message: 'Product deleted successfully',
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export const getTopSellingProducts = async () => {
	try {
		const data = await prisma.orderItem.groupBy({
			by: ['productId', 'name'],
			_sum: {
				qty: true,
			},
			orderBy: {
				_sum: {
					qty: 'desc',
				},
			},
			take: 10, // Get the top 10 best-selling products
		});

		return {
			data,
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};
