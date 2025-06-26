import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Price, SortDirection, SortKey } from '@/types';
import { ArrowUpDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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
    const [data, setData] = useState<Price[]>([]);
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    useEffect(() => {
        fetch('http://127.0.0.1:8000/prices')
            .then((response) => response.json())
            .then((data: Price[]) => setData(data))
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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedData.length > 0 ? (
                                sortedData.map((item) => (
                                    <TableRow key={item.uuid}>
                                        <TableCell>{item.material}</TableCell>
                                        <TableCell>{moneyMask(item.value)}</TableCell>
                                        <TableCell>{item.point}</TableCell>
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
            </section>
        </section>
    );
}
