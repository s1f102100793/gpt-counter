chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url !== undefined) {
    chrome.tabs.sendMessage(tabId, {
      name: "url",
      body: { url: changeInfo.url }
    })
  }
})
