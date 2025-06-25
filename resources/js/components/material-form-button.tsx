import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@radix-ui/react-dialog';
import { Plus } from 'lucide-react';

export default function MaterialFormButton() {
    return (
        <>
            <Dialog>
                <form>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="mx-8">
                            <Plus />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Adicionar material</DialogTitle>
                            <DialogDescription>Armazene aqui as informações de suas coletas</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="name-1">Material</Label>
                                <Input id="name-1" name="name" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="name-1">Peso</Label>
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
        </>
    );
}
