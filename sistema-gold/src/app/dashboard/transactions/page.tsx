import { getTransactions } from '@/actions/transactions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { clsx } from 'clsx'
import Link from 'next/link'

export default async function TransactionsPage() {
    const transactions = await getTransactions()

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Histórico de Transações</h1>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                                <tr>
                                    <th className="px-4 py-3">Data</th>
                                    <th className="px-4 py-3">Tipo</th>
                                    <th className="px-4 py-3">Ouro</th>
                                    <th className="px-4 py-3">Peso</th>
                                    <th className="px-4 py-3">Valor</th>
                                    <th className="px-4 py-3">Local</th>
                                    <th className="px-4 py-3">Cliente</th>
                                    <th className="px-4 py-3">Recibo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t: any) => (
                                    <tr key={t.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                                        <td className="px-4 py-3 whitespace-nowrap">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">
                                            <span className={clsx(
                                                "px-2 py-1 rounded-full text-xs font-medium",
                                                t.type === 'BUY' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            )}>
                                                {t.type === 'BUY' ? 'COMPRA' : 'VENDA'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{t.gold_name}</td>
                                        <td className="px-4 py-3 font-medium">{t.weight_grams} {t.unit}</td>
                                        <td className="px-4 py-3">R$ {t.price.toFixed(2)}</td>
                                        <td className="px-4 py-3">{t.point_name}</td>
                                        <td className="px-4 py-3">{t.customer_name || '-'}</td>
                                        <td className="px-4 py-3">
                                            {t.receipt_path && (
                                                <Link href={t.receipt_path} target="_blank" className="text-blue-600 hover:underline">Ver</Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">Nenhuma transação encontrada.</td>
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
