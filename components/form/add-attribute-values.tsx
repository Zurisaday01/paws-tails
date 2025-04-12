'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFieldArray } from 'react-hook-form';

interface AddAttributeValuesProps {
	name: string; // The name of the field array (e.g., "values")
	register: any; // The register function from react-hook-form
	control: any; // The control function from react-hook-form
}

const generateRandomId = () => new Date().getTime().toString();

const AddAttributeValues = ({
	name,
	register,
	control,
}: AddAttributeValuesProps) => {
	const { fields, append, remove } = useFieldArray({
		control,
		name, // Name of the array in the form state
	});

	return (
		<div className='flex flex-col gap-4 items-start'>
			{fields.map((field, index) => (
				<FormItem key={field.id}>
					<FormLabel>Value</FormLabel>
					<div className='flex items-center'>
						<FormControl>
							<Input
								placeholder='e.g. White'
								autoComplete='off'
								{...register(`${name}.${index}.value`)}
							/>
						</FormControl>
						<Button
							variant='link'
							className='text-red-500'
							onClick={() => remove(index)}
							type='button'>
							Remove
						</Button>
					</div>
				</FormItem>
			))}

			<Button
				variant='secondary'
				type='button'
				onClick={() => append({ id: generateRandomId(), value: '' })}>
				Add Value
			</Button>
		</div>
	);
};

export default AddAttributeValues;
