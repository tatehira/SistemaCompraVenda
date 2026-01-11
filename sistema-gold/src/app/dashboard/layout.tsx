import Link from 'next/link'
import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { SidebarNav } from '@/components/dashboard/sidebar-nav'
import { MobileNav } from '@/components/dashboard/mobile-nav'
import { LogOut } from 'lucide-react'

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

                <SidebarNav />

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
                    <MobileNav />
                    <Link href="/dashboard" className="font-bold text-lg">
                        <span className="text-stripe-gradient">GOLD</span>SYSTEM
                    </Link>
                </header>

                <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </main>
            </div>
        </div >
    )
}
