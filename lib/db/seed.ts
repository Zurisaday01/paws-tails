import { PrismaClient } from '@prisma/client';
// import { usersSampleData } from './sample-data';
// import { hash } from '@/lib/encrypt';

async function main() {
	const prisma = new PrismaClient();
	// before seeding the database, delete all the data from the tables
	// await prisma.account.deleteMany();
	// await prisma.session.deleteMany();
	// await prisma.verificationToken.deleteMany();
	// await prisma.user.deleteMany();

	await prisma.product.deleteMany();

	// const users = [];
	// for (let i = 0; i < usersSampleData.length; i++) {
	// 	// push the user data to the users array, but hash the password first
	// 	users.push({
	// 		...usersSampleData[i],
	// 		password: await hash(usersSampleData[i].password),
	// 	});
	// }
	// // create the users in the database
	// await prisma.user.createMany({ data: users });

	console.log('Database seeded successfully!');
}

main();
