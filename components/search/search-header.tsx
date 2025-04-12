import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { getAllCategoriesOptions } from '@/lib/actions/category.actions';
import { SearchIcon } from 'lucide-react';

const Search = async () => {
	const categories = await getAllCategoriesOptions();

	if (!categories) return null;

	return (
		<form action='/catalog' method='GET'>
			<div className='flex w-full max-w-sm items-center space-x-2'>
				<Select defaultValue='all' name='categoryId'>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='All' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem key='All' value='all'>
							All
						</SelectItem>
						{categories?.data?.map(x => (
							<SelectItem key={x.id} value={x.id}>
								{x.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Input
					name='q'
					type='text'
					placeholder='Search...'
					className='md:w-[100px] lg:w-[300px]'
				/>
				<Button>
					<SearchIcon />
				</Button>
			</div>
		</form>
	);
};

export default Search;
