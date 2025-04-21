import Image from 'next/image';

const BrandLogo = () => {
	return (
		<div className='flex items-center justify-center'>
			<Image
				src='/images/logo.png'
				alt='logo'
				width={100}
				height={100}
				className='w-[80px]'
			/>
			<div className='text-xl md:text-2xl font-bold text-center'>
				<span className='text-brown-100 dark:text-yellow-700'>Paws</span>{' '}
				<span className='text-brown-50'>&</span>{' '}
				<span className='text-brown-200 dark:text-white'>Tails</span>
			</div>
		</div>
	);
};
export default BrandLogo;
