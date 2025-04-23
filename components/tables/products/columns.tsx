'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatId } from '@/lib/utils';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<Product>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => <div>{formatId(row.original.id)}</div>,
	},
	{
		accessorKey: 'name',
		header: 'NAME',
	},
	{
		accessorKey: 'variants',
		header: 'VARIANTS',
		cell: ({ row }) => {
			if (row.original.type === 'simple') {
				return <Badge>NO</Badge>;
			}

			return <Badge>YES</Badge>;
		},
	},
	{
		accessorKey: 'stock',
		header: 'STOCK',
		cell: ({ row }) => {
			if (row.original.type === 'simple') {
				return <div>{row.original.stock}</div>;
			}

			const stocks = row?.original?.variants?.map(variant => [
				variant.attributeValues?.map(value => value.value).join(' / '),
				variant.stock,
			]);

			return (
				<HoverCard>
					<HoverCardTrigger>
						<Button variant='secondary'>See Levels</Button>
					</HoverCardTrigger>
					<HoverCardContent className='w-[200px]'>
						{stocks?.map(([variant, stock]) => (
							<div key={variant} className='flex justify-between'>
								<p>{variant}</p>
								<p>{stock}</p>
							</div>
						))}
					</HoverCardContent>
				</HoverCard>
			);
		},
	},
	{
		accessorKey: 'price',
		header: 'PRICE',
		cell: ({ row }) => {
			if (row.original.type === 'simple') {
				return <div>{formatCurrency(row.original.price)}</div>;
			}

			const prices = row?.original?.variants?.map(variant => variant.price);
			const minPrice = Math.min(...(prices || []));
			const maxPrice = Math.max(...(prices || []));

			return (
				<div>
					{formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
				</div>
			);
		},
	},
	{
		accessorKey: 'salePrice',
		header: 'SALE PRICE',
		cell: ({ row }) => {
			if (row.original.type === 'simple') {
				return <div>{formatCurrency(row.original.salePrice)}</div>;
			}

			const prices = row?.original?.variants?.map(variant => variant.salePrice);
			const minPrice = Math.min(...(prices || []));
			const maxPrice = Math.max(...(prices || []));

			return (
				<div>
					{formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
				</div>
			);
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
