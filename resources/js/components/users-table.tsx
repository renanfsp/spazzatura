import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Roles, UserData } from '@/types';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export const columns: ColumnDef<UserData>[] = [
    {
        accessorKey: 'name',
        header: 'Nome',
        cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Email
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
    },
    {
        accessorKey: 'document',
        header: 'Documento',
        cell: ({ row }) => <div className="capitalize">{row.getValue('document')}</div>,
    },
];

interface UsersTableProps {
    role: Roles;
}

export default function UsersTable({ role }: UsersTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState<UserData[]>([]);

    if (role === 'collector') {
        useEffect(() => {
            fetch('http://127.0.0.1:8000/api/v1/users')
                .then((response) => response.json())
                .then((data: UserData[]) => setData(data))
                .catch((error) => console.error(error));
        }, []);
    }
    if (role === 'merchant') {
        useEffect(() => {
            fetch('http://127.0.0.1:8000/api/v1/users')
                .then((response) => response.json())
                .then((data: UserData[]) => setData(data))
                .catch((error) => console.error(error));
        }, []);
    }

    console.log(data);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <section className="flex h-full w-full flex-col items-center justify-center">
            <section className="flex flex-col">
                <span className="mb-2 self-center text-xl font-bold">{role === 'merchant' ? 'Comércios' : 'Coletores'}</span>

                <section className="flex items-center py-4">
                    <Input
                        placeholder="Filtrar emails..."
                        value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
                        onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Colunas <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    console.log(column);

                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </section>
                <section className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Sem resultados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </section>
                <section className="flex items-center justify-end space-x-2 py-4">
                    <section className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            Anterior
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            Próximo
                        </Button>
                    </section>
                </section>
            </section>
        </section>
    );
}
