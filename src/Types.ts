export interface OutputLine {
  type: string
  content: string
  path?: string
}

export class File {
  type: Filetype
  content: File[] = []
  name: string
  parent?: File
  text?: string
  last: number
  constructor(type: Filetype, name: string, last: number, parent?: File, text?: string) {
    this.type = type
    this.name = name
    this.parent = parent
    this.last = last
    this.text = text
  }

  getAbsolutePath() {
    const parts: string[] = []
    parts.push(this.name)
    while (this.parent != undefined) {
      parts.push(this.parent.name)
      this.parent = this.parent.parent
    }
    return parts.reverse().join('/').substring(1)
  }

  getRoot(): File {
    if (this.parent == undefined) {
      return this
    }
    return this.parent.getRoot()
  }
}

export type Filetype = 'FILE' | 'FOLDER'

export interface FileExist {
  exist: boolean
  file?: File
}
