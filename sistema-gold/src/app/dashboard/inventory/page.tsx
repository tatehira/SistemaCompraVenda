import { getInventory } from '@/actions/transactions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function InventoryPage() {
    const inventory = await getInventory()

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Estoque Atual</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inventory.map((item: any, idx: number) => (
                    <Card key={idx}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500">
                                {item.point}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{item.stock.toFixed(2)} {item.unit}</div>
                            <p className="text-xs text-zinc-500 mt-1">
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
