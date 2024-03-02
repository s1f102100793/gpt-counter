import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import React, { useEffect } from "react"

import { useStorage } from "@plasmohq/storage/hook"

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"],
  all_frames: true
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () => {
  const elements = document.querySelectorAll(
    ".relative.flex.w-full.flex-col.agent-turn"
  )
  const parentElements = Array.from(elements)
    .map((element) => element.parentElement)
    .filter((parent) => parent !== null)
  return parentElements[parentElements.length - 1] as Element
}

export const getShadowHostId = () => "gugure-anser"

const GugureCurrentStatus = () => {
  const [count] = useStorage("myCountKey")
  const n = 100 - count

  useEffect(() => {
    const allElements = document.querySelectorAll("#gugure-anser")

    if (allElements.length > 1) {
      for (let i = 0; i < allElements.length - 1; i++) {
        allElements[i].remove()
      }
    }
  }, [count])

  return (
    <div
      style={{ position: "relative", backgroundColor: "black", width: "100%" }}>
      <div style={{ position: "relative", width: "40rem" }}>
        <div style={{ color: "white" }}>gugure</div>
        <div style={{ color: "white" }}>残りの回数は{n}回です</div>
      </div>
    </div>
  )
}

export default GugureCurrentStatus
