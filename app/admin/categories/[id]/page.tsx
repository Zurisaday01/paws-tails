import CategoryInsertForm from '@/components/form/category-insert-form';
import PageContainer from '@/components/layout/dashboard/page-container';
import { getCategoryById } from '@/lib/actions/category.actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Dashboard : Update Attribute',
};

const UpdateCategoryPage = async (props: {
	params: Promise<{
		id: string;
	}>;
}) => {
	const { id } = await props.params;

	const category = await getCategoryById(id);

	if (!category) return notFound();

	return (
		<PageContainer scrollable>
			<div className='flex-1 space-y-4'>
				<CategoryInsertForm
					pageTitle='Update Category'
                    type='Update'
					initialData={category}
				/>
			</div>
		</PageContainer>
	);
};

export default UpdateCategoryPage;
