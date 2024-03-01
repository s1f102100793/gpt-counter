export const config = {
  matches: ["https://chat.openai.com/*"],
  all_frames: true
}

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

const searchElementForClass = (node: Node): number => {
  let count = 0
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element
    if (element.matches(".relative.flex.w-full.flex-col.agent-turn")) {
      count = 1
    }
    element.childNodes.forEach((childNode) => {
      count += searchElementForClass(childNode)
    })
  }
  return count
}

let currentCount = 0

const observeDOMChanges = async (): Promise<void> => {
  const maxTarget = document.querySelector(".flex-1.overflow-hidden")
  if (maxTarget) {
    currentCount = await countDefaultElements()

    const mutationCallback: MutationCallback = (
      mutationsList: MutationRecord[]
    ) => {
      mutationsList.forEach((mutation: MutationRecord) => {
        if (mutation.type === "childList") {
          let addedCount = 0
          mutation.addedNodes.forEach((node: Node) => {
            addedCount += searchElementForClass(node)
          })

          if (addedCount > 0) {
            console.log("Added nodes:", addedCount)
          }
        }
      })
    }

    const observer = new MutationObserver(mutationCallback)
    observer.observe(maxTarget, { childList: true, subtree: true })
    console.log("Observing DOM changes...")
  } else {
    console.log("Target element not found.")
  }
}

observeDOMChanges()
