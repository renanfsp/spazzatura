import PricesTableDialog from '@/components/prices-table-dialog';
import UsersTable from '@/components/users-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Cooperativa',
        href: '/dashboard',
    },
];

export default function Cooperative() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Cooperativa" />
            <section className="flex flex-1 flex-col">
                <section className="grid h-full auto-rows-auto gap-4 md:m-8 lg:grid-cols-3">
                    <section className="h-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <UsersTable role="collector" />
                    </section>
                    <section className="h-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <UsersTable role="merchant" />
                    </section>
                    <section className="h-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PricesTableDialog />
                    </section>
                </section>
            </section>
        </AppLayout>
    );
}
