'use client';

import { SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formActionAdminUrl } from '@/lib/constants';

export default function AdminSearch() {
	const pathname = usePathname();
	
	const searchParams = useSearchParams();
	const [queryValue, setQueryValue] = useState(searchParams.get('query') || '');
	const [path, setPath] = useState(pathname);

	// Extract the relevant segment of the pathname (e.g., 'attributes', 'products', etc.)
	const pathSegment = path.split('/')[2];

	// Find the corresponding URL from the formActionAdminUrl constant based on the pathSegment
	const formActionUrl = formActionAdminUrl.find(url =>
		url.includes(pathSegment as string)
	);

	useEffect(() => {
		setQueryValue(searchParams.get('query') || '');
	}, [searchParams]);

	useEffect(() => {
		setPath(pathname);
	}, [pathname]);


	return (
		<form action={formActionUrl} method='GET'>
			<div className='relative w-full flex items-center gap-2 '>
				<Button
					className='bg-transparent border-none hover:bg-transparent absolute left-0 top-0 z-50'
					variant='outline'>
					<SearchIcon />
				</Button>
				<Input
					type='search'
					placeholder='Search...'
					autoComplete='off'
					name='query'
					value={queryValue}
					onChange={e => setQueryValue(e.target.value)}
					className='relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pl-12 md:w-40 lg:w-64'
				/>
			</div>
		</form>
	);
}
