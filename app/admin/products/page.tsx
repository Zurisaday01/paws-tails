import { getAllProducts } from '@/lib/actions/product.actions';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Suspense } from 'react';
import { Heading } from '@/components/ui/heading';
import { DataTableSkeleton } from '@/components/table/data-table=skeleton';
import PageContainer from '@/components/layout/dashboard/page-container';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/tables/products/columns';
import Pagination from '@/components/pagination';
import Link from 'next/link';

export const metadata = {
	title: 'Dashboard : Products',
};

const ProductsPage = async (props: {
	searchParams: Promise<{
		page: string;
		query: string;
	}>;
}) => {
	const searchParams = await props.searchParams;
	const page = Number(searchParams.page) || 1;
	const searchText = searchParams.query || '';

	const products = await getAllProducts({
		query: searchText,
		page,
	});
	if (!products) return null;

	const { data = [], totalPages = 1 } = products;

	return (
		<PageContainer scrollable={false}>
			<div className='flex flex-1 flex-col space-y-4'>
				<div className='flex items-start justify-between'>
					<Heading
						title='Products'
						description='Manage your products efficiently.'
					/>
					<Link
						href='/admin/products/create'
						className={cn(buttonVariants(), 'text-xs md:text-sm')}>
						<Plus className='mr-2 h-4 w-4' /> Add New
					</Link>
				</div>

				<Separator />

				<Suspense
					key={''}
					fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}>
					<>
						<DataTable columns={columns} data={data} />

						{totalPages > 1 && (
							<Pagination page={page} totalPages={totalPages} />
						)}
					</>
				</Suspense>
			</div>
		</PageContainer>
	);
};
export default ProductsPage;
