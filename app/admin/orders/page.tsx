import { Separator } from '@/components/ui/separator';
import { Suspense } from 'react';
import { Heading } from '@/components/ui/heading';
import { DataTableSkeleton } from '@/components/table/data-table=skeleton';
import PageContainer from '@/components/layout/dashboard/page-container';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/tables/orders/columns';
import Pagination from '@/components/pagination';
import { getAllOrders } from '@/lib/actions/order.actions';

export const metadata = {
	title: 'Dashboard : Orders',
};

const AdminOrdersPage = async (props: {
	searchParams: Promise<{
		page: string;
		query: string;
	}>;
}) => {
	const searchParams = await props.searchParams;
	const page = Number(searchParams.page) || 1;
	const searchText = searchParams.query || '';

	const orders = await getAllOrders({
		query: searchText,
		page,
	});
	if (!orders) return null;

	const { data = [], totalPages = 1 } = orders;

	return (
		<PageContainer scrollable={false}>
			<div className='flex flex-1 flex-col space-y-4'>
				<div className='flex items-start justify-between'>
					<Heading
						title='Orders'
						description='Manage your orders seamlessly.'
					/>
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
export default AdminOrdersPage;
