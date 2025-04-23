import { type ClientUploadedFileData } from 'uploadthing/types';
import {
	insertOrderItemSchema,
	insertCartSchema,
	shippingAddressSchema,
} from '../lib/validators';

declare global {
	// prisma schema
	interface NavItem {
		title: string;
		url: string;
		icon: string;
		isActive?: boolean;
		items?: NavItem[];
	}
	// todo: make table schema: blue, pink...
	interface AttributeValue {
		id: string;
		value: string;
		attribute?: Attribute;
		attributeId?: string;
	}

	interface Attribute {
		id: string;
		name: string;
		slug: string;
		values: AttributeValue[];
	}

	interface Category {
		id: string;
		name: string;
		slug: string;
	}

	interface InsertProduct {
		id: string;
		name: string;
		slug: string;
		categoryId: string;
		brand: string;
		description: string;
		stock: number;
		type: string;
		price: number | null;
		salePrice: number | null;
		stock: number | null;
		attributeValues?: AttributeValue[];
		variants?: ProductVariation[];
		images: string[];
	}

	// Define the structure for the option
	interface MultiOption {
		value: string;
		label: string;
	}

	interface MultiSelectProps {
		options: MultiOption[];
		onValueChange: (selectedValues: string[]) => void;
		variant?: 'default' | 'secondary' | 'destructive' | 'inverted';
		defaultValue?: string[];
		placeholder?: string;
		animation?: number;
		maxCount?: number;
		modalPopover?: boolean;
		className?: string;
	}
	// from the attribute's values
	interface ProductVariation {
		id: string;
		variationId: string; // AttributeValue id
		productId: string;
		stock: number;
		price: number;
		salePrice: number;
		attributeValues?: AttributeValue[];
	}

	interface Product {
		id: string;
		name: string;
		slug: string;
		category: Category;
		description: string;
		stock: number;
		type: string;
		images: string[];
		variants?: ProductVariation[];
		attributes: Attribute[];
		attributeValues: AttributeValue[];
		price: number | null;
		salePrice: number | null;
		rating?: string;
		numReviews?: number;
		createdAt?: Date;
	}

	type UploadedFile<T = unknown> = ClientUploadedFileData<T>;
	export type Order = z.infer<typeof insertOrderSchema> & {
		id: string;
		createdAt: Date;
		isPaid: boolean;
		paidAt: Date | null;
		isDelivered: boolean;
		deliveredAt: Date | null;
		orderitems: OrderItem[];
		user: { name: string; email: string };
		paymentResult: PaymentResult;
	};

	type OrderItem = z.infer<typeof insertOrderItemSchema>;

	export type Cart = z.infer<typeof insertCartSchema>;
	// export type CartItem = z.infer<typeof cartItemSchema>;
	export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
	export type PaymentResult = z.infer<typeof paymentResultSchema>;

	export interface CartItem {
		productId: string;
		name: string;
		slug: string;
		price: number;
		qty: number;
		variant: string;
		variantId?: string;
		image: string;
	}

	type Review = z.infer<typeof insertReviewSchema> & {
		id: string;
		createdAt: Date;
		user?: { name: string };
	};
}

export {};
