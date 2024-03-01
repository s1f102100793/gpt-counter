import { Storage } from "@plasmohq/storage"

const storage: Storage = new Storage()

export const config = {
  matches: ["https://chat.openai.com/*"],
  all_frames: true
}

let observer: MutationObserver | null = null

const countDefaultElements = (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const elements = document.querySelectorAll(
        ".relative.flex.w-full.flex-col.agent-turn"
      )
      resolve(elements.length)
    }, 1000)
  })
}

const observeDOMChanges = async (): Promise<void> => {
  const maxTarget = document.querySelector(".flex-1.overflow-hidden")
  if (maxTarget) {
    let currentCount = await countDefaultElements()

    const mutationCallback: MutationCallback = async () => {
      const updateCount = maxTarget.querySelectorAll(
        ".relative.flex.w-full.flex-col.agent-turn"
      ).length
      if (updateCount - currentCount === 1) {
        console.log("ここで保存")
        currentCount = updateCount
        const nowCount = (await storage.get("myCountKey")) as number
        console.log("nowCount", nowCount)
        await storage.set("myCountKey", nowCount + 1)
      }
    }

    if (observer) {
      observer.disconnect()
    }
    observer = new MutationObserver(mutationCallback)
    observer.observe(maxTarget, { childList: true, subtree: true })
    console.log("Observing DOM changes...")
  } else {
    console.log("Target element not found.")
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
