import Header from "./_components/header";
import { Button } from "./_components/ui/button";
import Image from "next/image";
import { db } from "./_lib/prisma";
import BarbershopItem from "./_components/barbershop-item"
import { quickSearchOptions } from "./_constants/search";
import BookingItem from "./_components/booking-item";
import Search from "./_components/search";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./_lib/auth";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

const HomePage = async () => {    
    const session = await getServerSession(authOptions);

    const barbershops = await db.barbershop.findMany({});
    const popularBarbershops = await db.barbershop.findMany({
        orderBy: {
            name: "desc"
        }
    });

    const bookings = session?.user ? await db.booking.findMany({
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
    }) : [];

    return (
        <div>
            <Header />
            <div className="p-5">
                {/* TEXTO */}
                <h2 className="text-xl font-bold">
                    Olá, {session?.user?.name?.split(" ")?.slice(0, 1).join(" ") || "bem vindo"}!
                </h2>
                <p>
                    <span className="capitalize">
                        {format(new Date(), "cccc, dd", { locale: ptBR })}
                    </span>
                    <span>&nbsp;de&nbsp;</span>
                    <span className="capitalize">
                        {format(new Date(), "MMMM", { locale: ptBR })}
                    </span>
                </p>

                {/* INPUT E BOTÃO DE PESQUISA */}
                <div className="mt-6">
                    <Search />
                </div>

                {/* BUSCA RAPIDA */}
                <div className="flex gap-3 mt-6 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
                    {quickSearchOptions.map((option) => (
                        <Button 
                            key={option.title}
                            variant="secondary"
                            className="gap-2"
                            asChild
                        >
                            <Link href={`/barbershops?service=${option.title}`}>
                                <Image
                                    src={option.imageUrl}
                                    width={16}
                                    height={16}
                                    alt={option.title}
                                />
                                {option.title}
                            </Link>
                        </Button>
                    ))}
                </div>

                {/* BANNER DE DESTAQUE */}
                <div className="relative mt-6 w-full h-[150px]">
                    <Image src={"/banner-01.png"} fill alt="Agende nos melhores" className="rounded-xl object-cover"/>
                </div>

                {/* AGENDAMENTOS */}
                {bookings.length > 0 && (
                    <h2 className="mt-6 mb-3 uppercase text-xs font-bold text-gray-400">Agendamentos</h2>
                )}
                <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    {bookings.map((booking) => (
                        <BookingItem key={booking.id} booking={booking} />
                    ))}
                </div>

                <h2 className="mt-6 mb-3 uppercase text-xs font-bold text-gray-400">Recomendados</h2>
                <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
                    {barbershops.map((barbershop) => (
                        <BarbershopItem key={barbershop.id} barbershop={barbershop} />
                    ))}
                </div>

                <h2 className="mt-6 mb-3 uppercase text-xs font-bold text-gray-400">Populares</h2>
                <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
                    {popularBarbershops.map((barbershop) => (
                        <BarbershopItem key={barbershop.id} barbershop={barbershop} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;