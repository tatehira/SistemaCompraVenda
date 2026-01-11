'use client'

import { login, register } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

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
        <div className="flex h-screen items-center justify-center">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>{isRegister ? 'Criar Conta' : 'Entrar'}</CardTitle>
                    <CardDescription>
                        {isRegister ? 'Insira seus dados para criar uma conta.' : 'Insira suas credenciais para acessar.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="username">Usuário</Label>
                            <Input id="username" name="username" placeholder="Seu nome de usuário" required />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" name="password" type="password" placeholder="Sua senha" required />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <Button className="w-full mt-2" type="submit">
                            {isRegister ? 'Registrar' : 'Login'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button variant="link" onClick={() => setIsRegister(!isRegister)}>
                        {isRegister ? 'Já tem uma conta? Entrar' : 'Não tem conta? Registrar'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
