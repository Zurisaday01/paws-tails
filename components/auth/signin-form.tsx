'use client';

import Link from 'next/link';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { signInDefaultValues } from '@/lib/constants';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
// components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const SignInForm = () => {
	// define the action state (server action function, initial state)
	const [data, action, isPending] = useActionState(signInWithCredentials, {
		success: false,
		message: '',
	});
	const { pending } = useFormStatus();

	const searchParams = useSearchParams();
	// if the callbackUrl is provided you could redirect to another page after successful login instead of the default page
	const callbackUrl = searchParams.get('callbackUrl') || '/';

	// the callbackUrl is passed as a hidden input field to the form data
	return (
		<form action={action}>
			<input type='hidden' name='callbackUrl' value={callbackUrl} />
			<div className='space-y-6'>
				<div className='flex flex-col gap-1'>
					<Label htmlFor='email'>Email</Label>
					<Input
						id='email'
						name='email'
						type='email'
						required
						autoComplete='email'
						defaultValue={signInDefaultValues.email}
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
						defaultValue={signInDefaultValues.password}
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
							'Sign In'
						)}
					</Button>
				</div>

				{data && !data.success && (
					<div className='text-center text-destructive'>{data.message}</div>
				)}

				<div className='text-sm text-center text-muted-foreground'>
					Don&apos;t have an account?{' '}
					<Link
						href='/sign-up'
						className='text-brown-100 dark:text-brown-50 transition-colors duration-150 underline hover:text-brown-50'>
						Sign Up
					</Link>
				</div>
			</div>
		</form>
	);
};
export default SignInForm;
