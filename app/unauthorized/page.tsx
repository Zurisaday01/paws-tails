import BrandLogo from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
	title: 'Unauthorized Access',
};

export default function UnauthorizedPage() {
	return (
		<div className='bg-gradient-to-br from-yellow-50 to-yellow-700 flex flex-col items-center justify-center min-h-screen relative'>
			<div className='absolute top-4 left-4'>
				<BrandLogo />
			</div>
			<div className='p-6 w-1/3 rounded-lg shadow-md text-center bg-white flex flex-col items-center'>
				<h1 className='text-3xl font-bold mb-4'>Unauthorized Access</h1>
				<Image
					src='/images/sad-dog.png'
					alt='404'
					className='w-[300px]'
					width={500}
					height={500}
				/>
				<p className='text-destructive mb-3'>
					You do not have permission to access this page.
				</p>
				<Button asChild>
					<Link href='/'>Back To Home</Link>
				</Button>
			</div>
		</div>
	);
}
