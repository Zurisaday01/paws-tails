'use server';

import { z } from 'zod';
import { insertCategorySchema } from '../validators';
import { formatError } from '../utils';

import { revalidatePath } from 'next/cache';
import { prisma } from '../db/prisma';
import { Prisma } from '@prisma/client';
import { PAGE_SIZE } from '../constants';

export const getAllCategories = async ({
	query,
	limit = PAGE_SIZE,
	page,
}: {
	query: string;
	limit?: number;
	page: number;
}) => {
	try {
		const queryFilter: Prisma.CategoryWhereInput =
			query && query !== 'all'
				? {
						name: {
							contains: query,
							mode: 'insensitive',
						} as Prisma.StringFilter,
				  }
				: {};

		const data = await prisma.category.findMany({
			where: {
				...queryFilter,
			},
			skip: (page - 1) * limit,
			take: limit,
		});

		const dataCount = await prisma.category.count();

		return {
			data,
			totalPages: Math.ceil(dataCount / limit),
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export const getCategoriesCount = async () => {
	try {
		const data = await prisma.product.groupBy({
			by: ['categoryId'],
			_count: {
				id: true, // Counting products
			},
		});

		// Fetch category names based on categoryId
		const categories = await prisma.category.findMany({
			where: {
				id: { in: data.map(item => item.categoryId) },
			},
			select: {
				id: true,
				name: true,
			},
		});

		// Map category names with product counts
		const result = data.map(item => {
			const category = categories.find(cat => cat.id === item.categoryId);
			return {
				category: category?.name || 'Unknown',
				productsCount: item._count.id,
			};
		});

		return { data: result };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export const getAllCategoriesOptions = async () => {
	try {
		const data = await prisma.category.findMany({});

		return {
			data,
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export const getProductsCountByCategory = async () => {
	try {
		const data = await prisma.category.findMany({
			select: {
				id: true,
				name: true,
				_count: {
					select: {
						products: true,
					},
				},
			},
		});

		return {
			data,
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export const getCategoryById = async (id: string) => {
	try {
		const category = await prisma.category.findUnique({
			where: { id },
		});

		return category;
	} catch (error) {
		throw new Error(formatError(error));
	}
};

export const createCategory = async (
	data: z.infer<typeof insertCategorySchema>
) => {
	try {
		// Validate and parse the input data
		const { name, slug } = insertCategorySchema.parse(data);

		await prisma.category.create({
			data: {
				name,
				slug,
			},
		});

		// Revalidate the cache
		revalidatePath('/admin/categories');

		// Return success message
		return {
			success: true,
			message: 'Category created successfully',
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export const updateCategory = async (
	data: z.infer<typeof insertCategorySchema>
) => {
	try {
		// Validate and parse the input data
		const { id, name, slug } = insertCategorySchema.parse(data);

		const existingCategory = await prisma.category.findUnique({
			where: { id },
		});

		if (!existingCategory) {
			throw new Error('Category not found');
		}

		// Update the category
		await prisma.category.update({ where: { id }, data: { name, slug } });

		// Revalidate the cache
		revalidatePath('/admin/categories');

		// Return success message
		return {
			success: true,
			message: 'Category updated successfully',
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export async function deleteCategory(id: string) {
	try {
		const categoryExists = await prisma.category.findUnique({
			where: { id },
		});

		if (!categoryExists) throw new Error('Category not found');

		await prisma.category.delete({ where: { id } });

		revalidatePath('/admin/categories');

		return {
			success: true,
			message: 'Category deleted successfully',
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
