import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Price, SortDirection, SortKey } from '@/types';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { ArrowUpDown, MoreHorizontal, Plus } from 'lucide-react';
import { ChangeEvent, FormEventHandler, useEffect, useMemo, useState } from 'react';
import { route } from 'ziggy-js';

const moneyMask = (a: number) =>
    Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(a);

export default function PricesTableForm() {
    const [value, setValue] = useState('');
    const [point, setPoint] = useState('');
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm<Required<Price>>({
        uuid: '',
        material: '',
        point: 0,
        value: 0,
    });

    const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
        if (/^-?\d*,?\d*$/.test(e.target.value)) {
            setValue(e.target.value);
            const convert = parseFloat(e.target.value.replace(',', '.'));
            setData({
                ...data,
                value: !isNaN(convert) ? convert : 0,
            });
        }
    };
    const handlePoint = (e: ChangeEvent<HTMLInputElement>) => {
        setPoint(e.target.value.replace(/\D/g, ''));
        const convert = parseInt(e.target.value);
        setData({
            ...data,
            point: !isNaN(convert) ? convert : 0,
        });
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('prices.store'));
    };

    const [tableData, setTableData] = useState<Price[]>([]);
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    useEffect(() => {
        fetch('http://127.0.0.1:8000/prices')
            .then((response) => response.json())
            .then((data: Price[]) => setTableData(data))
            .catch((error) => console.error(error));

        setOpenCreateDialog(false);
    }, [recentlySuccessful]);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const sortedData = useMemo(() => {
        if (!sortKey) return tableData;

        return [...tableData].sort((a, b) => {
            const aValue = typeof a[sortKey] === 'number' ? a[sortKey] : parseFloat(a[sortKey]);
            const bValue = typeof b[sortKey] === 'number' ? b[sortKey] : parseFloat(b[sortKey]);

            if (sortDirection === 'asc') {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });
    }, [tableData, sortKey, sortDirection]);

    return (
        <section className="flex h-full w-full flex-col items-center justify-center">
            <section className="flex flex-col">
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
                                        <span className="flex h-9 items-center justify-center rounded-md border border-input p-2 select-none">
                                            R$
                                        </span>
                                        <Input
                                            id="value"
                                            type="text"
                                            required
                                            tabIndex={2}
                                            value={value}
                                            onChange={handleValue}
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
                                        value={point}
                                        onChange={handlePoint}
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

                <span className="mb-2 self-center text-xl font-bold">Cotações</span>

                <ScrollArea className="my-2 h-[64vh] rounded border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Material</TableHead>
                                <TableHead>
                                    <Button variant="ghost" onClick={() => toggleSort('value')}>
                                        <span>Preço (kg)</span>
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button variant="ghost" onClick={() => toggleSort('point')}>
                                        <span>Pontos</span>
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedData.length > 0 ? (
                                sortedData.map((item) => (
                                    <TableRow key={item.uuid}>
                                        <TableCell>{item.material}</TableCell>
                                        <TableCell>{moneyMask(item.value)}</TableCell>
                                        <TableCell>{item.point}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Abrir menu</span>
                                                        <MoreHorizontal />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>Editar</DropdownMenuItem>
                                                    <DropdownMenuItem>Deletar</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-[60vh] text-center">
                                        Sem cotações disponíveis
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>

                <Button className="self-end" onClick={() => setOpenCreateDialog(true)}>
                    <Plus />
                </Button>
            </section>
        </section>
    );
}
