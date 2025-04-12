'use client';

import BrandLogo from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const NotFoundPage = () => {
	return (
		<div className='bg-gradient-to-br from-yellow-50 to-yellow-700 flex flex-col items-center justify-center min-h-screen relative'>
			<div className='absolute top-4 left-4'>
				<BrandLogo />
			</div>
			<div className='p-6 w-1/3 rounded-lg shadow-md text-center bg-white flex flex-col items-center'>
				<h1 className='text-3xl font-bold mb-4'>Not Found</h1>
				<Image src='/images/sad-dog.png' alt='404' className='w-[300px]' width={500} height={500} />
				<p className='text-destructive'>Could not find requested page</p>
				<Button
					variant='outline'
					className='mt-4 ml-2'
					onClick={() => (window.location.href = '/')}>
					Back To Home
				</Button>
			</div>
		</div>
	);
};
export default NotFoundPage;
