export const config = {
  matches: ["https://chat.openai.com/*"],
  all_frames: true
}

const getElementsAfterDelay = (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const elements = document.querySelectorAll(
        ".relative.flex.w-full.flex-col.agent-turn"
      )
      resolve(elements.length)
    }, 1000)
  })
}

let currentCount: number = 0

const mutationCallback: MutationCallback = (
  mutationsList: MutationRecord[]
) => {
  mutationsList.forEach((mutation: MutationRecord) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node: Node) => {
        searchForClass(node)
      })
    }
  })
}

const searchForClass = (node: Node): number => {
  let count = 0
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element
    if (element.matches(".relative.flex.w-full.flex-col.agent-turn")) {
      count = 1
    }
    element.childNodes.forEach((childNode) => {
      count += searchForClass(childNode)
    })
  }
  return count
}

const observer = new MutationObserver(mutationCallback)

const observeDOMChanges = async (): Promise<void> => {
  const maxTarget = document.querySelector(".flex-1.overflow-hidden")
  if (maxTarget) {
    const initialCount = await getElementsAfterDelay()
    currentCount = initialCount
    observer.observe(maxTarget, { childList: true, subtree: true })
    console.log("Observing DOM changes...")
  } else {
    console.log("Target element not found.")
  }
}

observeDOMChanges()
