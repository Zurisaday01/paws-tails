'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';

export const columns: ColumnDef<Order>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => <div>{formatId(row.original.id)}</div>,
	},
	{
		accessorKey: 'user',
		header: 'BUYER',
		cell: ({ row }) => <div>{row.original.user.name}</div>,
	},
	{
		accessorKey: 'createdAt',
		header: 'DATE',
		cell: ({ row }) => (
			<div>{formatDateTime(row.original.createdAt).dateTime}</div>
		),
	},
	{
		accessorKey: 'totalPrice',
		header: 'TOTAL PRICE',
		cell: ({ row }) => {
			return <div>{formatCurrency(+row.original.totalPrice)}</div>;
		},
	},
	{
		accessorKey: 'isPaid',
		header: 'PAID',
		cell: ({ row }) => {
			return (
				<Badge variant='outline'>
					{row.original.isPaid && row.original.paidAt
						? formatDateTime(row.original.paidAt).dateTime
						: 'Not Paid'}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'isDelivered',
		header: 'DELIVERED',
		cell: ({ row }) => {
			return (
				<Badge variant='outline'>
					{row.original.isDelivered && row.original.deliveredAt
						? formatDateTime(row.original.deliveredAt).dateTime
						: 'Not Delivered'}
				</Badge>
			);
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
