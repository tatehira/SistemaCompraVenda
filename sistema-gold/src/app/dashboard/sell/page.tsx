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
            <Card className="w-full max-w-lg border-indigo-500/20 shadow-2xl shadow-black/40 rounded-xl transition-all duration-300 bg-[#1e293b]/50 backdrop-blur-sm">
                <CardHeader className="border-b border-white/5 pb-6">
                    <CardTitle className="text-white text-2xl font-bold flex items-center gap-2">
                        Nova Venda
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <form action={action} className="grid gap-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Local de Saída</Label>
                                <select name="point_id" className="flex h-11 w-full rounded-md border border-indigo-500/20 bg-slate-900/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200" required>
                                    {points.map((p: any) => <option key={p.id} value={p.id} className="bg-slate-800 text-white">{p.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Tipo de Ouro</Label>
                                <select name="gold_type_id" className="flex h-11 w-full rounded-md border border-indigo-500/20 bg-slate-900/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200" required>
                                    {goldTypes.map((g: any) => <option key={g.id} value={g.id} className="bg-slate-800 text-white">{g.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Peso</Label>
                                <Input name="weight" type="number" step="0.01" required className="bg-slate-900/50 border-indigo-500/20 text-white h-11" placeholder="0.00" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Unidade</Label>
                                <select name="unit" className="flex h-11 w-full rounded-md border border-indigo-500/20 bg-slate-900/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200">
                                    <option value="g" className="bg-slate-800">Grama (g)</option>
                                    <option value="kg" className="bg-slate-800">Quilo (kg)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-300">Preço de Venda (R$)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-slate-500 text-sm">R$</span>
                                <Input name="price" type="number" step="0.01" required className="pl-9 bg-slate-900/50 border-indigo-500/20 text-white h-11" placeholder="0.00" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-300">Cliente</Label>
                            <Input name="customer" placeholder="Nome do cliente" className="bg-slate-900/50 border-indigo-500/20 text-white h-11" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-300">Entregador (Opcional)</Label>
                            <select name="delivery_courier" className="flex h-11 w-full rounded-md border border-indigo-500/20 bg-slate-900/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200">
                                <option value="" className="bg-slate-800">Nenhum / Retirada</option>
                                {couriers.map((c: any) => <option key={c.id} value={c.name} className="bg-slate-800 text-white">{c.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-300">Comprovante (Foto)</Label>
                            <Input name="receipt" type="file" accept="image/*" className="bg-slate-900/50 border-indigo-500/20 text-slate-300 file:text-emerald-400 file:hover:text-emerald-300 cursor-pointer" />
                        </div>

                        <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:scale-[1.02] border-0 mt-2">
                            Registrar Venda
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
