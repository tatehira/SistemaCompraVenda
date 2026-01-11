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
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Dashboard</h1>
            <p className="text-slate-300 font-medium">Bem-vindo de volta, {username}.</p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-indigo-500/20 shadow-lg shadow-black/20 bg-[#1e293b]/70 backdrop-blur-md hover:bg-[#1e293b]/90 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-200">
                            Vendas (Últimos 30d)
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-indigo-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white drop-shadow-sm">
                            {totalSales30d.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                        <p className="text-xs text-indigo-300 mt-1 font-medium">
                            +100% (Impl. Inicial)
                        </p>
                    </CardContent>
                </Card>
                {/* Placeholders for future metrics */}
                <Card className="border-indigo-500/20 shadow-lg shadow-black/20 bg-[#1e293b]/70 backdrop-blur-md opacity-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-200">Lucro Estimado</CardTitle>
                        <span className="text-emerald-400 font-bold">$</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-100">--</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 grid-cols-1">
                <DailySalesChart data={dailySales} />
            </div>
        </div>
    )
}
