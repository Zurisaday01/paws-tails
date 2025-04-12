'use client';

import { insertAttributeSchema } from '@/lib/validators';
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
import { ControllerRenderProps, useForm } from 'react-hook-form';
import * as z from 'zod';
import AddAttributeValues from './add-attribute-values';
import slugify from 'slugify';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
	createAttribute,
	updateAttribute,
} from '@/lib/actions/attribute.actions';
import { Loader2 } from 'lucide-react';

interface AttributeInsertFormProps {
	type: 'Create' | 'Update';
	initialData?: Attribute;
	pageTitle: string;
}

const AttributeInsertForm = ({
	type = 'Create',
	initialData,
	pageTitle,
}: AttributeInsertFormProps) => {
	const router = useRouter();
	const defaultValues = {
		id: initialData?.id || '',
		name: initialData?.name || '',
		slug: initialData?.slug || '',
		values: initialData?.values || [],
	};

	const form = useForm<z.infer<typeof insertAttributeSchema>>({
		resolver: zodResolver(insertAttributeSchema),
		values: defaultValues,
	});

	const onSubmit = async (values: z.infer<typeof insertAttributeSchema>) => {
		// On Create
		if (type === 'Create') {
			const res = await createAttribute(values);

			if (!res.success) {
				toast({
					variant: 'destructive',
					description: res.message,
				});
			} else {
				toast({
					description: res.message,
				});
				router.push('/admin/attributes');
			}
		}

		// On Update
		if (type === 'Update') {
			const res = await updateAttribute(values);

			if (!res.success) {
				toast({
					variant: 'destructive',
					description: res.message,
				});
			} else {
				toast({
					description: res.message,
				});
				router.push('/admin/attributes');
			}
		}
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
						<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												placeholder='e.g. Color'
												autoComplete='off'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Slug */}
							<FormField
								control={form.control}
								name='slug'
								render={({
									field,
								}: {
									field: ControllerRenderProps<
										z.infer<typeof insertAttributeSchema>,
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
						</div>
						<FormField
							control={form.control}
							name='values'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Variants</FormLabel>
									<FormControl>
										<AddAttributeValues
											name={field.name}
											control={form.control}
											register={form.register}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className='w-full flex items-center justify-end'>
							<Button
								type='submit'
								disabled={
									form.formState.isLoading || form.formState.isSubmitting
								}>
								{form.formState.isLoading || form.formState.isSubmitting ? (
									<Loader2 className='animate-spin w-12 h-12 text-white' />
								) : type === 'Create' ? (
									'Create Attribute'
								) : (
									'Update Attribute'
								)}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
export default AttributeInsertForm;
