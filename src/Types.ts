export interface OutputLine {
  type: string
  content: string
  path?: string
}


export interface File {
  type: Filetype
  content: Array<File>
  name: string
  parent?: File
}

export enum Filetype {
  file = 'FILE',
  folder = 'FOLDER'
}

export interface FileExist {
  exist: boolean
  file?: File
}
