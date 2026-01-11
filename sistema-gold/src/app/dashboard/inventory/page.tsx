import { getInventory } from '@/actions/transactions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function formatWeight(grams: number) {
    if (Math.abs(grams) >= 1000) {
        return `${(grams / 1000).toFixed(3)} kg`
    }
    return `${grams.toFixed(2)} g`
}

export default async function InventoryPage() {
    const inventory = await getInventory()

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight text-white">Estoque Atual</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inventory.map((item: any, idx: number) => (
                    <Card key={idx} className="border-indigo-500/20 shadow-lg shadow-black/20 bg-[#1e293b]/70 backdrop-blur-md hover:bg-[#1e293b]/90 transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-slate-300">
                                {item.point}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white drop-shadow-sm">
                                {formatWeight(item.stock_grams)}
                            </div>
                            <p className="text-xs text-indigo-300 mt-1 uppercase tracking-wider font-medium">
                                {item.gold}
                            </p>
                        </CardContent>
                    </Card>
                ))}
                {inventory.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 bg-[#1e293b]/30 rounded-xl border border-dashed border-slate-700">
                        Nenhum item em estoque no momento.
                    </div>
                )}
            </div>
        </div>
    )
}
