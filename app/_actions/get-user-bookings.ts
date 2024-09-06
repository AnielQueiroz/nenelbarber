"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"

interface GetUserBookingsProps {
  userId: string
  domain: string
  uuid: string
  status: string
}

export const getUserBookings = async ({
  userId,
  domain,
  uuid,
  status,
}: GetUserBookingsProps) => {
  if (!userId || !uuid) return []

  let date

  if (status === "concluded") {
    date = {
      lte: new Date(),
    }
  } else if (status === "confirmed") {
    date = {
      gte: new Date(),
    }
  }

  const userBookings = await db.booking.findMany({
    where: {
      userId: userId,
      date: date,
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
