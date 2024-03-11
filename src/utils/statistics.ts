import {
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  format,
  isAfter,
  startOfMonth
} from "date-fns"

import { getCountData } from "./dailyCount"

const calculateStatisticsForMonth = (
  allCounts: Record<string, Record<string, number>>,
  startOfMonth: Date,
  endOfMonth: Date
) => {
  let totalQuestions = 0
  let daysWithQuestions = 0

  Object.entries(allCounts).forEach(([dateStr, counts]) => {
    const date = new Date(dateStr)
    if (date >= startOfMonth && date <= endOfMonth) {
      const dailyTotal = Object.values(counts).reduce(
        (acc, count) => acc + count,
        0
      )
      totalQuestions += dailyTotal
      if (dailyTotal > 0) {
        daysWithQuestions++
      }
    }
  })

  const averageQuestionsPerActiveDay =
    daysWithQuestions > 0 ? totalQuestions / daysWithQuestions : 0

  return { totalQuestions, averageQuestionsPerActiveDay }
}

export const calculateMonthlyStatistics = (
  allCounts: Record<string, Record<string, number>>,
  targetMonth: Date
) => {
  const startOfTargetMonth = startOfMonth(targetMonth)
  const endOfTargetMonth = endOfMonth(targetMonth)
  const startOfLastMonth = startOfMonth(
    new Date(targetMonth.getFullYear(), targetMonth.getMonth() - 1)
  )
  const endOfLastMonth = endOfMonth(startOfLastMonth)

  const targetMonthStats = calculateStatisticsForMonth(
    allCounts,
    startOfTargetMonth,
    endOfTargetMonth
  )
  const lastMonthStats = calculateStatisticsForMonth(
    allCounts,
    startOfLastMonth,
    endOfLastMonth
  )

  const ratioToPreviousMonth =
    lastMonthStats.totalQuestions > 0
      ? (targetMonthStats.totalQuestions / lastMonthStats.totalQuestions) * 100
      : 0

  return {
    totalQuestions: targetMonthStats.totalQuestions,
    averageQuestionsPerActiveDay: targetMonthStats.averageQuestionsPerActiveDay,
    ratioToPreviousMonth
  }
}

export const updateChartData = async (date: Date) => {
  const allCounts = await getCountData()
  const today = new Date()
  const endOfToday = endOfDay(today)
  const startDate = startOfMonth(date)
  const endDate = endOfMonth(date)
  const eachDay = eachDayOfInterval({ start: startDate, end: endDate })
  const labels = eachDay.map((day) => format(day, "yyyy-MM-dd"))
  const model3Data = labels.map((date) =>
    isAfter(new Date(date), endOfToday) ? null : allCounts[date]?.["3.5"] || 0
  )
  const model4Data = labels.map((date) =>
    isAfter(new Date(date), endOfToday) ? null : allCounts[date]?.["4"] || 0
  )

  return {
    labels,
    datasets: [
      {
        label: "Model 3.5",
        data: model3Data,
        borderColor: "rgb(24, 195, 125)",
        backgroundColor: "rgba(24, 195, 125, 0.5)",
        tension: 0.3,
        stack: "1",
        fill: "origin"
      },
      {
        label: "Model 4",
        data: model4Data,
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        stack: "1",
        tension: 0.3,
        fill: "-1"
      }
    ]
  }
}
