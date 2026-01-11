'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarNav } from './sidebar-nav'
import Link from 'next/link'
import { clsx } from 'clsx'
import { logout } from '@/actions/auth'
import { LogOut } from 'lucide-react'

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const drawer = (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-in fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div className={clsx(
                "fixed inset-y-0 left-0 z-[70] w-72 bg-[#111439] text-white p-4 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col gap-4",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between px-2 pt-2 pb-6 border-b border-indigo-900/50">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tighter" onClick={() => setIsOpen(false)}>
                        <span className="text-white font-extrabold text-2xl">GOLD</span><span className="text-indigo-200">SYSTEM</span>
                    </Link>
                    <Button variant="ghost" size="icon" className="text-indigo-200 hover:text-white hover:bg-white/10" onClick={() => setIsOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div onClick={() => setIsOpen(false)}>
                    <SidebarNav />
                </div>

                <div className="mt-auto pt-4 border-t border-indigo-900/50">
                    <form action={logout}>
                        <Button variant="ghost" className="w-full justify-start gap-3 text-indigo-300 hover:text-red-400 hover:bg-red-500/10">
                            <LogOut className="h-4 w-4" />
                            Sair
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-zinc-700"
                onClick={() => setIsOpen(true)}
            >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
            </Button>

            {mounted && createPortal(drawer, document.body)}
        </>
    )
}
