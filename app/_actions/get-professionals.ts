"use server"

import { endOfMonth } from "date-fns"
import { db } from "../_lib/prisma"

interface ProfessionalProps {
    barbershopId: string
    date: Date
}

export const getProfessionalAvailabilities = ({ barbershopId, date }: ProfessionalProps) => {
    const onlyDate = date.toISOString().split('T')[0]
    
    const fullDate = onlyDate + "T00:00:00.000Z"

    return db.professional.findMany({
        where: {
            barbershopId: barbershopId,
            availabilities: {
                some: {
                    date: fullDate
                }
            }
        },
        select: {
            id: true,
            name: true,
            availabilities: {
                where: {
                    date: fullDate
                },
                select: {
                    id: true,
                    date: true,
                    timesArray: true
                }
            }
        }
    })
}

export const getMonthAvailabilities = async ({ barbershopId }: { barbershopId: string } ) => {
    // Obter o ultimo dia do mes
    const today = new Date().toISOString().split('T')[0] + "T00:00:00.000Z"
    const endDate = endOfMonth(today).toISOString()
    console.log('today:', today, 'endDate:', endDate)

    const professionals = await db.professional.findMany({
        where: {
            barbershopId: barbershopId,
            availabilities: {
                some: {
                    date: {
                        gte: today, // gte = greater than or equal
                        lte: endDate // lte = less than or equal
                    }
                }
            }
        },
        include: {
            availabilities: {
                where: {
                    date: {
                        gte: today, // gte = greater than or equal
                        lte: endDate // lte = less than or equal
                    }
                }
            }
        }
    })

    // Extrair e retornar apenas as availabilities
    const availabilities = professionals.flatMap(professional => professional.availabilities);

    return availabilities;
}