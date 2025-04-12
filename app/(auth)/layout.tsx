import BrandLogo from '@/components/brand-logo';
import Link from 'next/link';

const AuthLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<div className='flex items-center min-h-screen w-full relative bg-gradient-to-br from-yellow-50 to-yellow-700'>
			<Link href='/' className='absolute top-4 left-4'>
				<BrandLogo />
			</Link>

			{children}
		</div>
	);
};
export default AuthLayout;
