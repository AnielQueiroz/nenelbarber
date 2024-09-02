import Header from "@/app/_components/header"
import PhoneItem from "@/app/_components/phone-item"
import ServiceItem from "@/app/_components/service-item"
import { authOptions } from "@/app/_lib/auth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { MapPinIcon, StarIcon } from "lucide-react"
import { getServerSession } from "next-auth"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getEstablishment } from "@/app/_actions/get-establishment"
import { generateEstablishmentMetadata } from "@/app/_utils/generateMetada"

type Props = {
  params: {
    name: string
  }
}

export async function generateMetadata({ params }: Props) {
  return generateEstablishmentMetadata(params.name)
}

const Establishment = async ({ params }: any) => {
  const establishment = await getEstablishment({ subdomain: params.name })

  if (!establishment) return notFound()

  const session = await getServerSession(authOptions)

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

        <div className="relative mt-5 h-[250px] w-full">
          <Image
            src={establishment.imageUrl || "/fallback-image.jpg"}
            fill
            alt={establishment.name}
            className="rounded-2xl object-cover"
          />
        </div>
      </div>

      {/* INFORMACOES */}
      <div className="border-b border-solid p-5">
        <h1 className="mb-3 text-xl font-bold">{establishment.name}</h1>
        <div className="item-center mb-2 flex gap-2">
          <MapPinIcon className="text-primary" size={18} />
          <p className="text-sm">{establishment.address}</p>
        </div>

        <div className="item-center flex gap-2">
          <StarIcon className="fill-primary text-primary" size={18} />
          <p className="text-sm">4.9 (10 avaliações)</p>
        </div>
      </div>

      {/* DESCRICAO */}
      <div className="space-y-2 border-b border-solid p-5">
        <h2 className="text-xs font-bold uppercase text-gray-400">Sobre nós</h2>
        <p className="text-justify text-sm">{establishment.description}</p>
      </div>

      {/* SERVICOS */}
      <div className="space-y-3 border-b border-solid p-5">
        <h2 className="text-xs font-bold uppercase text-gray-400">Serviços</h2>
        <div className="space-y-3">
          {establishment.services.map((service) => (
            <ServiceItem
              barbershop={establishment}
              service={service}
              key={service.id}
            />
          ))}
        </div>
      </div>

      {/* CONTATO */}
      <div className="space-y-3 p-5">
        <h2 className="text-xs font-bold uppercase text-gray-400">Contato</h2>
        {establishment.phones.map((phone) => (
          <PhoneItem phone={phone} key={phone} />
        ))}
      </div>
    </div>
  )
}

export default Establishment
