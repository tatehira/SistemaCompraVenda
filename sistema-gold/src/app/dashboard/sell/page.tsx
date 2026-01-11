import { getGoldTypes } from '@/actions/gold'
import { getPoints } from '@/actions/points'
import { getCouriers } from '@/actions/couriers'
import { sell } from '@/actions/transactions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function SellPage() {
    const goldTypes = await getGoldTypes()
    const points = await getPoints()
    const couriers = await getCouriers()

    async function action(formData: FormData) {
        'use server'
        const res = await sell(formData)
        if (res?.error) {
            console.error(res.error)
        } else {
            redirect('/dashboard/inventory')
        }
    }

    return (
        <div className="flex justify-center">
            <Card className="w-full max-w-lg border-indigo-100 shadow-xl shadow-indigo-500/5 rounded-xl transition-all duration-300 hover:shadow-indigo-500/10 bg-white">
                <CardHeader>
                    <CardTitle className="text-stripe-gradient text-2xl font-bold">Nova Venda</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={action} className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Local de Saída</Label>
                                <select name="point_id" className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200" required>
                                    {points.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label>Tipo de Ouro</Label>
                                <select name="gold_type_id" className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200" required>
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
                                <select name="unit" className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200">
                                    <option value="g">Grama (g)</option>
                                    <option value="kg">Quilo (kg)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <Label>Preço de Venda (R$)</Label>
                            <Input name="price" type="number" step="0.01" required />
                        </div>

                        <div>
                            <Label>Cliente</Label>
                            <Input name="customer" placeholder="Nome do cliente" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Entregador (Opcional)</Label>
                                <select name="delivery_courier" className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200">
                                    <option value="">Nenhum / Retirada</option>
                                    {couriers.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label>Custo Entrega (R$)</Label>
                                <Input name="delivery_cost" type="number" step="0.01" placeholder="0.00" />
                            </div>
                        </div>

                        <div>
                            <Label>Comprovante (Foto)</Label>
                            <Input name="receipt" type="file" accept="image/*" />
                        </div>

                        <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:scale-[1.02]">Registrar Venda</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
