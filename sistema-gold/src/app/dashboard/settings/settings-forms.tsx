'use client'

import { useState } from 'react'
import { addPoint as addPointAction, deletePoint as deletePointAction } from '@/actions/points'
import { addCourier as addCourierAction, deleteCourier as deleteCourierAction } from '@/actions/couriers'
import { addGoldType as addGoldAction, deleteGoldType as deleteGoldAction } from '@/actions/gold'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Trash2, MapPin, Phone, DollarSign, Gem } from 'lucide-react'

export function GoldTypeForm({ list, userId }: { list: any[], userId: number }) {
    const [name, setName] = useState('')

    async function handleSubmit() {
        if (!name) return
        await addGoldAction(name, userId)
        setName('')
    }

    async function handleDelete(id: number) {
        if (confirm('Tem certeza?')) await deleteGoldAction(id)
    }

    return (
        <Card className="border-indigo-500/20 bg-[#1e293b]/70 backdrop-blur-md shadow-xl shadow-black/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <Gem className="w-5 h-5 text-indigo-400" />
                    Tipos de Ouro
                </CardTitle>
                <CardDescription className="text-slate-300">Cadastre os tipos de ouro (ex: 18k, 24k).</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-6">
                    <Input
                        placeholder="Nome (ex: Gold 18k)"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="bg-slate-900/50 border-indigo-500/20 text-white placeholder:text-slate-400 focus-visible:ring-indigo-500"
                    />
                    <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                        Adicionar
                    </Button>
                </div>
                <div className="space-y-3">
                    {list.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-800/50 border-slate-700 hover:border-indigo-500/30 transition-colors">
                            <span className="text-slate-200 font-medium">{item.name}</span>
                            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {list.length === 0 && <p className="text-center text-sm text-slate-400 py-4">Nenhum tipo cadastrado.</p>}
                </div>
            </CardContent>
        </Card>
    )
}

export function PointsForm({ list, userId }: { list: any[], userId: number }) {
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')

    async function handleSubmit() {
        if (!name) return
        await addPointAction(name, address, userId)
        setName('')
        setAddress('')
    }

    async function handleDelete(id: number) {
        if (confirm('Tem certeza?')) await deletePointAction(id)
    }

    return (
        <Card className="border-indigo-500/20 bg-[#1e293b]/70 backdrop-blur-md shadow-xl shadow-black/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    Locais / Filiais
                </CardTitle>
                <CardDescription className="text-slate-300">Gerencie seus pontos de venda.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3 mb-6">
                    <Input
                        placeholder="Nome (ex: Loja Centro)"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="bg-slate-900/50 border-indigo-500/20 text-white placeholder:text-slate-400 focus-visible:ring-emerald-500"
                    />
                    <div className="flex gap-2">
                        <Input
                            placeholder="Endereço (Opcional)"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="bg-slate-900/50 border-indigo-500/20 text-white placeholder:text-slate-400 focus-visible:ring-emerald-500"
                        />
                        <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 shrink-0">
                            Adicionar
                        </Button>
                    </div>
                </div>
                <div className="space-y-3">
                    {list.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-800/50 border-slate-700 hover:border-emerald-500/30 transition-colors">
                            <div>
                                <div className="font-medium text-slate-200">{item.name}</div>
                                {item.address && <div className="text-sm text-slate-400">{item.address}</div>}
                            </div>
                            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {list.length === 0 && <p className="text-center text-sm text-slate-400 py-4">Nenhum local cadastrado.</p>}
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
        if (!name) return
        await addCourierAction(name, phone, Number(fee), userId)
        setName('')
        setPhone('')
        setFee('')
    }

    async function handleDelete(id: number) {
        if (confirm('Tem certeza?')) await deleteCourierAction(id)
    }

    return (
        <Card className="border-indigo-500/20 bg-[#1e293b]/70 backdrop-blur-md shadow-xl shadow-black/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <Phone className="w-5 h-5 text-blue-400" />
                    Motoboys / Entregadores
                </CardTitle>
                <CardDescription className="text-slate-300">Cadastre seus entregadores e taxas.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3 mb-6">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Nome"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="bg-slate-900/50 border-indigo-500/20 text-white placeholder:text-slate-400 focus-visible:ring-blue-500"
                        />
                        <Input
                            placeholder="Telefone"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="bg-slate-900/50 border-indigo-500/20 text-white placeholder:text-slate-400 focus-visible:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="relative w-full">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Taxa Padrão"
                                type="number"
                                value={fee}
                                onChange={e => setFee(e.target.value)}
                                className="pl-9 bg-slate-900/50 border-indigo-500/20 text-white placeholder:text-slate-400 focus-visible:ring-blue-500"
                            />
                        </div>
                        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 shrink-0">
                            Adicionar
                        </Button>
                    </div>
                </div>
                <div className="space-y-3">
                    {list.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-800/50 border-slate-700 hover:border-blue-500/30 transition-colors">
                            <div>
                                <div className="font-medium text-slate-200">{item.name}</div>
                                <div className="text-sm text-slate-400 flex items-center gap-2">
                                    <span>{item.phone || 'Sem telefone'}</span>
                                    {item.default_fee > 0 && <span className="text-emerald-400 font-medium">• R$ {item.default_fee}</span>}
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {list.length === 0 && <p className="text-center text-sm text-slate-400 py-4">Nenhum entregador cadastrado.</p>}
                </div>
            </CardContent>
        </Card>
    )
}
