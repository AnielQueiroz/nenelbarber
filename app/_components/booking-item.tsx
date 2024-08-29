"use client"

import { Prisma } from "@prisma/client";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import Image from "next/image";
import PhoneItem from "./phone-item";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { deleteBooking } from "../_actions/delete-booking";
import { toast } from "sonner";
import { useState } from "react";

// TODO: Receber agendamento como prop
interface BookingItemProps {
    booking: Prisma.BookingGetPayload<{
        include: {
            service: {
                include: {
                    barbershop: true
                }
            }
        }
    }>
}

const BookingItem = ( { booking }: BookingItemProps ) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [isCancelDialogOpen, setisCancelDialogOpen] = useState(false)
    const handleSheetOpenChange = (isOpen: boolean) => {
        setIsSheetOpen(isOpen)
    }

    const handleCancelDialogOpenChange = (isOpen: boolean) => {
        setisCancelDialogOpen(isOpen)
    }

    const isConfirmed = isFuture(booking.date)
    const { service: {barbershop} } = booking

    const handleCancelBooking = async () => {
        try {
            await deleteBooking(booking.id)
            toast.success('Agendamento cancelado com sucesso!')
            setIsSheetOpen(false)
        } catch (error) {
            console.error(error)
            toast.error('Erro ao cancelar agendamento!')
        }
    }

    return ( 
        <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
            <SheetTrigger className="w-full">
                <Card className="min-w-[90%]">
                    <CardContent className="flex justify-between p-0">
                        {/* ESQUERDA */}
                        <div className="flex flex-col gap-2 py-5 pl-5">
                            <Badge className="w-fit" variant={isConfirmed ? "default" : "secondary"}>{isConfirmed ? "Confirmado" : "Finalizado"}</Badge>
                            <h3 className="font-semibold p-0">{booking.service.name}</h3>

                            <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                    <AvatarImage src={barbershop.imageUrl} />
                                </Avatar>
                                <p className="text-sm">{barbershop.name}</p>
                            </div>
                        </div>

                        {/* DIREITA */}
                        <div className="flex flex-col items-center justify-center px-5 border-l-2 border-solid">
                            <p className="text-sm capitalize">{format(booking.date, 'MMMM', { locale: ptBR })}</p>
                            <p className="text-2xl">{format(booking.date, 'dd')}</p>
                            <p className="text-sm">{format(booking.date, 'HH:mm')}</p>
                        </div>
                    </CardContent>
                </Card>     
            </SheetTrigger>
            <SheetContent className="w-[85%]">
                <SheetHeader>
                    <SheetTitle className="text-left">Detalhes</SheetTitle>
                </SheetHeader>

                <div className="relative mt-6 flex h-[180px] w-full items-end">
                    <Image src="/map.png" fill className="object-cover rounded-xl" alt="Mapa do estabelecimento"/>

                    <Card className="z-50 mb-3 mx-5 w-full rounded-xl">
                        <CardContent className="flex gap-3 px-5 py-3">
                            <Avatar>
                                <AvatarImage src={barbershop.imageUrl} />
                            </Avatar>

                            <div>
                                <h3 className="font-bold">{barbershop.name}</h3>
                                <p className="text-xs">{barbershop.address}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6">
                    <Badge className="w-fit" variant={isConfirmed ? "default" : "secondary"}>{isConfirmed ? "Confirmado" : "Finalizado"}</Badge>

                    <Card className="mb-6 mt-3">
                        <CardContent className="space-y-3 p-3">
                            <div className="flex justify-between items-center">
                                <h2 className="font-bold">{booking.service.name}</h2>
                                <p className="text-sm font-bold">
                                    {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(booking.service.price))}
                                </p>
                            </div>
                            <div className="flex justify-between items-center">
                                <h2 className="text-sm text-gray-400">Data</h2>
                                <p className="text-sm">
                                    {format(booking.date, "d 'de' MMMM", { locale: ptBR })}
                                </p>
                            </div>
                            <div className="flex justify-between items-center">
                                <h2 className="text-sm text-gray-400">Horário</h2>
                                <p className="text-sm">
                                    {format(booking.date, "HH:mm")}
                                </p>
                            </div>
                            <div className="flex justify-between items-center">
                                <h2 className="text-sm text-gray-400">Local</h2>
                                <p className="text-sm">
                                    {barbershop.name}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-3">
                        {barbershop.phones.map(phone => <PhoneItem key={phone} phone={phone} />)}
                    </div>
                </div>

                <SheetFooter className="mt-6">
                    <div className="flex items-center gap-3">
                        <SheetClose asChild>
                            <Button className="w-full" variant="secondary">Voltar</Button>
                        </SheetClose>

                        {isConfirmed && (
                            <Dialog open={isCancelDialogOpen} onOpenChange={handleCancelDialogOpenChange}>
                                <DialogTrigger className="w-full">
                                    <Button className="w-full" variant="destructive">Cancelar reserva</Button>
                                </DialogTrigger>
                                <DialogContent className="w-[90%]">
                                    <DialogHeader>
                                        <DialogTitle>Tem certeza que deseja cancelar?</DialogTitle>
                                        <DialogDescription>
                                            Ao confirmar, você perderá seu agendamento e essa ação não poderá ser desfeita.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="flex flex-row gap-3">
                                        <DialogClose asChild>
                                            <Button variant="secondary" className="w-full">Voltar</Button>
                                        </DialogClose>
                                        <Button variant="destructive" className="w-full" onClick={handleCancelBooking}>Sim, quero cancelar</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>   
    );
}
 
export default BookingItem;