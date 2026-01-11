'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { LayoutDashboard, ShoppingCart, DollarSign, Package, History, Settings } from 'lucide-react'

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/buy', label: 'Comprar', icon: ShoppingCart },
    { href: '/dashboard/sell', label: 'Vender', icon: DollarSign },
    { href: '/dashboard/inventory', label: 'Estoque', icon: Package },
    { href: '/dashboard/transactions', label: 'Histórico', icon: History },
    { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
]

export function SidebarNav() {
    const pathname = usePathname()

    return (
        <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => {
                // Exact match for dashboard, startswith for others if needed, but exact is safer for these specific routes
                // Exception: dashboard home is /dashboard, others are /dashboard/xyz
                const isActive = item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname?.startsWith(item.href)

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={clsx(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200",
                            isActive
                                ? "bg-white/20 text-white font-semibold shadow-inner"
                                : "text-slate-200 hover:text-white hover:bg-white/10"
                        )}
                    >
                        <item.icon className={clsx("h-4 w-4", isActive ? "text-indigo-100" : "text-slate-300")} />
                        {item.label}
                    </Link>
                )
            })}
        </nav>
    )
}
