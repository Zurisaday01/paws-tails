import AppSidebar from '@/components/layout/dashboard/app-sidebar';
import Header from '@/components/layout/dashboard/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { APP_NAME } from '@/lib/constants';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
	title: `${APP_NAME} | Admin`,
};
const AdminLayout = async ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	// Persisting the sidebar state in the cookie.
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AppSidebar />
			<SidebarInset>
				<Header />
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
};
export default AdminLayout;
