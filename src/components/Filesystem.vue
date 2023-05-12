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

let cwd = new File(Filetype.folder, '/')

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

  const file = new File(Filetype.folder, args[0], cwd)
  cwd.content.push(file)
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

  if (width != undefined) {
    console.log(width.value)
  }
  const contents = cwd.content
  let output = ''
  contents.forEach((file) => {
    output += file.name

    //TODO actually compute output based on window width
    if (file.type == Filetype.folder) {
      output += '/'
    }
    send({ type: 'output', content: output })
  })
  sendPreamble()
}

// TODO support absolute paths [checking if first char is '/']
function find(input: string, start: File): FileExist {
  if (input.length == 0) {
    return { exist: true, file: start }
  }
  const path = input.split('/')
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
  const options: Array<string> = []
  const folders: Array<string> = []

  if (args.length == 0) {
    return { options, folders }
  }

  for (var i = 0; i < args.length; i++) {
    if (args[i][0] == '-') {
      options.push(args[i])
    } else {
      folders.push(args[i])
    }
  }

  return { options, folders }
}

defineExpose({
  handleInput
})
</script>

<template></template>
