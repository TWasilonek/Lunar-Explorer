import { format } from "date-fns";

export const formatDateToDisplay = (date: Date): string => {
  return format(date, "dd-MM-yyyy");
};
