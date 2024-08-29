import PhoneItem from "@/app/_components/phone-item";
import ServiceItem from "@/app/_components/service-item";
import SidebarSheet from "@/app/_components/sidebar-sheet";
import { Button } from "@/app/_components/ui/button";
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet";
import { db } from "@/app/_lib/prisma";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BarbershopPageProps {
    params: {
        id: string
    }
}

const BarbershopPage = async ({params}: BarbershopPageProps) => {
    // Chamar banco de dados
    const barbershop = await db.barbershop.findUnique({
        where: {
            id: params.id
        },
        include: {
            services: true
        }
    })

    if (!barbershop) {
        return notFound()
    }

    return <div>
        {/* IMAGEM */}
        <div className="relative w-full h-[250px]">
            <Image src={barbershop?.imageUrl} fill className="object-cover" alt={barbershop?.name}/>

            <Button size="icon" variant="secondary" className="absolute left-4 top-4" asChild>
                <Link href="/">
                    <ChevronLeftIcon />
                </Link>
            </Button>

            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="absolute right-4 top-4">
                        <MenuIcon />
                    </Button>
                </SheetTrigger>
                
                <SidebarSheet />
            </Sheet>
        </div>

        {/* INFORMACOES */}
        <div className="p-5 border-b border-solid">
            <h1 className="font-bold text-xl mb-3">{barbershop?.name}</h1>
            <div className="mb-2 flex item-center gap-2">
                <MapPinIcon className="text-primary" size={18}/>
                <p className="text-sm">{barbershop?.address}</p>
            </div>

            <div className="flex item-center gap-2">
                <StarIcon className="fill-primary text-primary" size={18}/>
                <p className="text-sm">4.9 (10 avaliações)</p>
            </div>
        </div>

        {/* DESCRICAO */}
        <div className="p-5 border-b border-solid space-y-2">
            <h2 className="font-bold uppercase text-gray-400 text-xs">Sobre nós</h2>
            <p className="text-sm text-justify">{barbershop?.description}</p>
        </div>

        {/* SERVICOS */}
        <div className="p-5 border-b border-solid space-y-3">
            <h2 className="font-bold uppercase text-gray-400 text-xs">Serviços</h2>
            <div className="space-y-3">
                {barbershop.services.map(service => <ServiceItem barbershop={barbershop} service={service} key={service.id} />)}
            </div>
        </div>

        {/* CONTATO */}
        <div className="p-5 space-y-3">
            <h2 className="font-bold uppercase text-gray-400 text-xs">Contato</h2>
            {barbershop.phones.map(phone => (
                <PhoneItem phone={phone} key={phone} />
            ))}
        </div>
    </div>;
}
 
export default BarbershopPage;