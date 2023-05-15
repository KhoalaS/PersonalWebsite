<script setup lang="ts">
import { Filetype, type OutputLine, type FileExist, File } from '@/Types'
import { inject } from 'vue'
import { shellOutputKey, shellInputKey, shellWidthKey } from '@/Keys'
import { formatTimestamp } from '@/DateLib'
import catMock from '@/mockScripts/cat.json'

const props = defineProps({
  user: {
    type: String,
    required: true
  }
})

const std = {
  in: ['0'],
  out: ['1'],
  err: ['2']
}

const output = inject(shellOutputKey)!
const inputLine = inject(shellInputKey)!

const width = inject(shellWidthKey)

let cwd = new File(Filetype.folder, '/', Date.now())

initFs(cwd)

function initFs(start: File) {
  const bin = new File(Filetype.folder, 'bin', Date.now(), start)
  const catScript = new File(Filetype.file, 'cat', Date.now(), bin, catMock.script.join('\n'))
  bin.content.push(catScript)
  cwd.content.push(bin)
}

function echo(line: string) {
  return send('output', line)
}

// TODO add autocomplete
function cd(args: string[]) {
  let output = null
  if (args.length > 1) {
    return send('output', 'Too many args for cd command')
  }
  if (args.length == 0) {
    const root = cwd.getRoot()
    cwd = root
    return output
  }

  const input = args[0].trim()
  const fileExists = find(input, cwd)

  if (fileExists.exist) {
    if (fileExists.file!.type == Filetype.file) {
      return send('error', `cd: '${input}' is not a directory`)
    } else {
      cwd = fileExists.file!
    }
  } else {
    return send('error', `cd: The directory '${args[0]}' does not exist`)
  }

  return output
}

function mkdir(args: string[]) {
  const parsedArgs = parseArgs(args)
  const p = parsedArgs.options.includes('p')
  let output: OutputLine | null = null

  parsedArgs.folders.forEach((elem) => {
    let fileExists = find(elem, cwd)

    if (fileExists.exist) {
      return send(
        'error',
        `mkdir: das Verzeichnis »${elem}“ kann nicht angelegt werden: Die Datei existiert bereits`
      )
    } else if (p) {
      const exit = recCreateFolder(elem, cwd, true)
    } else {
      const exit = recCreateFolder(elem, cwd, false)
      if (exit == -1) {
        return send(
          'error',
          `mkdir: das Verzeichnis »${elem}“ kann nicht angelegt werden: Datei oder Verzeichnis nicht gefunden`
        )
      }
    }
  })

  return output
}

function clear() {
  output.value.length = 0
  return 0
}

function ls(args: string[]) {
  let output = null
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
          extra += 'drwxrwxr-x'
        } else {
          extra += '-rw-rw-r--'
        }
        extra += ` ${props.user} ${props.user} ${
          file.type == Filetype.folder ? '4096' : String(file.text!.length + 1)
        } ${formatTimestamp(file.last)} ${
          file.type == Filetype.folder ? file.name + '/' : file.name
        }`
        return send('output', extra)
      } else {
        return send('output', file.type == Filetype.folder ? file.name + '/' : file.name)
      }
    })
  } else {
    const errors: string[] = []
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
      return send(
        'error',
        `ls: Zugriff auf '${file}' nicht möglich: Datei oder Verzeichnis nicht gefunden`
      )
    })

    //TODO get the largest filesize for proper formatting with -l
    found.forEach((elem) => {
      if (!(parsedArgs.folders.length == 1 && errors.length == 0)) {
        output = send('output', elem.name + ':')
      }
      elem.content.forEach((file) => {
        if (long) {
          let extra = ''
          if (file.type == Filetype.folder) {
            extra += 'drwxrwxr-x'
          } else {
            extra += '-rw-rw-r--'
          }
          extra += ` ${props.user} ${props.user} ${
            file.type == Filetype.folder ? '4096' : String(file.text!.length + 1)
          } ${formatTimestamp(file.last)} ${
            file.type == Filetype.folder ? file.name + '/' : file.name
          }`
          return send('output', extra)
        } else {
          return send('output', file.name)
        }
      })
      if (!(parsedArgs.folders.length == 1 && errors.length == 0)) {
        return send('output', '')
      }
    })
  }
  return output
}

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

function test(args: string[]) {
  const ret = find(args[0], cwd)
  console.log(ret)
}

function handleInput(line: string) {
  if (output != undefined && inputLine != undefined) {
    // TODO properly grab redirects
    let redirects = line.split('>')
    const mainArg = redirects.splice(0, 1)[0].trim()

    const args = mainArg.split(' ')
    const command = args.splice(0, 1)[0]
    let output: OutputLine | null = null

    if (redirects.length > 0) {
      redirects = redirects.map((elem) => elem.trim())
      std.out = redirects
    }

    switch (command) {
      case 'clear':
        clear()
        break
      case 'mkdir':
        output = mkdir(args)
        break
      case 'cd':
        output = cd(args)
        break
      case '':
        break
      case 'ls':
        output = ls(args)
        break
      case 'echo':
        output = echo(args.join(' '))
        break
      case 'touch':
        output = touch(args)
        break
      case 'cat':
        output = cat(args)
        break
      case 'test':
        test(args)
        break
    }
    std.in = ['0']
    std.out = ['1']
    std.err = ['2']
    console.log(output)
    sendPreamble()
  }
}

function redirect(target: string, output: OutputLine) {
  //TODO check options
  const path = target.split('/')
  const dest = path.splice(-1)[0]
  const fileExists = find(path.join('/'), cwd)
  if (fileExists.exist && fileExists.file!.type == Filetype.folder) {
    let updated = false
    for (var j = 0; j < fileExists.file!.content.length; j++) {
      if (fileExists.file!.content[j].name == dest) {
        fileExists.file!.last = Date.now()
        fileExists.file!.text = output.content
        updated = true
        break
      }
    }
    if (!updated) {
      const file = new File(Filetype.file, dest, Date.now(), fileExists.file!, output.content)
      fileExists.file!.content.push(file)
    }
  } else {
    return send('error', `warning: An error occurred while redirecting file '${target}'`)
  }
  return output
}

function send(type: string, content: string, path?: string): OutputLine {
  switch (type) {
    case 'error':
      if (std.err.includes('2')) {
        output.value.push({ type, content, path })
      } else {
        std.err.forEach((elem) => {
          redirect(elem, { type, content, path })
        })
      }
      break
    case 'output':
      if (std.out.includes('1')) {
        output.value.push({ type, content, path })
      } else {
        std.out.forEach((elem) => {
          redirect(elem, { type, content, path })
        })
      }
      break
    case 'input':
      output.value.push({ type, content, path })
      break
    case 'preamble':
      output.value.push({ type, content, path })
      break
  }
  return { type, content, path }
}

function sendPreamble() {
  if (cwd.name != '/') {
    send('preamble', '', cwd.getAbsolutePath())
  } else {
    send('preamble', '')
  }
}

function parseArgs(args: string[]) {
  const rawOptions: string[] = []
  const folders: string[] = []
  const options: string[] = []

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

function recCreateFolder(input: string, start: File, p: boolean): number {
  if (input.length == 0) {
    return 0
  }
  const path = input.split('/')
  if (input[0] == '/') {
    return recCreateFolder(input.substring(1), start.getRoot(), p)
  }
  if (path[0] == '.') {
    path.splice(0, 1)
    return recCreateFolder(path.join('/'), start, p)
  }
  if (path[0] == '..') {
    path.splice(0, 1)
    return recCreateFolder(path.join('/'), start.parent!, p)
  }
  let found = null
  for (var i = 0; i < start.content.length; i++) {
    if (start.content[i].name == path[0]) {
      found = start.content[i]
      break
    }
  }

  if (found != null) {
    path.splice(0, 1)
    return recCreateFolder(path.join('/'), found, p)
  } else {
    if (p) {
      const folder = new File(Filetype.folder, path[0], Date.now(), start)
      start.content.push(folder)
      path.splice(0, 1)
      return recCreateFolder(path.join('/'), folder, p)
    } else {
      if (path.length > 1) {
        return -1
      }
      const folder = new File(Filetype.folder, path[0], Date.now(), start)
      start.content.push(folder)
      path.splice(0, 1)
      return recCreateFolder(path.join('/'), folder, p)
    }
  }
}

function touch(args: string[]) {
  let output = null
  const parsedArgs = parseArgs(args)
  //TODO check options
  for (var i = 0; i < parsedArgs.folders.length; i++) {
    const path = parsedArgs.folders[i].split('/')
    const dest = path.splice(-1)[0]
    const fileExists = find(path.join('/'), cwd)
    if (fileExists.exist && fileExists.file!.type == Filetype.folder) {
      let updated = false
      for (var j = 0; j < fileExists.file!.content.length; j++) {
        if (fileExists.file!.content[j].name == dest) {
          fileExists.file!.last = Date.now()
          updated = true
          break
        }
      }
      if (!updated) {
        const file = new File(Filetype.file, dest, Date.now(), fileExists.file!, '')
        fileExists.file!.content.push(file)
      }
    } else {
      return send(
        'error',
        `touch: '${parsedArgs.folders[i]}' kann nicht berührt werden: Datei oder Verzeichnis nicht gefunden`
      )
    }
  }
  return output
}

function cat(args: string[]) {
  let output = null
  const parsedArgs = parseArgs(args)
  parsedArgs.folders.forEach((elem) => {
    const found = find(elem, cwd)
    if (found.exist) {
      if (found.file!.type == Filetype.file) {
        output = send('output', found.file!.text!)
      } else {
        output = send('error', `cat: ${elem}: ist in Verzeichnis`)
      }
    } else {
      output = send('error', `cat: ${elem}: Datei oder Verzeichnis nicht gefunden`)
    }
  })
  return output
}

defineExpose({
  handleInput
})
</script>

<template></template>
