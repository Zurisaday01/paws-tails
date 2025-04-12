'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import Link from 'next/link';

const ClearAdminSearch = () => {
	const searchParams = useSearchParams();
    const pathname = usePathname();
	const searchText = searchParams.get('query') || '';

	return (
		<div>
			{searchText && (
				<div className='text-sm font-bold'>
					Filtered by <i>&quot;{searchText}&quot;</i>{' '}
					<Link href={pathname} className='ml-2'>
						<Button variant='outline' size='sm'>
							Remove Filter
							<RotateCcw className='h-4 w-4' />
						</Button>
					</Link>
				</div>
			)}
		</div>
	);
};
export default ClearAdminSearch;
