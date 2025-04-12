'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { formatId } from '@/lib/utils';
import { User } from 'next-auth';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => <div>{formatId(row.original.id as string)}</div>,
	},
	{
		accessorKey: 'name',
		header: 'NAME',
	},
	{
		accessorKey: 'email',
		header: 'EMAIL',
	},
	{
		accessorKey: 'role',
		header: 'ROLE',
		cell: ({ row }) => <Badge className='uppercase'>{row.original?.role as string}</Badge>,
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
