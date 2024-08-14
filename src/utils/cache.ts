
class CrxCache {
  async setItem(key:string, value:any) {
    const existingCache = await this.getItem(key) || []
    // @ts-ignore
    await chrome.storage.local.set({ [key]: [...existingCache, ...value] }).then(() => {})
  }
  getItem(key:string) {
    return new Promise((resolve) => {
      chrome.storage?.local?.get(key).then((rs) => {
        resolve(rs[key])
      })
    })
  }
  async remove(key:string) {
    await chrome.storage.local.remove([key])
  }
}

const crxCache = new CrxCache()

export default crxCache
