type EventCallback = (event: any) => void;
const getCurrentTab = async() => {
  const queryOptions = { active: true, currentWindow: true }
  const [tab] = await chrome.tabs.query(queryOptions)
  return tab
}
const eventBus = {
  emit(event:string, params:any):void {
    chrome.runtime.sendMessage({ action: event, options: params })
  },
  async emitContentScript(event:string, params:any):void {
    const tab = await getCurrentTab()
    chrome.tabs.sendMessage(tab.id!, { action: event, options: params })
  },
  on(event:string, callback:EventCallback) {
    if (!chrome.runtime) {
      return
    }
    chrome.runtime.onMessage.addListener(
      (event) => {
        callback(event)
      })
  }
}

export default eventBus
