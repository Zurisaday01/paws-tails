import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EllipsisVertical, ShoppingCart } from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import UserButton from '@/components/auth/user-button';
import ModeToggle from '@/components/mode-toggle';
import Search from '@/components/search/search-header';

const Menu = () => {
	return (
		<div className='flex gap-3'>
			<nav className='hidden lg:flex w-full max-w-xs gap-1'>
				<ModeToggle />
				<Button asChild variant='ghost'>
					<Link href='/cart'>
						<ShoppingCart /> Cart
					</Link>
				</Button>
				<UserButton />
			</nav>
			<nav className='lg:hidden'>
				<Sheet>
					<SheetTrigger>
						<EllipsisVertical />
					</SheetTrigger>
					<SheetContent className='flex flex-col items-start'>
						<SheetTitle className='text-lg font-bold'></SheetTitle>
						<Button asChild variant='ghost' className='w-full'>
							<Link href='/cart'>
								<ShoppingCart /> Cart
							</Link>
						</Button>
						<Search />
						<ModeToggle />
						<UserButton />
						<SheetDescription></SheetDescription>
					</SheetContent>
				</Sheet>
			</nav>
		</div>
	);
};

export default Menu;
