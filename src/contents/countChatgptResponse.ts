import type { PlasmoCSConfig } from "plasmo"
import { updateResponseDailyCount } from "src/utils/count/responseCount"
import {
  gptModelClassName,
  gptResponseClassName,
  gptResponseParentElements
} from "src/utils/elements"

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"],
  all_frames: true
}

let observer: MutationObserver | null = null

const countDefaultElements = (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const gptResponseElements =
        document.querySelectorAll(gptResponseClassName)
      resolve(gptResponseElements.length)
    }, 1000)
  })
}

const observeDOMChanges = async (): Promise<void> => {
  if (gptResponseParentElements) {
    let currentCount = await countDefaultElements()
    const mutationCallback: MutationCallback = async () => {
      const gptResponseElements =
        document.querySelectorAll(gptResponseClassName)
      const updateCount = gptResponseElements.length

      if (updateCount - currentCount === 1) {
        currentCount = updateCount
        const gptModel = document.querySelector(gptModelClassName)?.textContent
        if (gptModel === undefined || gptModel === null) {
          console.error("GPT model not found.")
        } else {
          console.log("GPTResponseが1回増えました")
          await updateResponseDailyCount(gptModel)
        }
      }
    }

    if (observer) {
      observer.disconnect()
    }

    observer = new MutationObserver(mutationCallback)
    observer.observe(gptResponseParentElements, {
      childList: true,
      subtree: true
    })
  } else {
    console.error("Target element not found.")
  }
}

const stopObserving = () => {
  if (observer) {
    observer.disconnect()
  }
}

document.addEventListener("click", function (event) {
  const target = event.target as HTMLAnchorElement
  const anchor = target.closest("a")

  if (anchor && anchor.href) {
    stopObserving()
    observeDOMChanges()
  }
})

observeDOMChanges()
