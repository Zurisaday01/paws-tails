'use client';
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { UserNav } from '@/components/layout/dashboard/user-nav';
import ModeToggle from '@/components/mode-toggle';
import AdminSearch from '@/components/search/admin-search';
import ClearAdminSearch from '@/components/search/clear-admin-search';
import { usePathname } from 'next/navigation';

const allowSearchInput = [
	'/admin/products',
	'/admin/orders',
	'/admin/users',
	'/admin/categories',
	'/admin/attributes',
];

export default function Header() {
	const pathname = usePathname();

	console.log(pathname);

	return (
		<header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
			<div className='flex items-center gap-2 px-4'>
				<SidebarTrigger className='-ml-1' />
				<Separator orientation='vertical' className='mr-2 h-4' />
			</div>

			<div className='flex items-center gap-2 px-4'>
				{allowSearchInput.includes(pathname) && (
					<div className='hidden md:flex gap-2 items-center'>
						<ClearAdminSearch />
						<AdminSearch />
					</div>
				)}

				<UserNav />
				<ModeToggle />
			</div>
		</header>
	);
}
