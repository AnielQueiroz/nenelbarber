import { Barbershop } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { StarIcon } from "lucide-react";
import Link from "next/link";

interface BarbershopItemProps {
    barbershop: Barbershop
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
    return <Card className="min-w-[167px] rounded-2xl">
        <CardContent className="p-0 px-1 pt-1">
            {/* IMAGEM */}
            <div className="relative h-[159px] w-full">
                <Image
                    src={barbershop.imageUrl}
                    fill
                    alt={barbershop.name}
                    className="object-cover rounded-2xl"
                />

                <Badge className="absolute left-2 top-2 space-x-1" variant="secondary">
                    <StarIcon size={12} className="fill-primary text-primary"/>
                    <p className="text-xs font-semibold">5.0</p>
                </Badge>
            </div>

            {/* INFORMACOES */}
            <div className="px-1 py-3">
                <h3 className="font-semibold truncate">{barbershop.name}</h3>
                <p className="text-sm text-gray-400 truncate">{barbershop.address}</p>
                <Button variant="secondary" className="w-full mt-2" asChild>
                    <Link href={`/barbershops/${barbershop.id}`}>
                        Agendar
                    </Link>
                </Button>
            </div>
        </CardContent>
    </Card>
}
 
export default BarbershopItem;