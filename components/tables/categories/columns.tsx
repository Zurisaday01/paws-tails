'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { formatId } from '@/lib/utils';

export const columns: ColumnDef<Category>[] = [
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
		accessorKey: 'slug',
		header: 'SLUG',
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
