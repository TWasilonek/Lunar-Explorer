import { format } from "date-fns";

export const formatCalendarDate = (date: Date): string => {
  return format(date, "dd-MM-yyyy");
};

export const formatCalendarDateWithTime = (date: Date): string => {
  return format(date, "dd-MM-yyyy HH:mm");
};
