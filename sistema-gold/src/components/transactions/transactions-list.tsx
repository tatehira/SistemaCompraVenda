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
            <div className="flex p-1 space-x-1 bg-zinc-100/80 rounded-xl w-fit border border-zinc-200">
                <button
                    onClick={() => setActiveTab('in')}
                    className={clsx(
                        "flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300",
                        activeTab === 'in'
                            ? "bg-white text-zinc-950 shadow-sm ring-1 ring-zinc-200"
                            : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50"
                    )}
                >
                    <ArrowDownCircle className={clsx("w-4 h-4", activeTab === 'in' ? "text-blue-600" : "text-zinc-400")} />
                    Entradas (Compras)
                </button>
                <button
                    onClick={() => setActiveTab('out')}
                    className={clsx(
                        "flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300",
                        activeTab === 'out'
                            ? "bg-white text-zinc-950 shadow-sm ring-1 ring-zinc-200"
                            : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50"
                    )}
                >
                    <ArrowUpCircle className={clsx("w-4 h-4", activeTab === 'out' ? "text-green-600" : "text-zinc-400")} />
                    Saídas (Vendas)
                </button>
            </div>

            {/* Table */}
            <Card className="border-zinc-200 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-zinc-600 uppercase bg-zinc-50 border-b border-zinc-200 font-semibold tracking-wider">
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
                                    <tr key={t.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-zinc-600 font-medium">
                                            {new Date(t.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "px-2.5 py-1 rounded-full text-xs font-bold border",
                                                t.type === 'BUY'
                                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                                    : "bg-green-50 text-green-700 border-green-200"
                                            )}>
                                                {t.type === 'BUY' ? 'COMPRA' : 'VENDA'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-700">{t.gold_name}</td>
                                        <td className="px-6 py-4 font-semibold text-zinc-900">{t.weight_grams} {t.unit}</td>
                                        <td className="px-6 py-4 text-zinc-700">R$ {t.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-zinc-600">{t.point_name}</td>
                                        <td className="px-6 py-4 text-zinc-600">{t.customer_name || '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            {t.receipt_path && (
                                                <Link
                                                    href={t.receipt_path}
                                                    target="_blank"
                                                    className="text-amber-600 hover:text-amber-700 font-medium hover:underline"
                                                >
                                                    Ver Comprovante
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredTransactions.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-zinc-400">
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
