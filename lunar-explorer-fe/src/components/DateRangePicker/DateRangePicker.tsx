"use client";

import * as React from "react";
import { Button } from "@nextui-org/button";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { FaRegCalendarAlt } from "react-icons/fa";
import { addMonths, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "./Calendar";

type Props = {
  className?: string;
  defaultStartDate?: Date;
  defaultEndDate?: Date;
  onSelect: (date: DateRange | undefined) => void;
};

export function DateRangePicker({
  className,
  onSelect,
  defaultStartDate,
  defaultEndDate,
}: Props) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: defaultStartDate,
    to: defaultEndDate,
  });

  const handleSelect = (date: DateRange | undefined) => {
    setDate(date);
    onSelect(date);
  };

  return (
    <div className={`grid gap-2 ${className}`}>
      <Popover placement="bottom-start">
        <PopoverTrigger>
          <Button
            id="date"
            variant="bordered"
            className={`w-[300px] justify-start text-left font-normal ${
              !date && "text-muted-foreground"
            }`}
          >
            <FaRegCalendarAlt className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={{ before: new Date() }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
