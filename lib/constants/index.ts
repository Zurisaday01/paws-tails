// metadata
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Paws & Tails';
export const APP_DESCRIPTION =
	process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'E-commerce site for pet supplies';

export const MAX_FILE_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
];
// server
export const SERVER_URL =
	process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

// products
export const LATEST_PRODUCTS_LIMIT =
	Number(process.env.LATEST_PRODUCTS_LIMIT) || 5;

// form default values
export const reviewFormDefaultValues = {
	title: '',
	comment: '',
	rating: 0,
};

export const signInDefaultValues = {
	email: 'admin@example.com',
	password: 'admin',
};

export const signUpDefaultValues = {
	name: '',
	email: '',
	password: '',
	confirmPassword: '',
};

export const shippingAddressDefaultValues = {
	fullName: '',
	streetAddress: '',
	city: '',
	postalCode: '',
	country: '',
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
	? process.env.PAYMENT_METHODS.split(', ')
	: ['PayPal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD =
	process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 8;

export const productDefaultValues = {
	name: '',
	slug: '',
	category: '',
	images: [],
	brand: '',
	description: '',
	price: '0',
	stock: 0,
	rating: '0',
	numReviews: '0',
	isFeatured: false,
	banner: null,
};

export const USER_ROLES = process.env.USER_ROLES
	? process.env.USER_ROLES.split(', ')
	: ['admin', 'user'];

export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

export const navItems: NavItem[] = [
	{
		title: 'Dashboard',
		url: '/admin/overview',
		icon: 'dashboard',
		isActive: false,
		items: [], // Empty array as there are no child items for Dashboard
	},
	{
		title: 'Orders',
		url: '/admin/orders',
		icon: 'package',
		isActive: false,
		items: [], // No child items
	},
	{
		title: 'Products',
		url: '/admin/products',
		icon: 'product',
		isActive: false,
		items: [], // No child items
	},
	{
		title: 'Users',
		url: '/admin/users', // Placeholder as there is no direct link for the parent
		icon: 'users',
		isActive: false,
	},
	{
		title: 'Attributes',
		url: '/admin/attributes',
		icon: 'square-menu',
		isActive: false,
		items: [], // No child items
	},
	{
		title: 'Categories',
		url: '/admin/categories',
		icon: 'category',
		isActive: false,
		items: [], // No child items
	},
];

export const formActionAdminUrl = [
	'/admin/attributes',
	'/admin/categories',
	'/admin/products',
	'/admin/users',
	'/admin/orders',
];

export const pricesOptions = [
	{
		name: '$1 to $50',
		value: '1-50',
	},
	{
		name: '$51 to $100',
		value: '51-100',
	},
	{
		name: '$101 to $200',
		value: '101-200',
	},
	{
		name: '$201 to $500',
		value: '201-500',
	},
	{
		name: '$501 to $1000',
		value: '501-1000',
	},
];

export const ratingsOptions = [4, 3, 2, 1];

export const sortOrdersOptionsCatalog = [
	{
		value: 'newest',
		label: 'New to Old',
	},
	{
		value: 'oldest',
		label: 'Old to New',
	},
	{
		value: 'lowest',
		label: 'Price: Low to High',
	},
	{
		value: 'highest',
		label: 'Price: High to Low',
	},
	{
		value: 'rating',
		label: 'Avg. Customer Review',
	},
];
