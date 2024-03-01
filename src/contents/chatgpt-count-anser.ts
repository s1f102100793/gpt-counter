import { get } from "http"

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
  // console.log(node)
  let count = 0
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element
    // console.log("Element: ", element)
    if (element.matches(".relative.flex.w-full.flex-col.agent-turn")) {
      count = 1
    }
    element.childNodes.forEach((childNode) => {
      count += searchForClass(childNode)
    })
  }
  return count
}

const countClassOccurrencesInContainer = (maxTarget: Element): number => {
  const htmlContent = maxTarget.innerHTML
  // 検索するクラス文字列
  const searchString = 'class="relative flex w-full flex-col agent-turn"'
  // 正規表現を使って検索し、マッチした回数をカウント
  const regex = new RegExp(searchString, "g")
  const matches = htmlContent.match(regex)
  const count = matches ? matches.length : 0
  console.log(
    `Occurrences of the specified class within the container: ${count}`
  )
  return count
}

const observer = new MutationObserver(mutationCallback)

const observeDOMChanges = (): void => {
  const maxTarget = document.querySelector(".flex-1.overflow-hidden")
  if (maxTarget) {
    const initialCount = countClassOccurrencesInContainer(maxTarget) // 初期カウントを実行して結果を取得
    currentCount = initialCount // 初期カウントの結果をcurrentCountに格納
    console.log(`Initial count of elements: ${initialCount}`) // 初期カウントの結果をログに出力
    observer.observe(maxTarget, { childList: true, subtree: true })
    console.log("Observing DOM changes...")
  } else {
    console.log("Target element not found.")
  }
}

observeDOMChanges()

const getElementsAfterDelay = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const elements = document.querySelectorAll(
        ".relative.flex.w-full.flex-col.agent-turn"
      )
      resolve(elements.length)
    }, 1000)
  })
}

getElementsAfterDelay()
