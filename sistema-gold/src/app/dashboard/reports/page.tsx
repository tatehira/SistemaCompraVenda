import { getReports, getCustomers } from '@/actions/transactions'
import { getPoints } from '@/actions/points'
import { ReportsClient } from './reports-client'

export const dynamic = 'force-dynamic'

export default async function ReportsPage(props: {
    searchParams: Promise<{ from?: string; to?: string; pointId?: string; customer?: string }>
}) {
    const searchParams = await props.searchParams

    // Default to first day of current month to today
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)

    // Format YYYY-MM-DD
    const defaultStart = firstDay.toISOString().split('T')[0]
    const defaultEnd = now.toISOString().split('T')[0]

    const from = searchParams.from || defaultStart
    const to = searchParams.to || defaultEnd
    const pointId = searchParams.pointId ? Number(searchParams.pointId) : undefined
    const customer = searchParams.customer

    const data = await getReports(from, to, pointId, customer)
    const points = await getPoints()
    const customers = await getCustomers()

    return (
        <ReportsClient
            transactions={data.transactions}
            summary={data.summary}
            dateRange={{ start: from, end: to }}
            points={points}
            initialPointId={searchParams.pointId}
            customers={customers}
            initialCustomer={searchParams.customer}
        />
    )
}
