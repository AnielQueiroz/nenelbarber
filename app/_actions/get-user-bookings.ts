"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"

interface GetUserBookingsProps {
  userId: string
  domain: string
}

export const getUserBookings = async ({
  userId,
  domain,
}: GetUserBookingsProps) => {
  await db.booking.findMany({
    where: {
      userId: userId,
      date: {
        gte: new Date(),
      },
    },
    include: {
      service: {
        include: {
          barbershop: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  revalidatePath(`/establishment/${domain}`)
  revalidatePath(`/establishment/${domain}/bookings`)
}
