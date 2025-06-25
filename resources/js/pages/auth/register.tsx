import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';
import { Roles } from '@/types';

const documentMask = (type: 'cpf' | 'cnpj', value: string) => {
    if (type === 'cpf') {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    if (type === 'cnpj') {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    }
};

type RegisterForm = {
    name: string;
    email: string;
    document: string;
    role: Roles;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const [cpf, setCPF] = useState('');
    const [cnpj, setCNPJ] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        document: '',
        role: 'collector',
        password: '',
        password_confirmation: '',
    });

    const handleRoleChange = (role: Roles) => {
        setData('role', role);
        setCPF('');
        setCNPJ('');
        setData('document', '');
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    useEffect(() => {
        if (data.role === 'collector') {
            setData('document', cpf);
        } else {
            setData('document', cnpj);
        }
    }, [data.role, cpf, cnpj, setData]);

    return (
        <AuthLayout title="Criar uma conta" description="Digite seus dados para criar uma conta">
            <Head title="Cadastrar" />
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Select onValueChange={handleRoleChange} defaultValue={data.role}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a verified email to display" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="collector">Coletor</SelectItem>
                                <SelectItem value="merchant">Comercio</SelectItem>
                                <SelectItem value="cooperative">Cooperativa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Nome"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    {data.role === 'collector' ? (
                        <div className="grid gap-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                                id="cpf"
                                type="cpf"
                                required
                                tabIndex={3}
                                autoComplete="cpf"
                                maxLength={14}
                                inputMode="numeric"
                                value={documentMask('cpf', cpf)}
                                onChange={(e) => setCPF(e.target.value)}
                                disabled={processing}
                                placeholder="123.456.789-09"
                            />
                            <InputError message={errors.document} />
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            <Label htmlFor="cnpj">CNPJ</Label>
                            <Input
                                id="cnpj"
                                type="cnpj"
                                required
                                tabIndex={3}
                                maxLength={18}
                                inputMode="numeric"
                                autoComplete="cnpj"
                                value={documentMask('cnpj', cnpj)}
                                onChange={(e) => setCNPJ(e.target.value)}
                                disabled={processing}
                                placeholder="12.345.678/1234-12"
                            />
                            <InputError message={errors.document} />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Senha"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirmar senha</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={5}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirmar senha"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Criar conta
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Já possui uma conta?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Entrar
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
