import { headers } from 'next/headers';
import Header from "./_components/header";
import { db } from './_lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from './_lib/auth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';
import { MapPinIcon, StarIcon } from 'lucide-react';
import ServiceItem from './_components/service-item';
import PhoneItem from './_components/phone-item';

const HomePage = async () => { 
    const header = headers();
    const host = header.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const currentURL = `${protocol}://${host}`;

    const session = await getServerSession(authOptions);

    const url = new URL(currentURL);
    const subdomain = url.hostname.split('.')[0];

    const establishment = await db.barbershop.findUnique({
        where: { subdomain },
        include: { services: true }
    });

    if (!establishment) {
        return (
            <div>
                <Header />
                <div className="my-6 px-5">
                    <h1 className="text-2xl font-bold">Página não encontrada</h1>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="p-5">
                <h2 className="text-xl font-bold">
                    Olá, {session?.user?.name?.split(" ")[0] || "bem-vindo"}!
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

                <div className="mt-5 relative w-full h-[250px]">
                    <Image
                        src={establishment.imageUrl || "/fallback-image.jpg"}
                        fill
                        alt={establishment.name}
                        className="object-cover rounded-2xl"
                    />
                </div>

                {/* Seção de Informações do Estabelecimento */}
                <div className="py-5 border-b border-solid">
                    <h1 className="font-bold text-xl mb-3">{establishment.name}</h1>
                    <div className="mb-2 flex items-center gap-2">
                        <MapPinIcon className="text-primary" size={18} />
                        <p className="text-sm">{establishment.address}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <StarIcon className="fill-primary text-primary" size={18} />
                        <p className="text-sm">4.9 (10 avaliações)</p>
                    </div>
                </div>

                {/* Seção de Serviços */}
                <div className="my-5 space-y-3">
                    <h2 className="font-bold uppercase text-gray-400 text-xs">Serviços</h2>
                    <div className="space-y-3">
                        {establishment.services.map(service => (
                            <ServiceItem barbershop={establishment} service={service} key={service.id} />
                        ))}
                    </div>
                </div>

                {/* Seção de Contato */}
                <div className="pt-5 border-t border-solid space-y-3">
                    <h2 className="font-bold uppercase text-gray-400 text-xs">Contato</h2>
                    {establishment.phones.map(phone => (
                        <PhoneItem phone={phone} key={phone} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;