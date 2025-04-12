import Footer from '@/components/layout/root/footer';
import Header from '@/components/layout/root/header';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className='flex h-screen flex-col'>
			<Header />
			<main className='flex-1 wrapper'>{children}</main>
			<Footer />
		</div>
	);
}
