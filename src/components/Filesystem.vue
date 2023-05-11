<script setup lang="ts">
import { Filetype, type File, type OutputLine } from '@/Types'
import { inject } from 'vue'
import { shellOutputKey, shellInputKey } from '@/Keys'

const output = inject(shellOutputKey)!
const inputLine = inject(shellInputKey)!
const preamble: OutputLine = { type: 'preamble', content: '' }

let cwd: File = {
  type: Filetype.folder,
  content: [],
  name: '/'
}

function echo(line: string) {
  send({
    type: 'output',
    content: line
  })
  send(preamble)
}

function cd(args: Array<string>) {
  if (args.length > 1) {
    send({
      type: 'output',
      content: 'Too many args for cd command'
    })
    send(preamble)
    return
  }
  const input = args[0].trim()
  if (input == '..') {
    if (cwd.parent != undefined) {
      cwd = cwd.parent
    }
    return 0
  }
  if (input == '.') {
    return 0
  }

  if (input == '') {
    // TODO propagate to root
  }

  const path = input.split('/')
  let contents = cwd.content

  let pState = false
  let returnFolder: File | undefined = undefined

  for (var i = 0; i < path.length; i++) {
    let lState = false
    for (var j = 0; j < contents.length; j++) {
      if (contents[j].name == path[i]) {
        console.log(`found part ${contents[j].name} of path in index ${i}`)
        if (i == path.length - 1 && contents[j].type == Filetype.folder) {
          pState = true
          returnFolder = contents[j]
        } else {
          contents = contents[j].content
        }
        lState = true
        break
      }
    }
    if (!lState) {
      break
    }
  }
  if (returnFolder != undefined) {
    cwd = returnFolder
    let cdPreamble = {
      type: 'preamble',
      content: '',
      path: returnFolder.name
    }
    //TODO use fullpath here
    send(cdPreamble)
    console.log(output.value)
  } else {
    const error: OutputLine = {
      type: 'output',
      content: `cd: The directory '${args[0]}' does not exist`
    }
    send(error)
    send(preamble)
  }

  return 0
}

function mkdir(args: Array<string>) {
  //TODO recursive dir creation with -p
  //check if dir already exists
  let exists = existsFile(args[0])

  if (exists) {
    const error: OutputLine = {
      type: 'output',
      content: `mkdir: das Verzeichnis »${args[0]}“ kann nicht angelegt werden: Die Datei existiert bereits`
    }
    send(error)
    send(preamble)
    return
  }

  const file: File = {
    name: args[0],
    type: Filetype.folder,
    parent: cwd,
    content: []
  }
  cwd.content.push(file)
  send(preamble)

  return 0
}

function clear() {
  output.value.length = 0
  send(preamble)
  return 0
}

function test() {
  console.log('test expose')
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
    }
  }
}

function send(line: OutputLine) {
  output.value.push(line)
}

function existsFile(name: string) {
  for (var i = 0; i < cwd.content.length; i++) {
    if (cwd.content[i].name == name) {
      return true
    }
  }
  return false
}

defineExpose({
  handleInput
})
</script>

<template></template>
