'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ArrowDownCircle, ArrowUpCircle, DollarSign, Scale, ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react'
import { exportToCSV, exportToPDF } from '@/lib/export-utils'
import { clsx } from 'clsx'

interface AnalyticsDashboardProps {
    transactions: any[]
    summary: {
        totalBuy: number
        totalSell: number
        balance: number
        totalBuyWeight: number
        totalSellWeight: number
    }
    dateRange: {
        start: string
        end: string
    }
    points: any[]
    initialPointId?: string | number
    customers: string[]
    initialCustomer?: string
}

export function AnalyticsDashboard({ transactions, summary, dateRange, points, initialPointId, customers, initialCustomer }: AnalyticsDashboardProps) {
    const router = useRouter()
    const [startDate, setStartDate] = useState(dateRange.start)
    const [endDate, setEndDate] = useState(dateRange.end)
    const [pointId, setPointId] = useState(initialPointId?.toString() || '')
    const [customer, setCustomer] = useState(initialCustomer || '')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(() => {
        setCurrentPage(1)
    }, [transactions])


    const handleFilter = () => {
        router.push(`/dashboard?from=${startDate}&to=${endDate}&pointId=${pointId}&customer=${customer}`)
    }


    // Prepare chart data
    // Group transactions by date for the chart
    const chartDataMap = new Map()

    transactions.forEach(t => {
        const date = t.date.split('T')[0]
        if (!chartDataMap.has(date)) {
            chartDataMap.set(date, { date, buy: 0, sell: 0 })
        }
        const entry = chartDataMap.get(date)
        if (t.type === 'BUY') entry.buy += t.price
        if (t.type === 'SELL') entry.sell += t.price
    })

    const chartData = Array.from(chartDataMap.values()).sort((a, b) => a.date.localeCompare(b.date))

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(transactions.length / itemsPerPage)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)


    return (
        <div className="space-y-8">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Financeiro</h1>
                    <p className="text-slate-400 mt-1">Visão geral do sistema</p>
                </div>

                <div className="flex items-end gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                    <div>
                        <label className="text-xs text-slate-400 block mb-1 ml-1">Data Início</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1 ml-1">Data Fim</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1 ml-1">Local</label>
                        <select
                            value={pointId}
                            onChange={(e) => setPointId(e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        >
                            <option value="">Todos</option>
                            {points.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1 ml-1">Cliente</label>
                        <select
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        >
                            <option value="">Todos</option>
                            {customers.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleFilter}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:ring-4 focus:ring-indigo-500/30 transition-all h-[42px]"
                    >
                        Filtrar
                    </button>

                    <div className="h-8 w-px bg-slate-700 mx-2 hidden lg:block"></div>

                    <button
                        onClick={() => exportToCSV(transactions)}
                        className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-medium rounded-lg text-sm px-4 py-2.5 transition-all h-[42px] flex items-center gap-2"
                        title="Exportar CSV"
                    >
                        <FileText className="w-4 h-4" />
                        <span className="hidden xl:inline">CSV</span>
                    </button>

                    <button
                        onClick={() => exportToPDF(transactions, summary, { start: startDate, end: endDate })}
                        className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-medium rounded-lg text-sm px-4 py-2.5 transition-all h-[42px] flex items-center gap-2"
                        title="Exportar PDF"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden xl:inline">PDF</span>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-emerald-500/20 shadow-lg shadow-black/20 bg-[#1e293b]/70 backdrop-blur-md hover:-translate-y-1 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-emerald-200">Total Vendas</CardTitle>
                        <ArrowUpCircle className="h-4 w-4 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">R$ {summary.totalSell.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-emerald-400/70 mt-1 uppercase tracking-wider font-medium">{summary.totalSellWeight.toFixed(2)}g vendidos</p>
                    </CardContent>
                </Card>

                <Card className="border-blue-500/20 shadow-lg shadow-black/20 bg-[#1e293b]/70 backdrop-blur-md hover:-translate-y-1 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-blue-200">Total Compras</CardTitle>
                        <ArrowDownCircle className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">R$ {summary.totalBuy.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-blue-400/70 mt-1 uppercase tracking-wider font-medium">{summary.totalBuyWeight.toFixed(2)}g comprados</p>
                    </CardContent>
                </Card>

                <Card className={clsx(
                    "shadow-lg shadow-black/20 bg-[#1e293b]/70 backdrop-blur-md hover:-translate-y-1 transition-all duration-300",
                    summary.balance >= 0
                        ? "border-indigo-500/20"
                        : "border-red-500/20"
                )}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={clsx("text-sm font-semibold", summary.balance >= 0 ? "text-indigo-200" : "text-red-200")}>
                            Balanço Líquido
                        </CardTitle>
                        <DollarSign className={clsx("h-4 w-4", summary.balance >= 0 ? "text-indigo-400" : "text-red-400")} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">R$ {summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <p className={clsx("text-xs mt-1 uppercase tracking-wider font-medium", summary.balance >= 0 ? "text-indigo-400/70" : "text-red-400/70")}>
                            {summary.balance >= 0 ? 'Lucro' : 'Déficit'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-700/50 shadow-lg shadow-black/20 bg-[#1e293b]/70 backdrop-blur-md hover:-translate-y-1 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-300">Volume Total</CardTitle>
                        <Scale className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{(summary.totalBuyWeight + summary.totalSellWeight).toFixed(2)}g</div>
                        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Movimentado</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-slate-700/50 shadow-lg shadow-black/20 bg-[#1e293b]/70 backdrop-blur-md hover:-translate-y-1 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-white">Fluxo de Caixa Diário</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickFormatter={(val) => `R$${val / 1000}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        formatter={(value: number | undefined) => [`R$ ${value ? value.toLocaleString('pt-BR') : '0,00'}`, undefined]}
                                        cursor={{ fill: '#334155', opacity: 0.2 }}
                                    />
                                    <Legend />
                                    <Bar dataKey="sell" name="Vendas" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="buy" name="Compras" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Transactions List (Mini) */}
                <Card className="border-slate-700/50 shadow-lg shadow-black/20 bg-[#1e293b]/70 backdrop-blur-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-white">Últimas Transações</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto pr-2 max-h-[300px] lg:max-h-[340px]">
                        <div className="space-y-4">
                            {transactions.slice(0, 10).map((t) => (
                                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-slate-700/30 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            "p-2 rounded-full",
                                            t.type === 'BUY' ? "bg-blue-500/10 text-blue-400" : "bg-emerald-500/10 text-emerald-400"
                                        )}>
                                            {t.type === 'BUY' ? <ArrowDownCircle className="w-4 h-4" /> : <ArrowUpCircle className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{t.gold_name} - {t.weight_grams}g</p>
                                            <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={clsx("text-sm font-bold", t.type === 'BUY' ? "text-blue-300" : "text-emerald-300")}>
                                            R$ {t.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                        <p className="text-xs text-slate-500">{t.point_name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Full List Section (Optional, can be hidden or shown) */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">Relatório Detalhado</h2>
                <div className="border border-slate-700/50 rounded-xl overflow-hidden shadow-lg shadow-black/20 bg-[#1e293b]/70 backdrop-blur-md hover:-translate-y-1 transition-all duration-300">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-white uppercase bg-slate-900/80 border-b border-slate-700 font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4">Tipo</th>
                                    <th className="px-6 py-4">Item</th>
                                    <th className="px-6 py-4">Local</th>
                                    <th className="px-6 py-4 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTransactions.map((t) => (
                                    <tr key={t.id} className="border-b border-slate-700/50 last:border-0 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-300">
                                            {new Date(t.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            {t.customer_name || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "px-2 py-1 rounded-md text-xs font-bold",
                                                t.type === 'BUY' ? "bg-blue-500/20 text-blue-300" : "bg-emerald-500/20 text-emerald-300"
                                            )}>
                                                {t.type === 'BUY' ? 'COMPRA' : 'VENDA'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            {t.gold_name} ({t.weight_grams}g)
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">{t.point_name}</td>
                                        <td className="px-6 py-4 text-right font-medium text-white">
                                            R$ {t.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Anterior
                        </button>

                        <span className="text-sm text-slate-400">
                            Página <span className="font-semibold text-white">{currentPage}</span> de <span className="font-semibold text-white">{totalPages}</span>
                        </span>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Próximo
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
