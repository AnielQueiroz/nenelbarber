"use server"

import { db } from "../_lib/prisma"

interface EstablishmentProps {
    subdomain: string
}

export const getEstablishment = async ({ subdomain }: EstablishmentProps) => {
    const establishment = await db.barbershop.findUnique({
        where: {
            subdomain
        },
        include: {
            services: true
        }
    })
    return establishment
}