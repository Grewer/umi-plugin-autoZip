const path = require('path')
const fs = require('fs-extra')
const yazl = require('yazl')

class AutoZip {
  private options: {
    dirName: string,
    buildName: string,
    name?: string
    showTime?: boolean
  }

  constructor(options) {
    if (!options.dirName) {
      console.warn(new Error('请输入根目录,例如 __dirname + \'/..\''))
      return
    }
    if (!options.buildName) {
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
    const buildPath = this.options.dirName + this.options.buildName
    let files
    try {
      files = this.getInfoByDir(buildPath)
    } catch (e) {
      return console.warn('获取目录失败,打包失败!')
    }
    try {

      const zipfile = new yazl.ZipFile()

      files.forEach(value => {
        zipfile.addFile(value.fileDirName, value.filename)
      })

      let name = this.options.name || '压缩文件'

      if (this.options.showTime) {
        const date = new Date()
        name += `${date.getMonth() + 1}.${date.getDate()}-${date.getHours()}.${date.getMinutes()}`
      }

      zipfile.outputStream.pipe(fs.createWriteStream(buildPath + '/' + name + '.zip')).on('close', function () {
        console.log('压缩完成')
      })
      zipfile.end()
    } catch (e) {
      console.warn('压缩失败!')
    }
  }
}

export default AutoZip
