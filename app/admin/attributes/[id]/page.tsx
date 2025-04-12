import AttributeInsertForm from '@/components/form/attribute-insert-form';
import PageContainer from '@/components/layout/dashboard/page-container';
import { getAttributeById } from '@/lib/actions/attribute.actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Dashboard : Update Attribute',
};

const UpdateAttributePage = async (props: {
	params: Promise<{
		id: string;
	}>;
}) => {
	const { id } = await props.params;

	const attribute = await getAttributeById(id);

	if (!attribute) return notFound();

	return (
		<PageContainer scrollable>
			<div className='flex-1 space-y-4'>
				<AttributeInsertForm
					pageTitle='Update Attribute'
                    type='Update'
					initialData={attribute}
				/>
			</div>
		</PageContainer>
	);
};

export default UpdateAttributePage;
