export type GptModel = "3.5" | "4"

export const isGptModel = (
  value: string | null | undefined
): value is GptModel => {
  return value === "3.5" || value === "4"
}
