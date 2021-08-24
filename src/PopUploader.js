import { send } from './HttpSend'
import { getStorage, setStorage } from './Storage'
import { uploadPopLimit, intervalUploadPopTime } from './config'

const unuploadedKey = 'unuploadedPopMap'

function getMap () {
  return getStorage(unuploadedKey) || {}
}
function setMap (map) {
  return setStorage(unuploadedKey, map)
}

export function addUnuploaded (waifuId, addNum) {
  const map = getMap()
  if (!Number.isSafeInteger(map[waifuId]) || map[waifuId] < 0) map[waifuId] = 0
  map[waifuId] += addNum
  setMap(map)
}

function uploadPop () {
  const map = getMap()
  const waifuPopObj = {}
  let total = 0
  for (const [waifuId, popCount] of Object.entries(map)) {
    if (total + popCount < uploadPopLimit) {
      total += popCount
      waifuPopObj[waifuId] = popCount
    } else {
      const uploadCount = uploadPopLimit - total
      waifuPopObj[waifuId] = uploadCount
      total = uploadPopLimit
      break
    }
  }
  if (Object.keys(waifuPopObj).length < 1) return

  for (const [waifuId, uploadCount] of Object.entries(waifuPopObj)) {
    map[waifuId] -= uploadCount
    if (map[waifuId] < 1) delete map[waifuId]
  }
  setMap(map)

  return send('POST', '/api/v1/pop/record', { waifuPopObj })
}

async function intervalUploadPop () {
  await uploadPop()
  setTimeout(intervalUploadPop, intervalUploadPopTime)
}
setTimeout(intervalUploadPop, 5000)
