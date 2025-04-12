import Link from 'next/link';
import CategoryDrawer from './category-drawer';
import Search from '@/components/search/search-header';
import Menu from './menu';
import BrandLogo from '@/components/brand-logo';

const Header = () => {
	return (
		<header className='w-full border-b'>
			<div className='wrapper flex justify-between items-center py-4'>
				<div className='flex items-center'>
					<CategoryDrawer />
					<Link href='/' className='flex-start ml-4'>
						<BrandLogo />
					</Link>
				</div>
				<div className='hidden lg:block'>
					<Search />
				</div>
				<Menu />
			</div>
		</header>
	);
};

export default Header;
