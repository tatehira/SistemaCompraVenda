'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { clsx } from 'clsx'
import Link from 'next/link'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'

interface Transaction {
    id: number
    type: 'BUY' | 'SELL'
    gold_name: string
    point_name: string
    weight_grams: number
    unit: string
    price: number
    date: string
    customer_name?: string
    receipt_path?: string
}

export function TransactionsList({ transactions }: { transactions: Transaction[] }) {
    const [activeTab, setActiveTab] = useState<'in' | 'out'>('in')

    const filteredTransactions = transactions.filter(t =>
        activeTab === 'in' ? t.type === 'BUY' : t.type === 'SELL'
    )

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex p-1 space-x-1 bg-slate-800/50 rounded-xl w-fit border border-slate-700">
                <button
                    onClick={() => setActiveTab('in')}
                    className={clsx(
                        "flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300",
                        activeTab === 'in'
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500"
                            : "text-slate-300 hover:text-white hover:bg-white/5"
                    )}
                >
                    <ArrowDownCircle className={clsx("w-4 h-4", activeTab === 'in' ? "text-indigo-200" : "text-slate-400")} />
                    Entradas (Compras)
                </button>
                <button
                    onClick={() => setActiveTab('out')}
                    className={clsx(
                        "flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300",
                        activeTab === 'out'
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500"
                            : "text-slate-300 hover:text-white hover:bg-white/5"
                    )}
                >
                    <ArrowUpCircle className={clsx("w-4 h-4", activeTab === 'out' ? "text-emerald-200" : "text-slate-400")} />
                    Saídas (Vendas)
                </button>
            </div>

            {/* Table */}
            <Card className="border-slate-800 shadow-xl bg-[#1e293b]/70 backdrop-blur-md overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-white uppercase bg-slate-900/80 border-b border-slate-700 font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4">Tipo</th>
                                    <th className="px-6 py-4">Ouro</th>
                                    <th className="px-6 py-4">Peso</th>
                                    <th className="px-6 py-4">Valor</th>
                                    <th className="px-6 py-4">Local</th>
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4 text-right">Recibo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((t) => (
                                    <tr key={t.id} className="border-b border-slate-700/50 last:border-0 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-200 font-medium">
                                            {new Date(t.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "px-2.5 py-1 rounded-full text-xs font-bold border",
                                                t.type === 'BUY'
                                                    ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                            )}>
                                                {t.type === 'BUY' ? 'COMPRA' : 'VENDA'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-200">{t.gold_name}</td>
                                        <td className="px-6 py-4 font-bold text-white">{t.weight_grams} {t.unit}</td>
                                        <td className="px-6 py-4 text-white font-medium">R$ {t.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-slate-300">{t.point_name}</td>
                                        <td className="px-6 py-4 text-slate-300">{t.customer_name || '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            {t.receipt_path && (
                                                <Link
                                                    href={t.receipt_path}
                                                    target="_blank"
                                                    className="text-indigo-300 hover:text-indigo-200 font-medium hover:underline"
                                                >
                                                    Ver Comprovante
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredTransactions.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-slate-300 font-medium">
                                            Nenhuma transação de {activeTab === 'in' ? 'entrada' : 'saída'} encontrada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
