import {  buttonVariants } from '@/components/ui/button';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Suspense } from 'react';
import { Heading } from '@/components/ui/heading';
import { DataTableSkeleton } from '@/components/table/data-table=skeleton';
import PageContainer from '@/components/layout/dashboard/page-container';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/tables/attributes/columns';
import Pagination from '@/components/pagination';
import Link from 'next/link';
import { getAllAttributes } from '@/lib/actions/attribute.actions';

export const metadata = {
	title: 'Dashboard : Attributes',
};

const AttributesPage = async (props: {
	searchParams: Promise<{
		page: string;
		query: string;
		category: string;
	}>;
}) => {
	const searchParams = await props.searchParams;
	const page = Number(searchParams.page) || 1;
	const searchText = searchParams.query || '';

	const attributes = await getAllAttributes({
		query: searchText,
		page,
	});


	if (!attributes ) return null;

	const { data = [], totalPages = 1 } = attributes;

	return (
		<PageContainer scrollable={false}>
			<div className='flex flex-1 flex-col space-y-4'>
				<div className='flex items-start justify-between'>
					<Heading
						title='Attributes'
						description='Manage your product attributes like color, size, and more.'
					/>
					<Link
						href='/admin/attributes/create'
						className={cn(buttonVariants(), 'text-xs md:text-sm')}>
						<Plus className='mr-2 h-4 w-4' /> Add New
					</Link>
				</div>
	
				<Separator />

				<Suspense
					key={''}
					fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}>
					<>
						<DataTable columns={columns} data={data as Attribute[]} />

						{totalPages > 1 && (
							<Pagination page={page} totalPages={totalPages} />
						)}
					</>
				</Suspense>
			</div>
		</PageContainer>
	);
};

export default AttributesPage;
