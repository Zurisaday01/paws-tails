'use client';

// import '@uploadthing/react/styles.css'; this line was causing the error in the sidebar
import { insertProductSchema } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	ControllerRenderProps,
	useFieldArray,
	useForm,
	UseFormRegister,
} from 'react-hook-form';
import * as z from 'zod';
import slugify from 'slugify';
import { useRouter } from 'next/navigation';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { FileUploader } from '../file-uploader';
import AddAttributeOptions from './add-attribute-options';
import ProductVariationInsertForm from './product-variation-insert.form';
import { toast } from '@/hooks/use-toast';
import { useUploadFile } from '@/hooks/use-upload-file';
import { UploadedFilesCard } from '../uploaded-files-card';
import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useState } from 'react';

interface AttributeInsertFormProps {
	type?: 'Create' | 'Update';
	initialData?: InsertProduct;
	pageTitle: string;
	categories: Category[];
	attributes: Attribute[];
	attributeValues: AttributeValue[];
}

const formatVariationsForForm = (productVariations: any[]) => {
	return productVariations.map(variation => ({
		id: variation.id || '',
		stock: variation.stock || undefined,
		price: variation.price?.toString() || undefined,
		salePrice: variation.salePrice?.toString() || undefined,
		attributeValues: variation.attributeValues.map(
			(value: AttributeValue) => value.id
		),
	}));
};

const formatAttributesForForm = (productAttributes: any[]) => {
	const formattedAttributes: any[] = [];

	productAttributes.forEach(item => {
		const { attributeId, id } = item;

		// Find the existing attribute group
		let attribute = formattedAttributes.find(attr => attr.id === attributeId);

		if (!attribute) {
			// Create a new attribute group if not found
			attribute = {
				id: attributeId,
				values: [],
			};
			formattedAttributes.push(attribute);
		}

		// Add the product's value id (attributeValueId)
		attribute.values.push(id);
	});

	return formattedAttributes;
};

const AttributeInsertForm = ({
	type = 'Create',
	initialData,
	pageTitle,
	categories,
	attributes,
	attributeValues,
}: AttributeInsertFormProps) => {
	const router = useRouter();

	const { progresses, isUploading, onUpload, uploadedFiles } = useUploadFile(
		'imageUploader',
		{
			defaultUploadedFiles: [],
		}
	);

	// Construct the default values for the form
	const defaultValues = {
		id: initialData?.id || '',
		name: initialData?.name || '',
		slug: initialData?.slug || '',
		attributes: initialData?.attributeValues
			? formatAttributesForForm(initialData?.attributeValues)
			: [],
		variants: initialData?.variants
			? formatVariationsForForm(initialData?.variants || [])
			: [],
		type: initialData?.type || 'simple',
		categoryId: initialData?.categoryId || '',
		description: initialData?.description || '',
		stock: initialData?.stock || undefined,
		price: initialData?.price?.toString() || undefined,
		salePrice: initialData?.salePrice?.toString() || undefined,
		imagesDb: initialData?.images || [],
	};

	// current images
	const [currentImages, setCurrentImages] = useState<string[]>(
		defaultValues.imagesDb
	);

	const originalImages = defaultValues.imagesDb;

	const handleDeleteImage = (url: string) => {
		setCurrentImages(prev => prev.filter(image => image !== url));
	};

	const handleResetImages = () => {
		setCurrentImages(originalImages);
	};

	// Initialize the form with default values
	const form = useForm<z.infer<typeof insertProductSchema>>({
		resolver: zodResolver(insertProductSchema),
		values: defaultValues,
	});

	const watchType = form.watch('type');

	const onSubmit = async (values: z.infer<typeof insertProductSchema>) => {
		// upload images first
		const uploadedCurrentFiles = await onUpload(values.images);

		// get the uploaded files
		const productData = {
			...values,
			images: uploadedCurrentFiles?.map(file => file.url),
		};

		// On Create
		if (type === 'Create') {
			const res = await createProduct(productData);

			if (!res.success) {
				toast({
					variant: 'destructive',
					description: res.message,
				});
			} else {
				toast({
					description: res.message,
				});
				router.push('/admin/products');
			}
		}

		// On Update
		if (type === 'Update') {
			const newImages = uploadedCurrentFiles?.map(file => file.url);
			const images = [...currentImages, ...(newImages || [])];

			const updatedProductData = {
				...values,
				images,
			};

			const res = await updateProduct(updatedProductData);

			if (!res.success) {
				toast({
					variant: 'destructive',
					description: res.message,
				});
			} else {
				toast({
					description: res.message,
				});
				router.push('/admin/products');
			}
		}
	};

	const { fields: fieldsVariants, replace } = useFieldArray({
		control: form.control,
		name: 'variants', // unique name for your Field Array
		keyName: '_id',
	});

	const watchAttributeValues = form.watch('attributeValues');

	// const handleGenerateVariants = () => {
	// 	// clear the previous variants
	// 	replace([]);

	// 	const selectedAttributes = watchAttributeValues;

	// 	if (!selectedAttributes || selectedAttributes.length === 0) {
	// 		toast({
	// 			variant: 'destructive',
	// 			description: 'Please select attributes first.',
	// 		});
	// 		return;
	// 	}

	// 	// Group selected attribute values by attributeId
	// 	const groupedAttributes = selectedAttributes.reduce(
	// 		(acc, { attributeId, attributeValueId }) => {
	// 			if (!acc[attributeId]) acc[attributeId] = [];
	// 			acc[attributeId].push(attributeValueId);
	// 			return acc;
	// 		},
	// 		{} as Record<string, string[]>
	// 	);

	// 	// Convert object values to an array of arrays
	// 	const attributeGroups = Object.values(groupedAttributes);

	// 	// Generate all combinations of attribute values
	// 	const generateCombinations = (groups: string[][]): string[][] => {
	// 		if (groups.length === 0) return [[]];

	// 		const firstGroup = groups[0];
	// 		const restCombinations = generateCombinations(groups.slice(1));

	// 		return firstGroup.flatMap(value =>
	// 			restCombinations.map(combination => [value, ...combination])
	// 		);
	// 	};

	// 	const productVariations = generateCombinations(attributeGroups).map(
	// 		attributeValues => ({
	// 			attributeValues,
	// 			price: undefined,
	// 			salePrice: undefined,
	// 			stock: undefined,
	// 		})
	// 	);
	// 	// Update form state with generated variations
	// 	replace(productVariations);
	// };

	const handleGenerateVariants = () => {
		// Clear only the variants that aren't reusable (we'll filter which ones to keep)
		const selectedAttributes = form.getValues('attributes');

		if (!selectedAttributes || selectedAttributes.length === 0) {
			toast({
				variant: 'destructive',
				description: 'Please select attributes first.',
			});
			return;
		}

		// Create all combinations from selected attribute values
		const combinations: string[][] = [];

		const getCombinations = (arrays: string[][], prefix: string[] = []) => {
			if (!arrays.length) {
				combinations.push(prefix);
				return;
			}
			const [first, ...rest] = arrays;
			for (const value of first) {
				getCombinations(rest, [...prefix, value]);
			}
		};

		const valuesByAttribute = selectedAttributes.map(attr => attr.values);

		getCombinations(valuesByAttribute);

		// Map existing variants for easy lookup
		const existingVariantsMap = new Map(
			fieldsVariants.map(variant => {
				const key = variant.attributeValues.sort().join('|');
				return [key, variant];
			})
		);

		const newVariants = combinations.map(combo => {
			const key = combo.sort().join('|');

			// Reuse existing if found
			if (existingVariantsMap.has(key)) {
				return existingVariantsMap.get(key)!;
			}

			// Otherwise, create new variant
			return {
				id: '',
				price: undefined,
				salePrice: undefined,
				stock: undefined,
				attributeValues: combo,
			};
		});

		// Replace all variants with the updated list
		replace(newVariants);

		// send feedback to the user
		toast({
			title: 'Variants generated',
			description:
				'If you selected a new variant option, please clear the inputs that still contain values before adding new ones.',
		});
	};

	return (
		<Card className='mx-auto w-full'>
			<CardHeader>
				<CardTitle className='text-left text-2xl font-bold'>
					{pageTitle}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						{type === 'Update' && (
							<div>
								<div className='flex items-center gap-2 justify-between'>
									<FormLabel>Current Images</FormLabel>
									<Button
										variant='outline'
										type='button'
										onClick={handleResetImages}>
										Reset
									</Button>
								</div>

								{currentImages.length > 0 && (
									<div className='flex flex-wrap gap-4'>
										{currentImages.map((image: string) => (
											<div key={image} className='relative'>
												<Image
													src={image}
													width={200}
													height={200}
													alt='product image'
													className='w-32 h-32 object-cover rounded'
												/>
												<Button
													variant='ghost'
													size='icon'
													className='absolute top-0 right-0'
													type='button'
													onClick={() => handleDeleteImage(image)}>
													<X className='w-5 h-5' />
												</Button>
											</div>
										))}
									</div>
								)}
							</div>
						)}

						<FormField
							control={form.control}
							name='images'
							render={({ field }) => (
								<div className='space-y-6'>
									<FormItem className='w-full'>
										<FormLabel>Images</FormLabel>
										<FormControl>
											<FileUploader
												value={field.value}
												onValueChange={field.onChange}
												maxFileCount={4}
												multiple={true}
												maxSize={4 * 1024 * 1024}
												progresses={progresses}
												disabled={isUploading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
									{uploadedFiles.length > 0 ? (
										<UploadedFilesCard uploadedFiles={uploadedFiles} />
									) : null}
								</div>
							)}
						/>

						<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Product Name</FormLabel>
										<FormControl>
											<Input
												autoComplete='off'
												placeholder='Enter product name'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='slug'
								render={({
									field,
								}: {
									field: ControllerRenderProps<
										z.infer<typeof insertProductSchema>,
										'slug'
									>;
								}) => (
									<FormItem className='w-full'>
										<FormLabel>Slug</FormLabel>
										<FormControl>
											<div className='relative'>
												<Input
													placeholder='...'
													autoComplete='off'
													{...field}
												/>
												<Button
													type='button'
													className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2'
													onClick={() => {
														form.setValue(
															'slug',
															slugify(form.getValues('name'), { lower: true })
														);
													}}>
													Generate
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='categoryId'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Category</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select categories' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{categories.map((category: Category) => (
													<SelectItem key={category.id} value={category.id}>
														{category.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Enter product description'
											className='resize-none'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='type'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Type</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select product type' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='simple'>Simple</SelectItem>
											<SelectItem value='variable'>Variable</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{watchType === 'variable' ? (
							<div>
								<FormField
									control={form.control}
									name='attributes'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Variation Options</FormLabel>
											<FormControl>
												<AddAttributeOptions
													name={field.name}
													watch={form.watch}
													control={form.control}
													setValue={form.setValue}
													register={form.register}
													attributes={attributes}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									disabled={watchAttributeValues?.length === 0}
									type='button'
									onClick={handleGenerateVariants}
									className='mt-4'>
									Generate Variants
								</Button>
								<div>
									{fieldsVariants?.map((variant, i) => {
										return (
											<div key={i} className='flex flex-col gap-4 mt-9'>
												<div className='flex flex-col gap-4'>
													<div className='flex gap-2'>
														{variant.attributeValues.map((valueId: string) => {
															const selectedValue = attributeValues.find(
																value => value.id === valueId
															);

															return selectedValue ? (
																<span key={valueId} className='text-brown-50'>
																	{selectedValue.value}
																</span>
															) : null;
														})}
													</div>

													<ProductVariationInsertForm
														key={i}
														index={i}
														register={
															form.register as UseFormRegister<
																NonNullable<z.infer<typeof insertProductSchema>>
															>
														}
													/>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						) : watchType === 'simple' ? (
							<div className='space-y-8'>
								<FormField
									control={form.control}
									name='price'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Price</FormLabel>
											<FormControl>
												<Input
													type='number'
													step='0.01'
													placeholder='Enter price'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='salePrice'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Sale Price</FormLabel>
											<FormControl>
												<Input
													type='number'
													step='0.01'
													placeholder='Enter sale price'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='stock'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Stock</FormLabel>
											<FormControl>
												<Input
													type='number'
													step='1'
													placeholder='e.g. 40, 50'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						) : null}
						<Button
							type='submit'
							disabled={isUploading || form.formState.isSubmitting}>
							{type === 'Create' ? 'Create Product' : 'Update Product'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
export default AttributeInsertForm;
