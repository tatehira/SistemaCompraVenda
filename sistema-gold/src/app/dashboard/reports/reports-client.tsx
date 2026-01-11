'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download } from 'lucide-react'
import { clsx } from 'clsx'

interface ReportsClientProps {
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

export function ReportsClient({ transactions, summary, dateRange, points, initialPointId, customers, initialCustomer }: ReportsClientProps) {
    const router = useRouter()
    const [startDate, setStartDate] = useState(dateRange.start)
    const [endDate, setEndDate] = useState(dateRange.end)
    const [pointId, setPointId] = useState(initialPointId?.toString() || '')
    const [customer, setCustomer] = useState(initialCustomer || '')

    const handleFilter = () => {
        router.push(`/dashboard/reports?from=${startDate}&to=${endDate}&pointId=${pointId}&customer=${customer}`)
    }

    const handleExport = () => {
        const headers = ['Data', 'Cliente', 'Tipo', 'Item', 'Peso (g)', 'Local', 'Valor']
        const csvContent = [
            headers.join(','),
            ...transactions.map(t => [
                new Date(t.date).toLocaleDateString(),
                t.customer_name || '-',
                t.type === 'BUY' ? 'COMPRA' : 'VENDA',
                t.gold_name,
                t.weight_grams,
                t.point_name,
                t.price
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `relatorio-gold-system-${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }


    return (
        <div className="space-y-8">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Exportar Dados</h1>
                    <p className="text-slate-400 mt-1">Filtre e exporte seus relatórios financeiros</p>
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
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:ring-4 focus:ring-emerald-500/30 transition-all h-[42px]"
                    >
                        <Download className="w-4 h-4" />
                        Exportar CSV
                    </button>
                </div>
            </div>

        </div>
    )
}
