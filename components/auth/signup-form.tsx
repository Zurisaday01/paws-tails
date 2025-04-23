'use client';

import { useSearchParams } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { signUpWithCredentials } from '@/lib/actions/user.actions';
import { signUpDefaultValues } from '@/lib/constants';
//components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const SignUpForm = () => {
	//define the action state (server action function, initial state)
	const [data, action, isPending] = useActionState(signUpWithCredentials, {
		success: false,
		message: '',
	});
	const { pending } = useFormStatus();

	// callback redirection logic
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl') || '/';

	return (
		<form action={action}>
			<input type='hidden' name='callbackUrl' value={callbackUrl} />
			<div className='space-y-6'>
				<div className='flex flex-col gap-1'>
					<Label htmlFor='email'>Name</Label>
					<Input
						id='name'
						name='name'
						type='text'
						autoComplete='off'
						required
						defaultValue={signUpDefaultValues.name}
					/>
				</div>
				<div className='flex flex-col gap-1'>
					<Label htmlFor='email'>Email</Label>
					<Input
						id='email'
						name='email'
						type='email'
						required
						autoComplete='off'
						defaultValue={signUpDefaultValues.email}
					/>
				</div>
				<div className='flex flex-col gap-1'>
					<Label htmlFor='password'>Password</Label>
					<Input
						id='password'
						name='password'
						type='password'
						required
						autoComplete='password'
						defaultValue={signUpDefaultValues.password}
					/>
				</div>
				<div className='flex flex-col gap-1'>
					<Label htmlFor='password'>Confirm Password</Label>
					<Input
						id='confirmPassword'
						name='confirmPassword'
						type='password'
						required
						autoComplete='confirmPassword'
						defaultValue={signUpDefaultValues.confirmPassword}
					/>
				</div>
				<div>
					<Button
						disabled={pending || isPending}
						className='w-full'
						variant='default'>
						{pending || isPending ? (
							<Loader2 className='animate-spin w-12 h-12 text-white' />
						) : (
							'Sign Up'
						)}
					</Button>
				</div>

				{data && !data.success && (
					<div className='text-center text-destructive'>{data.message}</div>
				)}

				<div className='text-sm text-center text-muted-foreground'>
					Already have an account?{' '}
					<Link
						href='/sign-in'
						className='text-brown-100 transition-colors duration-150 underline hover:text-brown-50'>
						Sign In
					</Link>
				</div>
			</div>
		</form>
	);
};
export default SignUpForm;
