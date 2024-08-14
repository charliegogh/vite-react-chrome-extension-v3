//
// class CrxCache {
//   setItem(key, value) {
//     if (chrome.storage) {
//       chrome.storage.local.set({ [key]: value }).then(() => {
//       })
//     }
//   }
//   getItem(key) {
//     return new Promise((resolve) => {
//       chrome.storage.local.get(key).then((rs) => {
//         resolve(rs[key])
//       })
//     })
//   }
//
//   async remove(key) {
//     await chrome.storage.local.remove(key)
//   }
// }
// const crxLocalCache = new CrxCache()
// export default crxLocalCache
