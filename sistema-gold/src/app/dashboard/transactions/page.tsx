import { getTransactions } from '@/actions/transactions'
import { TransactionsList } from '@/components/transactions/transactions-list'

export const dynamic = 'force-dynamic'

export default async function TransactionsPage() {
    // Fetch data on the server and cast to avoid TS strictness with unknown[]
    const transactions = await getTransactions() as any[]

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight text-white">Histórico de Transações</h1>

            {/* Render Client Component with Key-based Tabs */}
            <TransactionsList transactions={transactions} />
        </div>
    )
}
