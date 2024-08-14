declare global {
    interface Window {
        XLSX: any;
        init: () => void;
    }
}
export default function xlsxLoader(): Promise<typeof window.XLSX> {
  return new Promise((resolve, reject) => {
    if (window.XLSX) {
      resolve(window.XLSX)
    } else {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = false
      script.src = '/src/tabs/xlsx.full.min.js?callback=init'
      document.head.appendChild(script)

      script.onload = () => {
        resolve(window.XLSX)
      }

      script.onerror = reject
    }

    window.init = function() {
      resolve(window.XLSX)
    }
  })
}
