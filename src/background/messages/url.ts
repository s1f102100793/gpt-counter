const targetUrl = "https://chat.openai.com/c/"

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url !== undefined) {
    if (changeInfo.url.startsWith(targetUrl)) {
      chrome.tabs.sendMessage(tabId, {
        name: "url",
        body: { url: changeInfo.url }
      })
    }
  }
})
