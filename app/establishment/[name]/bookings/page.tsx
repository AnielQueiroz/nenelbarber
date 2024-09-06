import { getServerSession } from "next-auth"
import Header from "@/app/_components/header"
import { db } from "@/app/_lib/prisma"
import { authOptions } from "@/app/_lib/auth"
import SignInDialogClientWrapper from "@/app/_components/sign-in-wrapper"
import BookingItem from "@/app/_components/booking-item"
import { getEstablishment } from "@/app/_actions/get-establishment"
import { notFound } from "next/navigation"
import { getUserBookings } from "@/app/_actions/get-user-bookings"

type Props = {
  params: {
    name: string
  }
}

const Bookings = async ({ params }: Props) => {
  const establishment = await getEstablishment({ subdomain: params.name })

  if (!establishment) return notFound()

  const session = await getServerSession(authOptions)

  let concludedBookings: any[] = []
  let confirmedBookings: any[] = []

  if (session && session.user) {
    confirmedBookings = await getUserBookings({
      userId: (session?.user as any)?.id,
      domain: params.name,
      uuid: establishment.id,
      status: "confirmed",
    })

    concludedBookings = await getUserBookings({
      userId: (session?.user as any)?.id,
      domain: params.name,
      uuid: establishment.id,
      status: "concluded",
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
