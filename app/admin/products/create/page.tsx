import ProductInsertForm from '@/components/form/product-insert-form';
import PageContainer from '@/components/layout/dashboard/page-container';
import {
	getAllAttributesOptions,
	getAllAttributesValues,
} from '@/lib/actions/attribute.actions';
import { getAllCategoriesOptions } from '@/lib/actions/category.actions';

export const metadata = {
	title: 'Dashboard : Create Product',
};

const CreateProductPage = async () => {
	const categories = await getAllCategoriesOptions();
	const attributes = await getAllAttributesOptions();
	const attributeValues = await getAllAttributesValues();

	if (!categories?.data || !attributes?.data) return null;

	return (
		<PageContainer scrollable>
			<div className='flex-1 space-y-4'>
				<ProductInsertForm
					pageTitle='Create Product'
					categories={categories.data}
					attributes={attributes.data as Attribute[]}
					attributeValues={attributeValues?.data as unknown as AttributeValue[]}
				/>
			</div>
		</PageContainer>
	);
};

export default CreateProductPage;
