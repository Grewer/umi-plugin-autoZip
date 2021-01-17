const path = require('path')
const fs = require('fs-extra')
const yazl = require('yazl')

interface IOptions {
  buildDir: string,
  name?: string
  showTime?: boolean
}

class AutoZip {
  private options: IOptions

  constructor(options: IOptions) {
    if (!options.buildDir) {
      console.warn(new Error('请输入build文件目录,例如 /build'))
      return
    }
    this.options = options
  }

  getInfoByDir(dir, former = '') {
    const files = fs.readdirSync(dir)
    let pathArray = []
    files.forEach(filename => {
      const fileDirName = path.join(dir, filename)

      const stats = fs.statSync(fileDirName)
      const isFile = stats.isFile()//是文件
      const isDir = stats.isDirectory()//是文件夹
      if (isFile) {
        if (filename.charAt(0) !== '.') {
          pathArray.push({ fileDirName, filename: former + filename })
        }
      }
      if (isDir) {
        const res = this.getInfoByDir(fileDirName, former + filename + '/')//递归，如果是文件夹，就继续遍历该文件夹下面的文件
        pathArray.push(...res)
      }

    })
    return pathArray
  }


  zip() {
    let files
    try {
      files = this.getInfoByDir(this.options.buildDir)
    } catch (e) {
      return console.warn('获取目录失败,打包失败!')
    }
    try {
      const zipFiles = new yazl.ZipFile()

      files.forEach(value => {
        zipFiles.addFile(value.fileDirName, value.filename)
      })

      let name = this.options.name || '压缩文件'

      if (this.options.showTime) {
        const date = new Date()
        name += `${date.getMonth() + 1}.${date.getDate()}-${date.getHours()}.${date.getMinutes()}`
      }

      zipFiles.outputStream.pipe(fs.createWriteStream(this.options.buildDir + name + '.zip')).on('close', () => {
        console.log('压缩完成', this.options.buildDir + name + '.zip')
      })
      zipFiles.end()
    } catch (e) {
      console.warn('压缩失败!')
    }
  }
}

export default AutoZip
