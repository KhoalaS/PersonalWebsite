<script setup lang="ts">
import { Filetype, type OutputLine, type FileExist, File } from '@/Types'
import { inject } from 'vue'
import { shellOutputKey, shellInputKey, shellWidthKey } from '@/Keys'

const props = defineProps({
  user: {
    type: String,
    required: true
  }
})

const output = inject(shellOutputKey)!
const inputLine = inject(shellInputKey)!
const preamble: OutputLine = { type: 'preamble', content: '' }
const fontSize = 1.25
const width = inject(shellWidthKey)

let cwd = new File(Filetype.folder, '/', Date.now())

function echo(line: string) {
  send({
    type: 'output',
    content: line.substring(5)
  })
  sendPreamble()
}

// TODO add autocomplete
function cd(args: Array<string>) {
  if (args.length > 1) {
    send({
      type: 'output',
      content: 'Too many args for cd command'
    })
    sendPreamble()
    return
  }
  if (args.length == 0) {
    const root = cwd.getRoot()
    cwd = root
    sendPreamble()
    return
  }

  const input = args[0].trim()
  const fileExists = find(input, cwd)

  if (fileExists.exist) {
    cwd = fileExists.file!
  } else {
    const error: OutputLine = {
      type: 'output',
      content: `cd: The directory '${args[0]}' does not exist`
    }
    send(error)
  }
  sendPreamble()

  return 0
}

function mkdir(args: Array<string>) {
  //TODO recursive dir creation with -p
  //check if dir already exists
  let fileExists = find(args[0], cwd)

  if (fileExists.exist) {
    const error: OutputLine = {
      type: 'output',
      content: `mkdir: das Verzeichnis »${args[0]}“ kann nicht angelegt werden: Die Datei existiert bereits`
    }
    send(error)
    sendPreamble()
    return
  }

  recCreateFolder(args[0], cwd)
  sendPreamble()
  return 0
}

function clear() {
  output.value.length = 0
  sendPreamble()
  return 0
}

// TODO add args
function ls(args: Array<string>) {
  const parsedArgs = parseArgs(args)
  const long = parsedArgs.options.includes('l')

  if (width != undefined) {
    console.log(width.value)
  }
  if (parsedArgs.folders.length == 0) {
    const contents = cwd.content
    contents.forEach((file) => {
      if (long) {
        let extra = ''
        if (file.type == Filetype.folder) {
          extra += 'dwxrwxr-x'
        } else {
          extra += '-rw-rw-r--'
        }
        extra += ` ${props.user} ${props.user} ${
          file.type == Filetype.folder ? '4096' : String(file.text!.length + 1)
        } lastmodified ${file.type == Filetype.folder ? file.name + '/' : file.name}`
        send({ type: 'output', content: extra })
      } else {
        send({
          type: 'output',
          content: file.type == Filetype.folder ? file.name + '/' : file.name
        })
      }
    })
  } else {
    const errors: Array<string> = []
    const found: Array<{ name: string; content: File[] }> = []
    parsedArgs.folders.forEach((elem) => {
      const fileExists = find(elem, cwd)
      if (fileExists.exist) {
        const contents: Array<File> = []
        fileExists.file!.content.forEach((item) => {
          contents.push(item)
        })
        found.push({ name: elem, content: contents })
      } else {
        errors.push(elem)
      }
    })
    errors.forEach((file) => {
      send({
        type: 'error',
        content: `ls: Zugriff auf '${file}' nicht möglich: Datei oder Verzeichnis nicht gefunden`
      })
    })
    console.log(parsedArgs)

    found.forEach((elem) => {
      if (!(parsedArgs.folders.length == 1 && errors.length == 0)) {
        send({ type: 'output', content: elem.name + ':' })
      }
      elem.content.forEach((file) => {
        if (long) {
          let extra = ''
          if (file.type == Filetype.folder) {
            extra += 'dwxrwxr-x'
          } else {
            extra += '-rw-rw-r--'
          }
          extra += ` ${props.user} ${props.user} ${
            file.type == Filetype.folder ? '4096' : String(file.text!.length + 1)
          } lastmodified ${file.type == Filetype.folder ? file.name + '/' : file.name}`
          send({ type: 'output', content: extra })
        } else {
          send({ type: 'output', content: file.name })
        }
      })
      if (!(parsedArgs.folders.length == 1 && errors.length == 0)) {
        send({ type: 'output', content: '' })
      }
    })
  }
  sendPreamble()
}

// TODO support absolute paths [checking if first char is '/']
function find(input: string, start: File): FileExist {
  if (input.length == 0) {
    return { exist: true, file: start }
  }
  const path = input.split('/')
  if (input[0] == '/') {
    return find(input.substring(1), start.getRoot())
  }

  if (path[0] == '.') {
    path.splice(0, 1)
    return find(path.join('/'), start)
  }
  if (path[0] == '..') {
    if (start.parent != undefined) {
      path.splice(0, 1)
      return find(path.join('/'), start.parent)
    } else {
      return { exist: false }
    }
  }
  const file = path[0]
  let fileObj = null
  for (var i = 0; i < start.content.length; i++) {
    if (start.content[i].name == file) {
      fileObj = start.content[i]
      console.log(`found part ${file}`)
    }
  }
  if (fileObj == null) {
    return { exist: false }
  } else {
    path.splice(0, 1)
    return find(path.join('/'), fileObj)
  }
}

function test(args: Array<string>) {
  const ret = find(args[0], cwd)
  console.log(ret)
}

function handleInput(line: string) {
  if (output != undefined && inputLine != undefined) {
    const args = line.split(' ')
    switch (args[0]) {
      case 'clear':
        clear()
        break
      case 'mkdir':
        args.splice(0, 1)
        mkdir(args)
        console.log(cwd)
        break
      case 'cd':
        args.splice(0, 1)
        cd(args)
        break
      case '':
        sendPreamble()
        break
      case 'ls':
        args.splice(0, 1)
        ls(args)
        break
      case 'echo':
        echo(line)
        break
      case 'test':
        args.splice(0, 1)
        test(args)
        sendPreamble()

        break
    }
  }
}

function send(line: OutputLine) {
  output.value.push(line)
}

// TODO  get full path
function sendPreamble() {
  if (cwd.name != '/') {
    let _preamble = {
      type: 'preamble',
      content: '',
      path: cwd.getAbsolutePath()
    }
    send(_preamble)
  } else {
    send(preamble)
  }
}

function parseArgs(args: Array<string>) {
  const rawOptions: Array<string> = []
  const folders: Array<string> = []
  const options: Array<string> = []

  if (args.length == 0) {
    return { options: rawOptions, folders }
  }

  for (var i = 0; i < args.length; i++) {
    if (args[i][0] == '-') {
      rawOptions.push(args[i])
    } else {
      folders.push(args[i])
    }
  }
  rawOptions.forEach((elem) => {
    if (elem.substring(1).length > 1) {
      for (let c of elem) {
        options.push(c)
      }
    } else {
      options.push(elem.substring(1))
    }
  })

  return { options, folders }
}

function recCreateFolder(input: string, start: File): number {
  if (input.length == 0) {
    return 0
  }
  const path = input.split('/')
  if (input[0] == '/') {
    return recCreateFolder(input.substring(1), start.getRoot())
  }
  if (path[0] == '.') {
    path.splice(0, 1)
    return recCreateFolder(path.join('/'), start)
  }
  if (path[0] == '..') {
    path.splice(0, 1)
    return recCreateFolder(path.join('/'), start.parent!)
  }
  const folder = new File(Filetype.folder, path[0], Date.now(), start)
  start.content.push(folder)
  path.splice(0, 1)
  return recCreateFolder(path.join('/'), folder)
}

function formatTimestamp(unixtime: number) {}

defineExpose({
  handleInput
})
</script>

<template></template>
