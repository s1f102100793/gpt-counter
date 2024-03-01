import { useStorage } from "@plasmohq/storage/hook";
import type { PlasmoCSConfig } from "plasmo";
import { useEffect } from "react";

export const config: PlasmoCSConfig = {
  matches: ['https://chat.openai.com/*'],
  all_frames: true,
}

const HidePromptTextarea = () => {
  const [count] = useStorage("myCountKey"); 

  useEffect(() => {
    const n = 100 - count;
    if (n <= 0) {
      const textarea = document.getElementById("prompt-textarea");
      if (textarea) {
        textarea.style.display = 'none';
      }
    }
  }, [count]); 

  return null;
}

export default HidePromptTextarea;
