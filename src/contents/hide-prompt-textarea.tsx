import { useStorage } from "@plasmohq/storage/hook";
import { useEffect } from "react";

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
