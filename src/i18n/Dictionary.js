export class Dictionary {
  static showAllWaifu ({ number }) { return `show all waifu (${number})` }
  static helpUsAddMoreWaifu () { return 'help us add more waifu (not available for now)' }
  static tooManyWaifuSubmit () { return 'Sorry, but it\'s too many waifu submit, totally beyond what I can handle. \nI\'m working hard to make submit and review process easier and fast, you will be able submit new waifu after that.' }
  static sourceRepoMessage () { return 'Source repo link (Author: @SoftwareSing)' }
  static frontendModifyRepoMessage () { return 'Frontend modify repo link (Author: @Jun112561)' }
  static pictureSource () { return 'picture source' }
  static audioSource () { return 'audio source' }

  static copyPreviewLink () { return 'copy preview link' }
  static onlyUrlCanShareWithLink () { return '*only URL can share with link' }
  static file () { return 'File' }
  static clipboard () { return 'Clipboard' }
  static clickToPostFile ({ fileType }) {
    return `click to post ${fileType} file`
  }

  static postFileTypeUrl ({ fileType }) {
    return `post ${fileType} URL`
  }
}
