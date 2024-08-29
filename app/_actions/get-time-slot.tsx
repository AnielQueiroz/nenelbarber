"use server"

import { db } from "../_lib/prisma"

interface GetTimeSlotParams {
    professionalId: string,
    date: Date
}

export const getAvailabilities = ({ professionalId, date }: GetTimeSlotParams) => {
    const onlyDate = date.toISOString().split('T')[0]

    const fullDate = onlyDate + "T00:00:00.000Z"

    return db.availability.findMany({
        where: {
            professionalId: professionalId,
            date: fullDate
        }
    })
}