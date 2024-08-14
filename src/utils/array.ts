
const deWeightThree = (arr:any, tag:any):any => {
  const map = new Map()
  for (const item of arr) {
    if (!map.has(item[tag])) {
      map.set(item[tag], item)
    }
  }
  return [...map.values()]
}

export {
  deWeightThree
}
