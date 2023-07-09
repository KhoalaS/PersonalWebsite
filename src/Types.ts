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
  constructor(type: Filetype, name: string, last: number,parent?: File, text?: string) {
    this.type = type
    this.name = name
    this.parent = parent
    this.last = last
    this.text = text
  }

  getAbsolutePath() {
    let _parent = this.parent
    const parts: string[] = new Array()
    parts.push(this.name)
    while (_parent != undefined) {
      parts.push(_parent.name)
      _parent = _parent.parent
    }
    return parts.reverse().join('/').substring(1)
  }

  getRoot(): File {
    let _parent = this.parent
    if (_parent == undefined) {
      return this
    }
    return _parent.getRoot()
  }
}

export enum Filetype {
  file = 'FILE',
  folder = 'FOLDER'
}

export interface FileExist {
  exist: boolean
  file?: File
}
