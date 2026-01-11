'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export function DailySalesChart({ data }: { data: any[] }) {
    // Format data if needed, or assume it's good
    // data format: [{ date: '2023-01-01', total: 1000 }]

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 border-indigo-100 shadow-xl shadow-indigo-500/5 bg-white">
            <CardHeader>
                <CardTitle className="text-stripe-gradient font-bold">Vendas Diárias (Últimos 30 dias)</CardTitle>
                <CardDescription>Acompanhamento do volume de vendas</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full min-w-0">
                    {data.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-zinc-400">
                            Sem dados de vendas recentes.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(val) => {
                                        const d = new Date(val);
                                        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                                    }}
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `R$ ${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, 'Vendas']}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#4f46e5"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
