import { getGoldTypes } from '@/actions/gold'
import { getPoints } from '@/actions/points'
import { buy } from '@/actions/transactions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'

export default async function BuyPage() {
    const goldTypes = await getGoldTypes()
    const points = await getPoints()

    async function action(formData: FormData) {
        'use server'
        const res = await buy(formData)
        if (res?.error) {
            console.error(res.error)
        } else {
            redirect('/dashboard/inventory')
        }
    }

    return (
        <div className="flex justify-center">
            <Card className="w-full max-w-lg border-amber-200 dark:border-amber-900 shadow-amber-500/10 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-amber-600 dark:text-amber-500">Nova Compra</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={action} className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Local (Ponto)</Label>
                                <select name="point_id" className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800 focus:ring-amber-500" required>
                                    {points.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label>Tipo de Ouro</Label>
                                <select name="gold_type_id" className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800 focus:ring-amber-500" required>
                                    {goldTypes.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Peso</Label>
                                <Input name="weight" type="number" step="0.01" required />
                            </div>
                            <div>
                                <Label>Unidade</Label>
                                <select name="unit" className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800 focus:ring-amber-500">
                                    <option value="g">Grama (g)</option>
                                    <option value="kg">Quilo (kg)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <Label>Preço Total (R$)</Label>
                            <Input name="price" type="number" step="0.01" required />
                        </div>

                        <div>
                            <Label>Fornecedor / Cliente</Label>
                            <Input name="customer" placeholder="Nome do vendedor" />
                        </div>

                        <div>
                            <Label>Comprovante (Foto)</Label>
                            <Input name="receipt" type="file" accept="image/*" />
                        </div>

                        <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white">Registrar Compra</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
