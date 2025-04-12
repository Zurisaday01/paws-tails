import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { getProductsCountByCategory } from '@/lib/actions/category.actions';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

const CategoryDrawer = async () => {
	const productsByCategory = await getProductsCountByCategory();

	if (!productsByCategory) return null;

	return (
		<Drawer direction='left'>
			<DrawerTrigger asChild>
				<Button variant='outline'>
					<MenuIcon />
				</Button>
			</DrawerTrigger>
			<DrawerContent className='h-full max-w-sm'>
				<DrawerHeader>
					<DrawerTitle>Select a category</DrawerTitle>
					<div className='space-y-1 mt-4'>
						{productsByCategory?.data?.map(x => (
							<Button
								variant='ghost'
								className='w-full justify-start'
								key={x.id}
								asChild>
								<DrawerClose asChild>
									<Link href={`/catalog?categoryId=${x.id}`}>
										{x.name} ({x._count.products})
									</Link>
								</DrawerClose>
							</Button>
						))}
					</div>
				</DrawerHeader>
			</DrawerContent>
		</Drawer>
	);
};

export default CategoryDrawer;
