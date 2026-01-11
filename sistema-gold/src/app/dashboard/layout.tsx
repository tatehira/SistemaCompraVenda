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
        <div className="flex min-h-screen w-full transition-colors duration-300">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-indigo-900 bg-[#111439] text-white sm:flex transition-all duration-300 shadow-2xl">
                <div className="flex h-16 items-center justify-center border-b border-indigo-900/50 px-6 bg-[#111439]">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <span className="text-white font-extrabold text-2xl">GOLD</span><span className="text-indigo-200">SYSTEM</span>
                    </Link>
                </div>
                <nav className="flex flex-col gap-2 p-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-indigo-200 transition-all hover:text-white hover:bg-white/10"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/buy"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-indigo-200 transition-all hover:text-white hover:bg-white/10"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Comprar
                    </Link>
                    <Link
                        href="/dashboard/sell"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-indigo-200 transition-all hover:text-white hover:bg-white/10"
                    >
                        <DollarSign className="h-4 w-4" />
                        Vender
                    </Link>
                    <Link
                        href="/dashboard/inventory"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-indigo-200 transition-all hover:text-white hover:bg-white/10"
                    >
                        <Package className="h-4 w-4" />
                        Estoque
                    </Link>
                    <Link
                        href="/dashboard/transactions"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-indigo-200 transition-all hover:text-white hover:bg-white/10"
                    >
                        <History className="h-4 w-4" />
                        Histórico
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-indigo-200 transition-all hover:text-white hover:bg-white/10"
                    >
                        <Settings className="h-4 w-4" />
                        Configurações
                    </Link>
                </nav>
                <div className="mt-auto p-4 border-t border-indigo-900/50">
                    <form action={logout}>
                        <Button variant="ghost" className="w-full justify-start gap-3 text-indigo-300 hover:text-red-400 hover:bg-red-500/10">
                            <LogOut className="h-4 w-4" />
                            Sair
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-col sm:pl-64 w-full">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-indigo-100/50 bg-white/60 backdrop-blur-xl px-6 sm:hidden">
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
