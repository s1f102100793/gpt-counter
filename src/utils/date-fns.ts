import { isBefore, parseISO, startOfMonth } from "date-fns"

import { getCountData } from "./dailyCount"

export const findOldestDataMonth = async () => {
  const allCounts = await getCountData()
  let oldestDate = new Date()

  Object.keys(allCounts).forEach((dateStr) => {
    const date = parseISO(dateStr)
    if (isBefore(date, oldestDate)) {
      oldestDate = date
    }
  })

  return startOfMonth(oldestDate)
}
