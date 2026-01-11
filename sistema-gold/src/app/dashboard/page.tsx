import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/actions/auth"
import { getDailySales } from "@/actions/transactions"
import { DailySalesChart } from "@/components/dashboard/daily-sales-chart"
import { DollarSign } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const session = await getSession()
    const username = session?.username as string || 'Usuário'

    // Fetch Chart Data
    const dailySales = await getDailySales() as { date: string, total: number }[]

    // Calculate 30-day total
    const totalSales30d = dailySales.reduce((acc, curr) => acc + curr.total, 0)

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight text-stripe-gradient">Dashboard</h1>
            <p className="text-zinc-500">Bem-vindo de volta, {username}.</p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-indigo-100 shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">
                            Vendas (Últimos 30d)
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-indigo-900">
                            {totalSales30d.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                        <p className="text-xs text-indigo-400 mt-1">
                            +100% (Impl. Inicial)
                        </p>
                    </CardContent>
                </Card>
                {/* Placeholders for future metrics */}
                <Card className="border-indigo-100 shadow-sm bg-indigo-50/50 opacity-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Lucro Estimado</CardTitle>
                        <span className="text-zinc-300 font-bold">$</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-300">--</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 grid-cols-1">
                <DailySalesChart data={dailySales} />
            </div>
        </div>
    )
}
