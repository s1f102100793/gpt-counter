const targetUrl = "https://chat.openai.com/c/"

const urlMessageName = "url"

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url !== undefined) {
    if (changeInfo.url.startsWith(targetUrl)) {
      chrome.tabs.sendMessage(tabId, {
        name: urlMessageName,
        body: { url: changeInfo.url }
      })
    }
  }
})
