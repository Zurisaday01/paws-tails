'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Badge } from '@/components/ui/badge';
import { formatId } from '@/lib/utils';

export const columns: ColumnDef<Attribute>[] = [
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
		accessorKey: 'values',
		header: 'VALUES',
		cell: ({ row }) => (
			<div className='flex flex-wrap gap-1'>
				{row.original.values.map(value => (
					<Badge key={value.id} className='mr-1'>
						{value.value}
					</Badge>
				))}
			</div>
		),
	},
	{
		accessorKey: 'slug',
		header: 'SLUG',
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
