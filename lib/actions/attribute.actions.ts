'use server';

import { z } from 'zod';
import { insertAttributeSchema } from '../validators';
import { formatError } from '../utils';

import { revalidatePath } from 'next/cache';
import { prisma } from '../db/prisma';
import { Prisma } from '@prisma/client';
import { PAGE_SIZE } from '../constants';

export const getAllAttributes = async ({
	query,
	limit = PAGE_SIZE,
	page,
}: {
	query: string;
	limit?: number;
	page: number;
}) => {
	try {
		const queryFilter: Prisma.AttributeWhereInput =
			query && query !== 'all'
				? {
						name: {
							contains: query,
							mode: 'insensitive',
						} as Prisma.StringFilter,
				  }
				: {};

		const data = await prisma.attribute.findMany({
			where: {
				...queryFilter,
			},
			include: {
				values: true,
			},
			skip: (page - 1) * limit,
			take: limit,
		});

		const dataCount = await prisma.attribute.count();

		return {
			data,
			totalPages: Math.ceil(dataCount / limit),
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export const getAllAttributesOptions = async () => {
	try {
		const data = await prisma.attribute.findMany({
			include: {
				values: true,
			},
		});

		return {
			data,
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export const getAllAttributesValues = async () => {
	try {
		const data = await prisma.attributeValue.findMany({
			include: {
				attribute: true,
			},
		});

		return {
			data,
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export const getAttributeById = async (id: string) => {
	try {
		const attribute = await prisma.attribute.findUnique({
			where: { id },
			include: {
				values: true,
			},
		});

		return attribute;
	} catch (error) {
		throw new Error(formatError(error));
	}
};

export const createAttribute = async (
	data: z.infer<typeof insertAttributeSchema>
) => {
	try {
		// Validate and parse the input data
		const { name, slug, values } = insertAttributeSchema.parse(data);
		// Create the new attribute along with its values
		await prisma.attribute.create({
			data: {
				name,
				slug,
				values: {
					create: values.map(value => ({
						value: value.value, // Value here, not the ID
					})),
				},
			},
		});

		// Revalidate the cache
		revalidatePath('/admin/attributes');

		// Return success message
		return {
			success: true,
			message: 'Attribute created successfully',
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export const updateAttribute = async (
	data: z.infer<typeof insertAttributeSchema>
) => {
	try {
		// Validate and parse the input data
		const { id, name, slug, values } = insertAttributeSchema.parse(data);

		console.log('values', values);

		// Fetch the existing attribute with its current values
		const existingAttribute = await prisma.attribute.findUnique({
			where: { id },
			include: { values: true },
		});

		if (!existingAttribute) {
			throw new Error('Attribute not found');
		}

		// Extract existing values and input values
		const existingValues = existingAttribute.values.map(v => ({
			id: v.id,
			value: v.value,
		}));

		const inputValues = values.map(v => ({
			id: v.id,
			value: v.value,
		}));

		console.log('existingValues', existingAttribute);

		// Identify new values to create (present in input but not in DB)
		// Filter out new values (non-UUIDs or not in DB)
		const valuesToCreate = inputValues.filter(
			input => !existingValues.some(ev => ev.id === input.id)
		);

		const valuesToUpdate = inputValues.filter(input => {
			const match = existingValues.find(ev => ev.id === input.id);
			return match && match.value !== input.value;
		});

		// Perform the update operation
		await prisma.$transaction(async tx => {
			// Update the attribute itself (name and slug)
			await tx.attribute.update({
				where: { id },
				data: {
					name,
					slug,
				},
			});

			if (valuesToUpdate.length > 0) {
				await Promise.all(
					valuesToUpdate.map(value =>
						tx.attributeValue.update({
							where: { id: value.id },
							data: { value: value.value },
						})
					)
				);
			}

			// Add new values
			if (valuesToCreate.length > 0) {
				await tx.attributeValue.createMany({
					data: valuesToCreate.map(value => ({
						attributeId: id,
						value: value.value, // Add the new value
					})),
				});
			}
		});

		// Revalidate the cache
		revalidatePath('/admin/attributes');

		// Return success message
		return {
			success: true,
			message: 'Attribute updated successfully',
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export async function deleteAttribute(id: string) {
	try {
		const attributeExists = await prisma.attribute.findUnique({
			where: { id },
		});

		if (!attributeExists) throw new Error('Attribute not found');

		await prisma.attribute.delete({ where: { id } });

		revalidatePath('/admin/attributes');

		return {
			success: true,
			message: 'Attribute deleted successfully',
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
