'use client';

import { insertCategorySchema } from '@/lib/validators';
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
import slugify from 'slugify';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

import { Loader2 } from 'lucide-react';
import { createCategory, updateCategory } from '@/lib/actions/category.actions';

interface CategoryInsertFormProps {
	type?: 'Create' | 'Update';
	initialData?: Category;
	pageTitle: string;
}

const CategoryInsertForm = ({
	type = 'Create',
	initialData,
	pageTitle,
}: CategoryInsertFormProps) => {
	const router = useRouter();
	const defaultValues = {
		id: initialData?.id || '',
		name: initialData?.name || '',
		slug: initialData?.slug || '',
	};

	const form = useForm<z.infer<typeof insertCategorySchema>>({
		resolver: zodResolver(insertCategorySchema),
		values: defaultValues,
	});

	const onSubmit = async (values: z.infer<typeof insertCategorySchema>) => {
		// On Create
		if (type === 'Create') {
			const res = await createCategory(values);

			if (!res.success) {
				toast({
					variant: 'destructive',
					description: res.message,
				});
			} else {
				toast({
					description: res.message,
				});
				router.push('/admin/categories');
			}
		}

		// On Update
		if (type === 'Update') {
			const res = await updateCategory(values);

			if (!res.success) {
				toast({
					variant: 'destructive',
					description: res.message,
				});
			} else {
				toast({
					description: res.message,
				});
				router.push('/admin/categories');
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
										z.infer<typeof insertCategorySchema>,
										'slug'
									>;
								}) => (
									<FormItem className='w-full'>
										<FormLabel>Name</FormLabel>
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

						<div className='w-full flex items-center justify-end'>
							<Button
								type='submit'
								disabled={
									form.formState.isLoading || form.formState.isSubmitting
								}>
								{form.formState.isLoading || form.formState.isSubmitting ? (
									<Loader2 className='animate-spin w-12 h-12 text-white' />
								) : type === 'Create' ? (
									'Create Category'
								) : (
									'Update Category'
								)}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
export default CategoryInsertForm;
