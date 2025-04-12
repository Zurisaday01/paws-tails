import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getOrderSummary } from '@/lib/actions/order.actions';
import { formatCurrency, formatDateTime, formatNumber } from '@/lib/utils';
import { CreditCard, DollarSign, FileUser, Package } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import Charts from '@/components/charts';
import { requireAdmin } from '@/lib/auth-guard';
import { getCategoriesCount } from '@/lib/actions/category.actions';
import { getTopSellingProducts } from '@/lib/actions/product.actions';
import { ScrollArea } from '@/components/ui/scroll-area';

export const metadata: Metadata = {
	title: 'Admin Dashboard',
};

const AdminOverviewPage = async () => {
	await requireAdmin();

	const summary = await getOrderSummary();
	const categories = await getCategoriesCount();
	const topSellingProducts = await getTopSellingProducts();

	return (
		<div className='space-y-2 px-6 pb-8'>
			<h1 className='h2-bold'>Dashboard</h1>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
						<DollarSign className='text-brown-50 w-7' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{formatCurrency(
								summary.totalSales._sum.totalPrice?.toString() || 0
							)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium '>Sales</CardTitle>
						<CreditCard className='text-brown-50 w-7' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{formatNumber(summary.ordersCount)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Customers</CardTitle>
						<FileUser className='text-brown-50 w-7' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{formatNumber(summary.usersCount)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Products</CardTitle>
						<Package className='text-brown-50 w-7' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{formatNumber(summary.productsCount)}
						</div>
					</CardContent>
				</Card>
			</div>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
				<Card className='col-span-4'>
					<CardHeader>
						<CardTitle>Montly Overview</CardTitle>
					</CardHeader>
					<CardContent>
						<Charts
							data={{
								salesData: summary.salesData,
							}}
						/>
					</CardContent>
				</Card>
				<Card className='col-span-3'>
					<CardHeader>
						<CardTitle>Recent Sales</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>BUYER</TableHead>
									<TableHead>DATE</TableHead>
									<TableHead>TOTAL</TableHead>
									<TableHead>ACTIONS</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{summary.latestSales.map(order => (
									<TableRow key={order.id}>
										<TableCell>
											{order?.user?.name ? order.user.name : 'Deleted User'}
										</TableCell>
										<TableCell>
											{formatDateTime(order.createdAt).dateOnly}
										</TableCell>
										<TableCell>
											{formatCurrency(Number(order.totalPrice))}
										</TableCell>
										<TableCell>
											<Link href={`/admin/orders/${order.id}`}>
												<span className='px-2'>Details</span>
											</Link>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
				<Card className='col-span-4'>
					<CardHeader>
						<CardTitle>Products Per Category</CardTitle>
					</CardHeader>
					<CardContent>
						<Charts
							data={{
								productsPerCategory: categories?.data?.map(cat => ({
									name: cat.category,
									value: cat.productsCount,
								})),
							}}
						/>
					</CardContent>
				</Card>
				<Card className='col-span-3'>
					<CardHeader>
						<CardTitle>Total sales per product</CardTitle>
					</CardHeader>
					<CardContent>
						<ScrollArea className='h-[350px]'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>PRODUCT NAME</TableHead>
										<TableHead>QUANTITY</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{topSellingProducts?.data?.map(product => (
										<TableRow key={product.productId}>
											<TableCell>{product.name}</TableCell>
											<TableCell>{product._sum.qty}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</ScrollArea>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default AdminOverviewPage;
