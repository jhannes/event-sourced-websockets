import { useMemo } from "react";
import { format, isToday } from "date-fns";

export function useDateFormat(dateLike?: Date) {
  if (!dateLike) {
    return { asDate: undefined, asTime: undefined, formatted: undefined };
  }
  const date = useMemo(() => new Date(dateLike), [dateLike]);
  const asDate = useMemo(() => format(date, "P"), [dateLike]);
  const asTime = useMemo(() => format(date, "pp"), [dateLike]);
  const formatted = useMemo(() => {
    return isToday(date) ? asTime : asDate;
  }, [date, asDate, asTime]);
  return { asDate, asTime, formatted };
}
