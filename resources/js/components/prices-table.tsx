import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RawPrice, SortDirection, SortKey } from '@/types';
import { ArrowUpDown, MoreHorizontal, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const moneyMask = (a: number) =>
    Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(a);

// const moneyUnmask = (a: string) =>
//     parseFloat(
//         a
//             .replace(/[^\d,.-]/g, '')
//             .replace(/\./g, '')
//             .replace(',', '.'),
//     );

export default function PricesTable() {
    const [data, setData] = useState<RawPrice[]>([]);
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/v1/prices')
            .then((response) => response.json())
            .then((data: RawPrice[]) => setData(data))
            .catch((error) => console.error(error));
    }, []);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const sortedData = useMemo(() => {
        if (!sortKey) return data;

        return [...data].sort((a, b) => {
            const aValue = typeof a[sortKey] === 'number' ? a[sortKey] : parseFloat(a[sortKey]);
            const bValue = typeof b[sortKey] === 'number' ? b[sortKey] : parseFloat(b[sortKey]);

            if (sortDirection === 'asc') {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });
    }, [data, sortKey, sortDirection]);

    return (
        <>
            <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
                <form>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Adicionar material</DialogTitle>
                            <DialogDescription>Cotar o preço de um novo material.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="name-1">Material</Label>
                                <Input id="name-1" name="name" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="name-1">Preço</Label>
                                <Input id="name-1" name="name" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="name-1">Pontos</Label>
                                <Input id="name-1" name="name" />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button type="submit">Adicionar</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>

            <section className="flex h-full w-full flex-col items-center justify-center">
                <section className="flex flex-col">
                    <span className="mb-2 self-center text-xl font-bold">Cotações</span>

                    <ScrollArea className="my-2 h-[64vh] rounded border border-sidebar-border/70 dark:border-sidebar-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Material</TableHead>
                                    <TableHead>
                                        <Button variant="ghost" onClick={() => toggleSort('value')}>
                                            <span>Preço</span>
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
                                {sortedData.map((item) => (
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
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>

                    <Button className="mt-2 self-end" onClick={() => setOpenCreateDialog(!openCreateDialog)}>
                        <Plus />
                    </Button>
                </section>
            </section>
        </>
    );
}
