import './index.scss'
import eventBus from '~/eventBus'
import crxCache from '~/utils/cache'

if (import.meta.env.MODE === 'production') {
  try {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', chrome?.runtime.getURL('.vite/manifest.json'), false) // 第三个参数为 false 表示同步请求
    xhr.send(null)

    if (xhr.status === 200) {
      const manifest = JSON.parse(xhr.responseText)
      const jsPath = manifest['src/inject-script/index.ts'].file // 从 manifest.json 中获取打包后的路径
      const tmp = document.createElement('script')
      tmp.src = chrome?.runtime.getURL(jsPath)
      tmp.setAttribute('type', 'module')
      document.head.appendChild(tmp)
    } else {
      console.error('Error loading manifest: ', xhr.status)
    }
  } catch (error) {
    console.error('Error loading manifest:', error)
  }
}

if (import.meta.env.MODE === 'development') {
  const jsPath = 'src/inject-script/index.ts.js' // 从 manifest.json 中获取打包后的路径
  const tmp = document.createElement('script')
  tmp.src = chrome?.runtime.getURL(jsPath)
  tmp.setAttribute('type', 'module')
  document.head.appendChild(tmp)
}
window.addEventListener('message', e => {
  if (e.data.streamData) {
    crxCache.setItem('liblib_cache', e.data.streamData)
    eventBus.emit('liblib_cache', e.data.streamData)
  }
  if (e.data.handleView) {
    console.log(e.data.handleView)
  }
})
eventBus.on('handleView', (record) => {
  console.log(record)
})
