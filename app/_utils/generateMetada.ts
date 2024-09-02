import { Metadata } from "next"
import { getEstablishment } from "../_actions/get-establishment"

export async function generateEstablishmentMetadata(
  subdomain: string,
): Promise<Metadata> {
  const establishment = await getEstablishment({ subdomain })

  if (!establishment) {
    return {
      title: "Gendapro - Estabelecimento não encontrado",
      description: "Estabelecimento não encontrado",
    }
  }

  return {
    title: `Gendapro - ${establishment.name}`,
    description: `Estabelecimento: ${establishment.name}`,
  }
}
