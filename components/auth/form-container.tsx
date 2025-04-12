import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
interface FormContainerProps {
	title: string;
	description: string;
	children: React.ReactNode;
}

const FormContainer = ({
	title,
	description,
	children,
}: FormContainerProps) => {
	return (
		<div className='w-full max-w-md mx-auto'>
			<Card>
				<CardHeader className='space-y-4'>
					<CardTitle className='text-center text-2xl'>{title}</CardTitle>
					<CardDescription className='text-center'>
						{description}
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>{children}</CardContent>
			</Card>
		</div>
	);
};
export default FormContainer;
