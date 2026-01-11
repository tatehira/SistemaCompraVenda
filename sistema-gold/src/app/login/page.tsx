'use client'

import { login, register } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { Lock, User } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setError(null)
        const action = isRegister ? register : login
        const result = await action(formData)
        if (result && result.error) {
            setError(result.error)
        }
    }

    return (
        <div className="flex h-screen items-center justify-center bg-[#111439] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[100px]" />
            </div>

            <Card className="w-[380px] z-10 border-indigo-500/20 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center relative">
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                        <Image
                            src="/logo.png"
                            alt="Gold System Logo"
                            width={96}
                            height={96}
                            className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white tracking-tight">
                        <span className="text-white">GOLD</span><span className="text-indigo-400">SYSTEM</span>
                    </CardTitle>
                    <CardDescription className="text-indigo-200/60">
                        {isRegister ? 'Crie sua conta para começar.' : 'Bem-vindo de volta!'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="grid w-full items-center gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-indigo-100">Usuário</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                                <Input
                                    id="username"
                                    name="username"
                                    placeholder="Ex: joaosilva"
                                    required
                                    className="pl-9 bg-black/20 border-indigo-500/20 text-indigo-100 placeholder:text-indigo-400/50 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-indigo-100">Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="pl-9 bg-black/20 border-indigo-500/20 text-indigo-100 placeholder:text-indigo-400/50 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center">
                                {error}
                            </div>
                        )}
                        <Button className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium py-5 shadow-lg shadow-indigo-500/25 border-0" type="submit">
                            {isRegister ? 'Criar Conta' : 'Acessar Sistema'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-white/5 pt-6 pb-6">
                    <Button variant="link" onClick={() => setIsRegister(!isRegister)} className="text-indigo-300 hover:text-white transition-colors">
                        {isRegister ? 'Já tem conta? Fazer login' : 'Não tem conta? Registrar-se'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
