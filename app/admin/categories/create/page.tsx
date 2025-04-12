import CategoryInsertForm from '@/components/form/category-insert-form';
import PageContainer from '@/components/layout/dashboard/page-container';

export const metadata = {
	title: 'Dashboard : Create Category',
};

const CreateAttributePage = async () => {
	return (
		<PageContainer scrollable>
			<div className='flex-1 space-y-4'>
				<CategoryInsertForm pageTitle='Create Category' />
			</div>
		</PageContainer>
	);
};

export default CreateAttributePage;
