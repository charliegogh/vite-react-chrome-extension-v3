chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.setOptions({
    tabId: tab.id,
    path: '/src/tabs/sidepanel.html'
  })
  chrome.sidePanel.open({
    tabId: tab.id
  })
  setTimeout(() => {
    // chrome.tabs.reload(tab.id, { bypassCache: true }, () => {
    // })
  }, 500)
})

