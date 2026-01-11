import Link from 'next/link'
import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, ShoppingCart, DollarSign, Package, History, Settings, LogOut } from 'lucide-react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen w-full bg-zinc-100 dark:bg-black">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 sm:flex">
                <div className="flex h-16 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg">
                        <span className="text-amber-500">Gold</span>System
                    </Link>
                </div>
                <nav className="flex flex-col gap-4 p-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/buy"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Comprar
                    </Link>
                    <Link
                        href="/dashboard/sell"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                    >
                        <DollarSign className="h-4 w-4" />
                        Vender
                    </Link>
                    <Link
                        href="/dashboard/inventory"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                    >
                        <Package className="h-4 w-4" />
                        Estoque
                    </Link>
                    <Link
                        href="/dashboard/transactions"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                    >
                        <History className="h-4 w-4" />
                        Histórico
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                    >
                        <Settings className="h-4 w-4" />
                        Configurações
                    </Link>
                </nav>
                <div className="mt-auto p-4 border-t border-zinc-200 dark:border-zinc-800">
                    <form action={logout}>
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <LogOut className="h-4 w-4" />
                            Sair
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-col sm:pl-64 w-full">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950 sm:hidden">
                    {/* Mobile Header (Simplified) */}
                    <Link href="/dashboard" className="font-semibold text-lg">
                        <span className="text-amber-500">Gold</span>System
                    </Link>
                </header>

                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
