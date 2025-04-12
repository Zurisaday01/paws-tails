'use client';

import { AlertModal } from '@/components/ui/alert-modal';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { deleteUser } from '@/lib/actions/user.actions';

import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { User } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CellActionProps {
	data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const onConfirm = async () => {
		setLoading(true);

		const res = await deleteUser(data.id as string);

		if (!res.success) {
			toast({
				variant: 'destructive',
				description: res.message,
			});
		} else {
			toast({
				description: res.message,
			});
		}

		setLoading(false);
		setOpen(false);
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onConfirm}
				loading={loading}
			/>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='h-8 w-8 p-0'>
						<span className='sr-only'>Open menu</span>
						<MoreHorizontal className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>

					<DropdownMenuItem
						className='cursor-pointer'
						onClick={() => router.push(`/admin/users/${data.id}`)}>
						<Edit className='mr-2 h-4 w-4' /> Update
					</DropdownMenuItem>
					<DropdownMenuItem
						className='cursor-pointer'
						onClick={() => setOpen(true)}>
						<Trash className='mr-2 h-4 w-4' /> Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
