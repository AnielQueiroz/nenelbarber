import { format } from "date-fns";
import { Card, CardContent } from "./ui/card";
import { ptBR } from "date-fns/locale";
import { Decimal } from "@prisma/client/runtime/library";

interface Professional {
    id: string
    name: string
}

interface Barbershop {
    name: string
}

interface Service {
    name: string
    price: Decimal
}

interface BookingSummeryProps {
    professionals: Professional[]
    service: Service
    selectedDay: Date
    selectedTime: string
    barbershop: Barbershop
    selectedProfessional: string
}

const BookingSummery = ({professionals, service, selectedDay, selectedProfessional, selectedTime, barbershop} : BookingSummeryProps ) => {
    return (
        <Card>
            <CardContent className="space-y-3 p-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold">{service.name}</h2>
                    <p className="text-sm font-bold">
                        {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        }).format(Number(service.price))}
                    </p>
                </div>
                
                <div className="flex items-center justify-between">
                    <h2 className="text-sm text-gray-400">Data</h2>
                    <p className="text-sm">
                        {format(selectedDay, "d 'de' MMMM", {
                        locale: ptBR,
                        })}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <h2 className="text-sm text-gray-400">Horário</h2>
                    <p className="text-sm">{selectedTime}</p>
                </div>

                <div className="flex items-center justify-between">
                    <h2 className="text-sm text-gray-400">
                        Profissional
                    </h2>
                    <p className="text-sm">
                        {professionals.find((professional) => professional.id === selectedProfessional)?.name}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <h2 className="text-sm text-gray-400">Local</h2>
                    <p className="text-sm">{barbershop.name}</p>
                </div>
            </CardContent>
        </Card>
    );
}
 
export default BookingSummery;