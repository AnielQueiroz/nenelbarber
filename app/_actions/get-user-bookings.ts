"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"

interface GetUserBookingsProps {
  userId: string
  domain: string
  uuid: string
}

export const getUserBookings = async ({
  userId,
  domain,
  uuid,
}: GetUserBookingsProps) => {
  if (!userId) return []

  const userBookings = await db.booking.findMany({
    where: {
      userId: userId,
      date: {
        gte: new Date(), // Filtrar bookings futuros
      },
      service: {
        barbershop: {
          id: uuid, // Filtrando pela UUID da barbershop
        },
      },
    },
    include: {
      service: {
        include: {
          barbershop: true, // Incluir informações da barbershop associada
        },
      },
    },
    orderBy: {
      date: "asc", // Ordenar pelos bookings mais próximos
    },
  })

  revalidatePath(`/establishment/${domain}`)
  revalidatePath(`/establishment/${domain}/bookings`)

  return userBookings
}
