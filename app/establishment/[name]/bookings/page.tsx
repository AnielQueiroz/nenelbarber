import { getServerSession } from "next-auth"
import Header from "@/app/_components/header"
import { db } from "@/app/_lib/prisma"
import { authOptions } from "@/app/_lib/auth"
import SignInDialogClientWrapper from "@/app/_components/sign-in-wrapper"
import BookingItem from "@/app/_components/booking-item"

const Bookings = async () => {
  const session = await getServerSession(authOptions)
  let concludedBookings: any[] = []
  let confirmedBookings: any[] = []

  if (session && session.user) {
    confirmedBookings = await db.booking.findMany({
      where: {
        userId: (session?.user as any).id,
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

    concludedBookings = await db.booking.findMany({
      where: {
        userId: (session?.user as any).id,
        date: {
          lte: new Date(),
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

  return (
    <>
      <Header />
      <div className="space-y-3 p-5">
        {!session?.user && <SignInDialogClientWrapper />}

        {confirmedBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Confirmados
            </h2>
            {confirmedBookings.map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </>
        )}

        {concludedBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Finalizados
            </h2>
            {concludedBookings.map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </>
        )}
      </div>
    </>
  )
}

export default Bookings
