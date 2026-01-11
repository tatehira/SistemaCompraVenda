import { getGoldTypes } from '@/actions/gold'
import { getPoints } from '@/actions/points'
import { getCouriers } from '@/actions/couriers'
import { getSession } from '@/actions/auth'
import { GoldTypeForm, PointsForm, CouriersForm } from './settings-forms'

export default async function SettingsPage() {
    const session = await getSession()
    const userId = Number(session?.sub)

    const goldTypes = await getGoldTypes()
    const points = await getPoints()
    const couriers = await getCouriers()

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight text-stripe-gradient">Configurações</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <GoldTypeForm list={goldTypes} userId={userId} />
                <PointsForm list={points} userId={userId} />
                <CouriersForm list={couriers} userId={userId} />
            </div>
        </div>
    )
}
