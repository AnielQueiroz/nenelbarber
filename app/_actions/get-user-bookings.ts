"use server"

import { db } from "../_lib/prisma"

interface GetUserBookingsProps {
  userId: string
}

export const getUserBookings = ({ userId }: GetUserBookingsProps) => {
  return db.booking.findMany({
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
}
