'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useFieldArray, useWatch } from 'react-hook-form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { structureMultiselectOptions } from '@/lib/utils';
import { attributeValuesSchema } from '@/lib/validators';

interface AddAttributeValuesProps {
	name: string; // The name of the field array (e.g., "values")
	register: any; // The register function from react-hook-form
	watch: any; // The watch function from react-hook-form
	setValue: any; // The setValue function from react-hook-form
	control: any; // The control function from react-hook-form
	attributes: Attribute[];
}

const AddAttributeOptions = ({
	name,
	register,
	control,
	setValue,
	attributes,
}: AddAttributeValuesProps) => {
	const { fields, append, remove } = useFieldArray({
		control,
		name, // Name of the array in the form state
	});
	const watchValuesAttributes = useWatch({ name: 'attributes' });


	// Automatically update variations when attribute values change
	useEffect(() => {
		if (watchValuesAttributes && watchValuesAttributes.length > 0) {
			// the attributeId references to the attribute id
			// the id references to the AttributeValue id table
			const selectedAttributeValues = watchValuesAttributes.map(
				(item: { id: string; values: string[] }) => {
					return item?.values?.map(valueId => ({
						attributeId: item.id,
						attributeValueId: valueId,
					}));
				}
			);

			// if all the watchValuesAttributes have values, then we can set the variations
			if (
				selectedAttributeValues.every(
					(item: (typeof attributeValuesSchema)[]) => item.length > 0
				)
			) {
				setValue('attributeValues', selectedAttributeValues.flat());
			}
			// setValue('variations', selectedAttributeValues.flat());
		}
	}, [setValue, watchValuesAttributes]);

	// Get the IDs of currently selected attributes
	const selectedIds =
		watchValuesAttributes?.map(
			(item: { id: string; values: string }) => item.id
		) || [];

	return (
		<div className='flex flex-col gap-4 items-start'>
			{fields.map((field, index) => {
				const currentId = watchValuesAttributes[index]?.id;

				const availableValues = attributes
					.filter(attribute => attribute.id === currentId)
					.map(attribute => attribute.values);

				// Get the selected values for the multi-select
				const selectedValues = watchValuesAttributes[index]?.values || [];

				return (
					<div key={field.id}>
						<h4 className='font-bold'>Option {index + 1}</h4>
						<div className='grid grid-cols-1 gap-6 md:grid-cols-2 w-full'>
							<FormItem className='w-[400px]'>
								<FormLabel>Attribute Name</FormLabel>
								<Select
									{...register(`${name}.${index}.id` as const)}
									onValueChange={value => {
										setValue(`${name}.${index}.id`, value);
										setValue(`${name}.${index}.values`, []);
									}}
									value={currentId}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Select attribute' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{attributes.map((attribute: Attribute) => {
											const isDisabled = selectedIds.includes(attribute.id);
											return (
												<SelectItem
													key={attribute.id}
													disabled={isDisabled}
													value={attribute.id}>
													{attribute.name}
												</SelectItem>
											);
										})}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
							<FormItem>
								<FormLabel>Attribute Value</FormLabel>
								<FormControl>
									<MultiSelect
										{...register(`${name}.${index}.values`)}
										options={structureMultiselectOptions(
											availableValues.flat()
										)}
										defaultValue={selectedValues}
										onValueChange={(value: string[]) =>
											setValue(`${name}.${index}.values`, value)
										}
										placeholder='Select variant options'
										variant='inverted'
										animation={2}
										maxCount={3}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						</div>
						<Button
							variant='link'
							className='text-red-500'
							onClick={() => remove(index)}
							type='button'>
							Remove
						</Button>
					</div>
				);
			})}

			<Button
				variant='secondary'
				type='button'
				disabled={fields.length === attributes.length}
				onClick={() => append({ id: undefined, values: [] })}>
				Add Value
			</Button>
		</div>
	);
};
export default AddAttributeOptions;
