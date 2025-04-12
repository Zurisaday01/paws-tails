import { Metadata } from 'next';
import { auth } from '@/auth';
import { getUserById } from '@/lib/actions/user.actions';
import CheckoutSteps from '@/components/checkout-steps';
import { redirect } from 'next/navigation';
import PaymentMethodForm from '@/components/form/payment-method-form';

export const metadata: Metadata = {
	title: 'Select Payment Method',
};

const PaymentMethodPage = async () => {
	const session = await auth();
	const userId = session?.user?.id;

	if (!userId) redirect('/sign-in');

	const user = await getUserById(userId!);

	return (
		<>
			<CheckoutSteps current={2} />
			<PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
		</>
	);
};

export default PaymentMethodPage;
