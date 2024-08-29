"use server"

import { endOfDay, startOfDay } from "date-fns"
import { db } from "../_lib/prisma"

interface GetBookingsProps {
    date: Date,
    professionalId: string
}

export const getBookings = ({ date, professionalId } : GetBookingsProps) => {
   return db.booking.findMany({
       where: {
           professionalId: professionalId,
           date: {
            lte: endOfDay(date),
            gte: startOfDay(date)
           }
       }
   })
}