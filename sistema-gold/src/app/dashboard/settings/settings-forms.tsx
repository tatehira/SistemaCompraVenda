'use client'

import { useState } from 'react'
import { addPoint as addPointAction, deletePoint as deletePointAction } from '@/actions/points'
import { addCourier as addCourierAction, deleteCourier as deleteCourierAction } from '@/actions/couriers'
import { addGoldType as addGoldAction, deleteGoldType as deleteGoldAction } from '@/actions/gold'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'

export function GoldTypeForm({ list, userId }: { list: any[], userId: number }) {
    const [name, setName] = useState('')

    async function handleSubmit() {
        await addGoldAction(name, userId)
        setName('')
    }

    async function handleDelete(id: number) {
        if (confirm('Tem certeza?')) await deleteGoldAction(id)
    }

    return (
        <Card className="border-amber-200/50 bg-white">
            <CardHeader>
                <CardTitle>Tipos de Ouro</CardTitle>
                <CardDescription>Cadastre os tipos de ouro (ex: 18k, 24k).</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-4">
                    <Input placeholder="Nome (ex: Gold 18k)" value={name} onChange={e => setName(e.target.value)} />
                    <Button onClick={handleSubmit} className="bg-amber-600 hover:bg-amber-700 text-white">Adicionar</Button>
                </div>
                <div className="space-y-2">
                    {list.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-2 border rounded bg-zinc-50 border-zinc-200">
                            <span>{item.name}</span>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export function PointsForm({ list, userId }: { list: any[], userId: number }) {
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')

    async function handleSubmit() {
        await addPointAction(name, address, userId)
        setName('')
        setAddress('')
    }

    async function handleDelete(id: number) {
        if (confirm('Tem certeza?')) await deletePointAction(id)
    }

    return (
        <Card className="border-amber-200/50 bg-white">
            <CardHeader>
                <CardTitle>Locais / Filiais</CardTitle>
                <CardDescription>Gerencie seus pontos de venda.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2 mb-4">
                    <Input placeholder="Nome (ex: Loja Centro)" value={name} onChange={e => setName(e.target.value)} />
                    <Input placeholder="Endereço" value={address} onChange={e => setAddress(e.target.value)} />
                    <Button onClick={handleSubmit} className="bg-amber-600 hover:bg-amber-700 text-white">Adicionar</Button>
                </div>
                <div className="space-y-2">
                    {list.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-2 border rounded bg-zinc-50 border-zinc-200">
                            <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-zinc-500">{item.address}</div>
                            </div>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export function CouriersForm({ list, userId }: { list: any[], userId: number }) {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [fee, setFee] = useState('')

    async function handleSubmit() {
        await addCourierAction(name, phone, Number(fee), userId)
        setName('')
        setPhone('')
        setFee('')
    }

    async function handleDelete(id: number) {
        if (confirm('Tem certeza?')) await deleteCourierAction(id)
    }

    return (
        <Card className="border-amber-200/50 bg-white">
            <CardHeader>
                <CardTitle>Motoboys / Entregadores</CardTitle>
                <CardDescription>Cadastre seus entregadores.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2 mb-4">
                    <Input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
                    <Input placeholder="Telefone" value={phone} onChange={e => setPhone(e.target.value)} />
                    <Input placeholder="Taxa Padrão (R$)" type="number" value={fee} onChange={e => setFee(e.target.value)} />
                    <Button onClick={handleSubmit} className="bg-amber-600 hover:bg-amber-700 text-white">Adicionar</Button>
                </div>
                <div className="space-y-2">
                    {list.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-2 border rounded bg-zinc-50 border-zinc-200">
                            <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-zinc-500">{item.phone} - R$ {item.default_fee}</div>
                            </div>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
