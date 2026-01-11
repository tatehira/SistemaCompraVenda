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
            <h1 className="text-3xl font-bold tracking-tight text-amber-500">Estoque Atual</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inventory.map((item: any, idx: number) => (
                    <Card key={idx} className="border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500">
                                {item.point}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600">
                                {formatWeight(item.stock_grams)}
                            </div>
                            <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">
                                {item.gold}
                            </p>
                        </CardContent>
                    </Card>
                ))}
                {inventory.length === 0 && (
                    <p className="text-zinc-500">Nenhum item em estoque.</p>
                )}
            </div>
        </div>
    )
}
