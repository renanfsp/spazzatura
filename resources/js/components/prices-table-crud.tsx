import { useForm } from '@inertiajs/react';
import { ChangeEvent, FormEventHandler, useState } from 'react';
import { route } from 'ziggy-js';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Price } from '@/types';
import { LoaderCircle } from 'lucide-react';

export default function PricesTableForm() {
    const [value, setValue] = useState('');
    const [point, setPoint] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm<Required<Price>>({
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

    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-6">
                <div className="grid gap-2">
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

                <div className="">
                    <Label htmlFor="name">Preço</Label>
                    <div className="flex">
                        <span>R$</span>
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

                <div className="grid gap-2">
                    <Label htmlFor="name">Ponto</Label>
                    <Input id="ponto" type="text" required tabIndex={3} value={point} onChange={handlePoint} disabled={processing} placeholder="0" />
                    <InputError message={errors.point} className="mt-2" />
                </div>

                <Button type="submit" className="mt-2 w-full" tabIndex={4} disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Adicionar
                </Button>
            </div>
        </form>
    );
}
