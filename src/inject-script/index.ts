import { proxy } from 'ajax-hook'

console.warn('进入监控：')
console.warn('进入监控：')
proxy({
  // 请求发起前进入
  onRequest: (config, handler) => {
    handler.next(config)
  },
  // 请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
  onError: (err, handler) => {
    console.log(err.type)
    handler.next(err)
  },
  // 请求成功后进入
  onResponse: (response, handler) => {
    const { url } = response?.config || {}
    if (url.includes('/feed/stream')) {
      const rs = JSON.parse(response.response)
      console.log('streamData-------', rs.data.data)
      window.postMessage({ 'streamData': rs.data.data })
    }
    handler.next(response)
  }
})

