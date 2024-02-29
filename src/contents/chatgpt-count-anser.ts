let currentCount: number = 0;

const mutationCallback: MutationCallback = (mutationsList: MutationRecord[]) => {
  mutationsList.forEach((mutation: MutationRecord) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node: Node) => {
        console.log(node)
        searchForClass(node);
      });
    }
  });
};

const searchForClass = (node: Node) => {
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    if (element.matches(".relative.flex.w-full.flex-col.agent-turn")) {
      currentCount++;
      console.log(`Element with specified class added. Current count: ${currentCount}`);
    }
    element.childNodes.forEach(searchForClass);
  }
};

const observer = new MutationObserver(mutationCallback);

const observeDOMChanges = (): void => {
  const maxTarget = document.querySelector(".flex-1.overflow-hidden"); 
  if (maxTarget) {
    observer.observe(maxTarget, { childList: true, subtree: true });
    console.log("Observing DOM changes...");
  } else {
    console.log("Target element not found.");
  }
};

observeDOMChanges();
