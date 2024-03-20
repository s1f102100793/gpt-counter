import { isBefore, parseISO, startOfMonth } from "date-fns"

import { responseCount } from "./count/responseCount"

export const findOldestDataMonth = async () => {
  const allCounts = await responseCount.getAll()
  let oldestDate = new Date()

  Object.keys(allCounts).forEach((dateStr) => {
    const date = parseISO(dateStr)
    if (isBefore(date, oldestDate)) {
      oldestDate = date
    }
  })

  return startOfMonth(oldestDate)
}
