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
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';

const data: Payment[] = [];

export type Payment = {
    d: string;
};

export const columns: ColumnDef<Payment>[] = [];

export function MaterialsTableDialog() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm<Required<Collect>>({
        uuid: '',
        material: '',
        point: 0,
        value: 0,
    });

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

    const handleSubmit = () => {};

    return (
        <section>
            <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
                <form>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Adicionar material</DialogTitle>
                            <DialogDescription>Cotar o preço de um novo material.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="name">Material</Label>
                                <Input
                                    id="material"
                                    type="text"
                                    required
                                    tabIndex={1}
                                    value={data.material}
                                    onChange={(e) => setData('material', e.target.value)}
                                    disabled={processing}
                                    placeholder="Alumínio"
                                />
                                <InputError message={errors.material} className="mt-2" />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="name">Preço (kg)</Label>
                                <div className="flex">
                                    <span className="flex h-9 items-center justify-center rounded-md border border-input p-2 select-none">R$</span>
                                    <Input
                                        id="value"
                                        type="text"
                                        required
                                        tabIndex={2}
                                        value=""
                                        onChange={() => {}}
                                        disabled={processing}
                                        placeholder="00,000000"
                                    />
                                </div>
                                <InputError message={errors.value} className="mt-2" />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="name">Ponto</Label>
                                <Input
                                    id="ponto"
                                    type="text"
                                    required
                                    tabIndex={3}
                                    value=""
                                    onChange={() => {}}
                                    disabled={processing}
                                    placeholder="0"
                                />
                                <InputError message={errors.point} className="mt-2" />
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogClose>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing} onClick={handleSubmit}>
                                    Adicionar
                                </Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-neutral-600">Salvo</p>
                                </Transition>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>

            <div className="w-full">
                <div className="m-8">
                    <div className="flex w-full items-center justify-between py-4">
                        <Input
                            placeholder="Filtrar material..."
                            value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
                            onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
                            className="max-w-sm"
                        />
                        <span className="self-end">0 Pontos</span>
                    </div>
                    <div className="rounded-md border">
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
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="space-x-2">
                            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                                Anterior
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                                Próximo
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
