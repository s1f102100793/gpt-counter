import type { PlasmoCSConfig } from "plasmo"
import { codeCount } from "src/utils/count/codeCount"
import {
  codeResponseClassName,
  gptModelClassName,
  gptResponseClassName,
  gptResponseParentElements
} from "src/utils/elements"

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"],
  all_frames: true
}
let countCodeResponseObserver: MutationObserver | null = null

const countCodeResponseElements = async (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const gptResponseElements =
        document.querySelectorAll(gptResponseClassName)
      let count = 0
      gptResponseElements.forEach((elem) => {
        if (elem.querySelector(codeResponseClassName)) {
          count++
        }
      })
      resolve(count)
    }, 3000)
  })
}

const observeDOMChanges = async (): Promise<void> => {
  if (gptResponseParentElements) {
    let codeCurrentCount = await countCodeResponseElements()
    const mutationCallback: MutationCallback = async () => {
      const updateCount = await countCodeResponseElements()

      if (updateCount - codeCurrentCount === 1) {
        codeCurrentCount = updateCount
        const gptModel = document.querySelector(gptModelClassName)?.textContent
        if (gptModel === undefined || gptModel === null) {
          console.error("GPT model not found.")
        } else {
          console.log(`CodeResponseが1回増えました`)
          await codeCount.updateDaily(gptModel)
        }
      }
    }

    if (countCodeResponseObserver) {
      countCodeResponseObserver.disconnect()
    }

    countCodeResponseObserver = new MutationObserver(mutationCallback)
    countCodeResponseObserver.observe(gptResponseParentElements, {
      childList: true,
      subtree: true
    })
  } else {
    console.error("Target element not found.")
  }
}

const stopObserving = () => {
  if (countCodeResponseObserver) {
    countCodeResponseObserver.disconnect()
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
