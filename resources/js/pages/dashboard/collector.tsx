import PricesTable from '@/components/prices-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Collector() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Coletor" />
            <section className="flex flex-1 flex-col">
                <section className="grid h-full auto-rows-auto gap-4 md:m-8 lg:grid-cols-2">
                    <section className="h-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border"></section>
                    <section className="h-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PricesTable />
                    </section>
                </section>
            </section>
        </AppLayout>
    );
}
