import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/actions/auth"

export default async function DashboardPage() {
    const session = await getSession()
    const username = session?.username as string || 'Usuário'

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-zinc-500">Bem-vindo de volta, {username}.</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Vendas Total
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 45,231.89</div>
                        <p className="text-xs text-zinc-500">
                            +20.1% relação ao mês anterior
                        </p>
                    </CardContent>
                </Card>
                {/* Adicionar mais cards aqui */}
            </div>
        </div>
    )
}
