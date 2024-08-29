import { getServerSession } from "next-auth";
import Header from "../_components/header";
import { db } from "../_lib/prisma";
import { authOptions } from "../_lib/auth";
import SignInDialogClientWrapper from "../_components/sign-in-wrapper";
import BookingItem from "../_components/booking-item";

const Bookings = async () => {
    const session = await getServerSession(authOptions)
    let concludedBookings: any[] = []
    let confirmedBookings: any[] = []
  
    if (session && session.user) {
        confirmedBookings = await db.booking.findMany({
            where: {
                userId: (session?.user as any).id,
                date: {
                    gte: new Date()
                }
            },
            include: {
                service: {
                    include: {
                        barbershop: true
                    }
                }
            },
            orderBy: {
                date: "asc"
            }
        })    

        concludedBookings = await db.booking.findMany({
            where: {
                userId: (session?.user as any).id,
                date: {
                    lte: new Date()
                }
            },
            include: {
                service: {
                    include: {
                        barbershop: true
                    }
                }
            },
            orderBy: {
                date: "asc"
            }
        })    
    }

    console.log(session)

    return (
        <>
            <Header />
            <div className="p-5 space-y-3">
                {!session?.user && (
                    <SignInDialogClientWrapper />
                )}
                <h1 className="text-xl font-bold">Agendamentos</h1>
                
                {confirmedBookings.length > 0 && (
                    <>
                        <h2 className="mt-6 mb-3 uppercase text-xs font-bold text-gray-400">Confirmados</h2>
                        {confirmedBookings.map((booking) => (
                            <BookingItem key={booking.id} booking={booking} />
                        ))}
                    </>
                )}

                {concludedBookings.length > 0 && (
                    <>
                        <h2 className="mt-6 mb-3 uppercase text-xs font-bold text-gray-400">Finalizados</h2>
                        {concludedBookings.map((booking) => (
                            <BookingItem key={booking.id} booking={booking} />
                        ))}
                    </>
                )}
            </div>
        </>
    );
}
 
export default Bookings;