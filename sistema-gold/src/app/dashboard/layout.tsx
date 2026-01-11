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
        <div className="flex min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/50 backdrop-blur-xl sm:flex transition-colors duration-300">
                <div className="flex h-16 items-center justify-center border-b border-zinc-200 px-6 dark:border-zinc-800">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <span className="text-amber-500 shiny-gold">GOLD</span>SYSTEM
                    </Link>
                </div>
                <nav className="flex flex-col gap-2 p-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-amber-600 hover:bg-amber-50 dark:text-zinc-400 dark:hover:text-amber-400 dark:hover:bg-amber-950/30"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/buy"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-amber-600 hover:bg-amber-50 dark:text-zinc-400 dark:hover:text-amber-400 dark:hover:bg-amber-950/30"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Comprar
                    </Link>
                    <Link
                        href="/dashboard/sell"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-amber-600 hover:bg-amber-50 dark:text-zinc-400 dark:hover:text-amber-400 dark:hover:bg-amber-950/30"
                    >
                        <DollarSign className="h-4 w-4" />
                        Vender
                    </Link>
                    <Link
                        href="/dashboard/inventory"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-amber-600 hover:bg-amber-50 dark:text-zinc-400 dark:hover:text-amber-400 dark:hover:bg-amber-950/30"
                    >
                        <Package className="h-4 w-4" />
                        Estoque
                    </Link>
                    <Link
                        href="/dashboard/transactions"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-amber-600 hover:bg-amber-50 dark:text-zinc-400 dark:hover:text-amber-400 dark:hover:bg-amber-950/30"
                    >
                        <History className="h-4 w-4" />
                        Histórico
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-amber-600 hover:bg-amber-50 dark:text-zinc-400 dark:hover:text-amber-400 dark:hover:bg-amber-950/30"
                    >
                        <Settings className="h-4 w-4" />
                        Configurações
                    </Link>
                </nav>
                <div className="mt-auto p-4 border-t border-zinc-200 dark:border-zinc-800">
                    <form action={logout}>
                        <Button variant="ghost" className="w-full justify-start gap-3 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:text-zinc-400 dark:hover:text-red-400 dark:hover:bg-red-950/30">
                            <LogOut className="h-4 w-4" />
                            Sair
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-col sm:pl-64 w-full">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-zinc-200 bg-white/80 backdrop-blur-md px-6 dark:border-zinc-800 dark:bg-zinc-950/80 sm:hidden">
                    <Link href="/dashboard" className="font-bold text-lg">
                        <span className="text-amber-500">GOLD</span>SYSTEM
                    </Link>
                </header>

                <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </main>
            </div>
        </div>
    )
}
