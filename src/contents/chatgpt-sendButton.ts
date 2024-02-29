let currentCount: number = 0

const mutationCallback: MutationCallback = (
  mutationsList: MutationRecord[]
) => {
  console.log("Mutation observed")
  mutationsList.forEach((mutation: MutationRecord) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node: Node) => {
        if (
          node instanceof Element &&
          node.matches(".relative.flex.w-full.flex-col.agent-turn")
        ) {
          currentCount++
          console.log(`New send-button added. Current count: ${currentCount}`)
        }
      })
    }
  })
}

const elements = document.getElementById("__next")
const tartget = elements.querySelector(
  ".relative.z-0.flex.h-full.w-full.overflow-hidden"
)
const target2 = tartget.querySelector(
  ".relative.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden"
)
const target3 = target2.querySelector(".flex.h-full.flex-col")
const maxTarget = target3.querySelector(".flex-1.overflow-hidden")
const observer = new MutationObserver(mutationCallback)

const observeDOMChanges = (): void => {
  observer.observe(maxTarget, { childList: true, subtree: true })
  console.log("Observing DOM changes...")
}

observeDOMChanges()
