import AttributeInsertForm from '@/components/form/attribute-insert-form';
import PageContainer from '@/components/layout/dashboard/page-container';

export const metadata = {
	title: 'Dashboard : Create Attribute',
};

const CreateAttributePage = async () => {
	return (
		<PageContainer scrollable>
			<div className='flex-1 space-y-4'>
				<AttributeInsertForm pageTitle='Create Attribute' type='Create' />
			</div>
		</PageContainer>
	);
};

export default CreateAttributePage;
