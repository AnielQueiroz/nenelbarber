"use client"

import {
  Barbershop,
  BarbershopService,
  Booking,
} from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useEffect, useMemo, useState } from "react"
import { isPast, isToday, set } from "date-fns"
import { createBooking } from "../_actions/create-booking"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent } from "./ui/dialog"
import SignInDialog from "./sign-in-dialog"
import { getProfessionalAvailabilities } from "../_actions/get-professionals"
import { getAvailabilities } from "../_actions/get-time-slot"
import { getBookings } from "../_actions/get-bookings"
import BookingSummery from "./booking-summery"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name" | "id">
}

interface GetTimeListProps {
  bookings: Booking[]
  selectedDay: Date
  timeSlots: string[]
}

// Definindo a interface para as disponibilidades
interface Availability {
    date: Date;
    id: string;
    timesArray: string[];
}

// Definindo a interface para os profissionais disponíveis
interface AvailableProfessional {
    id: string;
    name: string;
    availabilities: Availability[];
}

const getTimeList = ({
  bookings,
  selectedDay,
  timeSlots,
}: GetTimeListProps) => {
  return timeSlots.filter((time) => {
    const [hour, minute] = time.split(":").map(Number)
    const dateTime = set(new Date(), { hours: hour, minutes: minute })

    return (
      !(isPast(dateTime) && isToday(selectedDay)) &&
      !bookings.some(
        (booking) =>
          booking.date.getHours() === hour &&
          booking.date.getMinutes() === minute,
      )
    )
  })
}

// Função para formatar data para YYYY-MM-DD
// const formatDate = (date: Date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
// };

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const { data } = useSession()
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)
  const [professionals, setProfessionals] = useState<AvailableProfessional[]>([])
  const [selectedProfessional, setSelectedProfessional] = useState<string | undefined>(undefined)
  const [timeSlots, setTimeSlots] = useState<string[]>([])

  const handleSelectProfessional = async (professionalId: string) => {
    setSelectedProfessional(professionalId)

    if (!selectedDay) return

    const availabilities = await getAvailabilities({
      professionalId,
      date: selectedDay,
    })
    setTimeSlots(availabilities[0]?.timesArray || [])
  }

  useEffect(() => {
    const fetch = async () => {
      if (!selectedDay) return
      const availableProfessionals = await getProfessionalAvailabilities({
        barbershopId: barbershop.id,
        date: selectedDay,
      });
      setProfessionals(availableProfessionals)

      if (selectedProfessional) {
        const bookings = await getBookings({
          date: selectedDay,
          professionalId: selectedProfessional,
        })
        setDayBookings(bookings)
      }
    }
    fetch()
  }, [selectedDay, barbershop.id, selectedProfessional])

  const handleBookingClick = () => {
    if (data?.user) {
      return setBookingSheetIsOpen(true)
    }

    return setSignInDialogIsOpen(true)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
    setTimeSlots([])
    setSelectedTime(undefined)
    setSelectedProfessional(undefined)
  }

  const handleTimeSelect = (time: string | undefined) => {
    setSelectedTime(time)
  }

  const handleCreateBooking = async () => {
    try {
      if (!selectedProfessional || !selectedDay || !selectedTime) return

      const hour = Number(selectedTime.split(":")[0])
      const minute = Number(selectedTime.split(":")[1])
      const newDate = set(selectedDay, {
        minutes: minute,
        hours: hour,
      })

      await createBooking({
        serviceId: service.id,
        date: newDate,
        professionalId: selectedProfessional,
      })

      handleBookingSheetOpenChange()
      toast.success("Agendado com sucesso!")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao agendar!")
    }
  }

  const handleBookingSheetOpenChange = () => {
    setSelectedDay(undefined)
    setSelectedTime(undefined)
    setDayBookings([])
    setBookingSheetIsOpen(false)
  }

  const timeList = useMemo(() => {
    if (!selectedDay) return []

    return getTimeList({
      bookings: dayBookings,
      selectedDay,
      timeSlots,
    })
  }, [dayBookings, selectedDay, timeSlots])

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3 p-3">
          {/* IMAGEM */}
          <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              fill
              className="rounded-lg object-cover"
              alt={service.name}
            />
          </div>
          {/* DIREITA */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>

            {/* PREÇO E BOTAO */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>

              <Sheet
                open={bookingSheetIsOpen}
                onOpenChange={handleBookingSheetOpenChange}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBookingClick}
                >
                  Agendar
                </Button>

                <SheetContent className="overflow-y-auto px-0">
                  <SheetHeader>
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="border-b border-solid py-5">
                    <Calendar
                      mode="single"
                      locale={ptBR}
                      selected={selectedDay}
                      onSelect={handleDateSelect}
                      fromDate={new Date()}
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: {
                          width: "100%",
                        },
                        button: {
                          width: "100%",
                        },
                        nav_button_previous: {
                          width: "32px",
                          height: "32px",
                        },
                        nav_button_next: {
                          width: "32px",
                          height: "32px",
                        },
                        caption: {
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </div>

                  {selectedDay && (
                    <div className="flex gap-3 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
                        {professionals.length > 0 ? (
                            professionals.map((professional) => (
                                <Button
                                key={professional.id}
                                variant={
                                    selectedProfessional === professional.id
                                    ? "default"
                                    : "outline"
                                }
                                className="rounded-full"
                                onClick={() =>
                                    handleSelectProfessional(professional.id)
                                }
                                >
                                {professional.name}
                                </Button>
                            ))
                        ) : (
                            <p className="text-xs">Nenhum profissional disponível</p>
                        )}
                    </div>
                  )}

                  {selectedProfessional && (
                    <div className="flex gap-3 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
                        {timeList.length > 0 ? (
                            timeList.map((time) => (
                                <Button
                                    key={time}
                                    variant={
                                        selectedTime === time ? "default" : "outline"
                                    }
                                    className="rounded-full"
                                    onClick={() => handleTimeSelect(time)}
                                    >
                                    {time}
                                </Button>
                            ))
                        ) : (
                            <p className="text-xs">Nenhum horário disponível</p>
                        )}
             
                    </div>             
                  )}

                  {selectedProfessional && selectedTime && selectedDay && (
                    <div className="p-5">
                        <BookingSummery 
                          barbershop={barbershop}
                          service={service} 
                          professionals={professionals}
                          selectedDay={selectedDay} 
                          selectedTime={selectedTime}
                          selectedProfessional={selectedProfessional}
                        />
                    </div>
                  )}

                  <SheetFooter className="p-5">
                    <SheetClose asChild>
                      <Button
                        onClick={handleCreateBooking}
                        size="sm"
                        disabled={
                          !selectedProfessional || !selectedTime || !selectedDay
                        }
                      >
                        Confirmar
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={signInDialogIsOpen}
        onOpenChange={(open) => setSignInDialogIsOpen(open)}
      >
        <DialogContent className="w-[90%]">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServiceItem
