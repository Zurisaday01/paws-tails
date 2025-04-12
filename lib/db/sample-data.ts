	import { hashSync } from 'bcrypt-ts-edge';

	export const usersSampleData = [
		{
			name: 'Zury',
			email: 'admin@example.com',
			password: hashSync('123456', 10),
			role: 'admin',
		},
		{
			name: 'Kazi',
			email: 'user@example.com',
			password: hashSync('123456', 10),
			role: 'user',
		},
	];


	export const productsSampleData = [

		
	]