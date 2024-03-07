import { Dictionary } from './Dictionary'

export class ZhDictionary extends Dictionary {
  static showAllWaifu ({ number }) { return `老婆列表 (${number})` }
  static helpUsAddMoreWaifu () { return '幫我們加入更多老婆 (暫時不可用)' }
  static tooManyWaifuSubmit () { return '抱歉，但你們的老婆實在太多LA \n我實在沒想到你們可以DD成這樣，畢竟我只單推 15，不會浠其他女人 \n\n目前正在努力將提交及審核流程更簡化，不然實在處理不完 \n功能完成後你可以再次回來提交' }
  static sourceRepoMessage () { return '原專案連結 (作者: @SoftwareSing)' }
  static frontendModifyRepoMessage () { return '前端修改專案連結 (作者: @Jun112561)' }
  static pictureSource () { return '圖片來源' }
  static audioSource () { return '聲音來源' }

  static copyPreviewLink () { return '複製預覽連結' }
  static onlyUrlCanShareWithLink () { return '*只有 URL 會跟著連結一起分享' }
  static file () { return '檔案' }
  static clipboard () { return '剪貼簿' }
  static clickToPostFile ({ fileType }) {
    fileType = transFileType(fileType)
    return `貼上剪貼簿的${fileType}檔案`
  }

  static postFileTypeUrl ({ fileType }) {
    fileType = transFileType(fileType)
    return `貼上${fileType}的 URL`
  }
}

function transFileType (fileType) {
  if (fileType === 'image') return '圖片'
  else if (fileType === 'audio') return '聲音'
  else return ` ${fileType} `
}
