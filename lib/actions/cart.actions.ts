'use server';

import { cookies } from 'next/headers';
import { convertToPlainObject, formatError, round2 } from '../utils';
import { auth } from '@/auth';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
	const itemsPrice = round2(
			items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
		),
		shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
		taxPrice = round2(0.15 * itemsPrice),
		totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

	return {
		itemsPrice: itemsPrice.toFixed(2),
		shippingPrice: shippingPrice.toFixed(2),
		taxPrice: taxPrice.toFixed(2),
		totalPrice: totalPrice.toFixed(2),
	};
};

export async function addItemToCart(data: CartItem) {
	try {
		const sessionCartId = (await cookies()).get('sessionCartId')?.value;
		const session = await auth();
		const userId = session?.user?.id ? (session.user.id as string) : undefined;

		const cart = await getMyCart();

		// Parse and validate item
		const item = cartItemSchema.parse({
			...data,
			price: data.price.toString(),
		});

		// Find product in database
		const product = await prisma.product.findFirst({
			where: { id: item.productId },
			include: { variants: true },
		});
		if (!product) throw new Error('Product not found');

		let variant = null;
		let availableStock = product.stock || 0; // Default to product stock for simple products

		if (product.type === 'variable') {
			// Ensure variantId is provided
			if (!item.variantId)
				throw new Error('Variant must be selected for variable products');

			// Find matching variant
			variant = product.variants.find(v => v.id === item.variantId);
			if (!variant) throw new Error('Selected variant not found');

			// Use variant-specific stock
			availableStock = variant.stock || 0;
		}

		// Check stock availability
		if (availableStock < item.qty) throw new Error('Not enough stock');

		if (!cart) {
			// Create new cart with selected item
			const newCart = insertCartSchema.parse({
				userId: userId,
				items: [item],
				sessionCartId: sessionCartId,
				...calcPrice([
					{
						...item,
						price: Number(item.price),
						variantId: item.variantId ?? undefined,
					},
				]),
			});

			await prisma.cart.create({ data: newCart });
			revalidatePath(`/product/${product.slug}`);

			return { success: true, message: `${product.name} added to cart` };
		} else {
			// Check if the exact item (product + variant) exists in cart
			const existItem = (cart.items as CartItem[]).find(
				x => x.productId === item.productId && x.variantId === item.variantId
			);

			if (existItem) {
				// Update quantity if it doesn't exceed stock
				if (availableStock < existItem.qty + 1) {
					throw new Error('Not enough stock');
				}
				existItem.qty += 1;
			} else {
				// Add new item to cart
				cart.items.push({
					...item,
					price: Number(item.price),
					variantId: item.variantId ?? undefined,
				});
			}

			// Update cart in database
			await prisma.cart.update({
				where: { id: cart.id },
				data: {
					items: cart.items as unknown as Prisma.InputJsonValue[],
					...calcPrice(cart.items as CartItem[]),
				},
			});

			revalidatePath(`/product/${product.slug}`);

			return {
				success: true,
				message: `${product.name} ${
					existItem ? 'updated in' : 'added to'
				} cart`,
			};
		}
	} catch (error) {
		console.error(error);
		return { success: false, message: formatError(error) };
	}
}

export async function getMyCart() {
	// Check for cart cookie
	const sessionCartId = (await cookies()).get('sessionCartId')?.value;
	// if (!sessionCartId) throw new Error('Cart session not found');

	// Get session and user ID
	const session = await auth();
	const userId = session?.user?.id ? (session.user.id as string) : undefined;

	// Get user cart from database
	const cart = await prisma.cart.findFirst({
		where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
	});

	if (!cart) return undefined;


	// Convert decimals and return
	return convertToPlainObject({
		...cart,
		items: cart.items as unknown as CartItem[],
		itemsPrice: cart.itemsPrice.toString(),
		totalPrice: cart.totalPrice.toString(),
		shippingPrice: cart.shippingPrice.toString(),
		taxPrice: cart.taxPrice.toString(),
	});
}

export async function removeItemFromCart(productId: string) {
	try {
		// if (!sessionCartId) throw new Error('Cart session not found');

		// Get Product
		const product = await prisma.product.findFirst({
			where: { id: productId },
		});
		if (!product) throw new Error('Product not found');

		// Get user cart
		const cart = await getMyCart();
		if (!cart) throw new Error('Cart not found');

		// Check for item
		const exist = (cart.items as CartItem[]).find(
			x => x.productId === productId
		);
		if (!exist) throw new Error('Item not found');

		// Check if only one in qty
		if (exist.qty === 1) {
			// Remove from cart
			cart.items = (cart.items as CartItem[]).filter(
				x => x.productId !== exist.productId
			);
		} else {
			// Decrease qty
			(cart.items as CartItem[]).find(x => x.productId === productId)!.qty =
				exist.qty - 1;
		}

		// Update cart in database
		await prisma.cart.update({
			where: { id: cart.id },
			data: {
				items: cart.items as Prisma.CartUpdateitemsInput[],
				...calcPrice(cart.items as CartItem[]),
			},
		});

		revalidatePath(`/product/${product.slug}`);

		return {
			success: true,
			message: `${product.name} was removed from cart`,
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
