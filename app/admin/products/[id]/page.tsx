import ProductInsertForm from '@/components/form/product-insert-form';
import PageContainer from '@/components/layout/dashboard/page-container';
import {
	getAllAttributesOptions,
	getAllAttributesValues,
} from '@/lib/actions/attribute.actions';
import { getAllCategoriesOptions } from '@/lib/actions/category.actions';
import { getProductById } from '@/lib/actions/product.actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Dashboard : Update Attribute',
};

const AdminUpdateProductPage = async (props: {
	params: Promise<{
		id: string;
	}>;
}) => {
	const { id } = await props.params;

	const product = await getProductById(id);

	if (!product) return notFound();


	const categories = await getAllCategoriesOptions();
	const attributes = await getAllAttributesOptions();
	const attributeValues = await getAllAttributesValues();

	if (!categories?.data || !attributes?.data) return null;

	return (
		<PageContainer scrollable>
			<div className='flex-1 space-y-4'>
				<ProductInsertForm
					type='Update'
					pageTitle='Update Product'
					initialData={product}
					categories={categories.data}
					attributes={attributes.data as Attribute[]}
					attributeValues={attributeValues?.data as unknown as AttributeValue[]}
				/>
			</div>
		</PageContainer>
	);
};

export default AdminUpdateProductPage;
