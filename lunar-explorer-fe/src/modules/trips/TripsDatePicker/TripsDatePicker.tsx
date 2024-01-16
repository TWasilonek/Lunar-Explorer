"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { paths } from "@/paths";
import { DateRange, DateRangePicker } from "@/components/DateRangePicker";

type Props = {
  defaultStartDate?: Date;
  defaultEndDate?: Date;
};

export const TripsDatePicker = ({
  defaultStartDate,
  defaultEndDate,
}: Props) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(defaultStartDate);
  const [toDate, setToDate] = useState<Date | undefined>(defaultEndDate);
  const router = useRouter();

  useEffect(() => {
    if (fromDate && toDate) {
      router.push(
        paths.tripsList(
          format(fromDate, "yyyy-MM-dd"),
          format(toDate, "yyyy-MM-dd")
        )
      );
    }
  }, [fromDate, toDate, router]);

  const handleDateSelect = (date: DateRange | undefined) => {
    if (!date || !date.from || !date.to) return;
    if (date.from) setFromDate(date.from);
    if (date.to) setToDate(date.to);
  };

  return (
    <DateRangePicker
      className="mb-8"
      onSelect={handleDateSelect}
      defaultStartDate={fromDate}
      defaultEndDate={toDate}
    />
  );
};
