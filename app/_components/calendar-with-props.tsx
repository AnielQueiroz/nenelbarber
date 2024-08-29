import { Calendar } from "./ui/calendar";
import { ptBR } from "date-fns/locale";
import { isSameDay } from "date-fns";

interface Availability {
  date: Date;
}

interface CalendarWithAvailabilityProps {
  availabilities: Availability[];
  selectedDay: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

const CalendarWithAvailability = ({
  availabilities,
  selectedDay,
  onSelect,
}: CalendarWithAvailabilityProps) => {
  const isDateAvailable = (date: Date) => {
    return availabilities.some((availability) =>
      isSameDay(availability.date, date)
    );
  };

  return (
    <Calendar
      mode="single"
      locale={ptBR}
      selected={selectedDay}
      onSelect={onSelect}
      fromDate={new Date()}
      disabled={(date) => !isDateAvailable(date)}  // Desabilita as datas sem disponibilidade
      styles={{
        head_cell: { textTransform: "capitalize" },
        cell: { width: "100%" },
        button: { width: "100%" },
        nav_button_previous: { width: "32px", height: "32px" },
        nav_button_next: { width: "32px", height: "32px" },
        caption: { textTransform: "capitalize" },
      }}
    />
  );
};

export default CalendarWithAvailability;
