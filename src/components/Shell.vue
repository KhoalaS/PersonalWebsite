<script setup lang="ts">
import { onMounted, onUpdated, provide, ref, useTemplateRef } from 'vue'
import type { OutputLine } from '@/Types'
import Filesystem from '@/components/Filesystem.vue'
import { shellOutputKey, shellInputKey, shellWidthKey } from '@/Keys'
import FileTree from '@/components/FileTree.vue'

const props = defineProps<{
  username: string
  host: string
}>()

const preamble = { type: 'preamble', content: '' }
const output = ref<OutputLine[]>([])
const inputLine = ref('')
const inputRef = useTemplateRef('input')
const shellContainerRef = useTemplateRef('shellContainer')
const history: string[] = []
let searchIndex = history.length
const width = ref<number | undefined>()

provide(shellWidthKey, width)

onMounted(() => {
  width.value = shellContainerRef.value?.clientWidth
  window.addEventListener('resize', () => {
    width.value = shellContainerRef.value?.clientWidth
  })
})

provide(shellOutputKey, output)
provide(shellInputKey, inputLine)

const fsRef = useTemplateRef('fs')

init()

onUpdated(() => {
  shellContainerRef.value?.scrollTo(0, shellContainerRef.value.scrollHeight)
})

function init() {
  console.log('onupdate')
  output.value.push({ type: 'preamble', content: '' })
}

function prevent(event: Event) {
  if (event.type == 'click') {
    inputRef.value?.focus()
  }
}

async function keyPress(event: KeyboardEvent) {
  if (event.key == 'Enter') {
    event.preventDefault()
    const line = inputLine.value.trim()
    if (line.length == 0) {
      return sendPreamble()
    }
    insertHistory(line)
    output.value.push({ type: 'input', content: `${inputLine.value.trim()}` })
    inputLine.value = ''

    fsRef.value?.handleInput(line)
  }
}

function insertHistory(line: string) {
  if (history.includes(line)) {
    const i = history.indexOf(line)
    history.splice(i, 1)
  }
  history.push(line)
  searchIndex = history.length
}

// TODO add autocomplete
function keyDown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      if (searchIndex != history.length) {
        searchIndex += 1
        if (searchIndex == history.length) {
          inputLine.value = ''
        } else {
          console.log(searchIndex)
          console.log(history)
          inputLine.value = history[searchIndex]
        }
      }
      event.preventDefault()
      break

    case 'ArrowUp':
      if (searchIndex != 0) {
        console.log(searchIndex)
        console.log(history)
        searchIndex -= 1
        inputLine.value = history[searchIndex]
      }
      event.preventDefault()
      break
  }
}

function sendPreamble() {
  output.value.push(preamble)
}
</script>

<template>
  <div class="flex w-full">
    <ul class="tree-view w-fit">
      <FileTree
        v-if="fsRef"
        :root="fsRef.cwd.content"
        :name="fsRef.cwd.name"
        :filetype="fsRef.cwd.type"
      ></FileTree>
    </ul>
    <main class="crt w-full">
      <Filesystem :user="username" ref="fs"></Filesystem>
      <div
        id="shell"
        ref="shellContainer"
        @click="(event) => prevent(event)"
        class="flex flex-col shadow-lg h-[28rem] bg-black/60 overflow-y-scroll selection:bg-white selection:text-black"
      >
        <div @click="(event) => prevent(event)" class="px-2 active:outline-none hover:cursor-text">
          <div
            :key="line.path"
            v-for="line in output"
            class="text-xl"
            style="font-family: Terminess"
          >
            <div v-if="line.type == 'preamble'" class="flex gap-[2px]">
              <p class="text-yellow-500 selection:bg-yellow-500 selection:text-black">
                {{ props.username }}
              </p>
              <p class="text-white">@</p>
              <p class="text-purple-300 selection:bg-purple-500 selection:text-black">
                {{ props.host }}
              </p>
              <p v-if="line.path" class="text-white">{{ ':~' + line.path }}</p>
              <p v-else class="text-white">:~$</p>
            </div>
            <textarea
              v-else-if="line.content.split('\n').length > 1"
              spellcheck="false"
              v-model="line.content"
              :rows="line.content.split('\n').length"
              class="block px-2 h-fit text-white text-xl font-terminess w-full overflow-hidden resize-none focus:outline-none shadow-none"
            ></textarea>
            <div v-else>
              <p class="text-white">{{ line.content }}</p>
            </div>
          </div>
        </div>
        <textarea
          spellcheck="false"
          ref="input"
          autocomplete="on"
          @keydown="(event) => keyDown(event)"
          @keypress="(event) => keyPress(event)"
          class="mb-2 min-h-[1lh] text-white text-xl! h-full bg-transparent focus:outline-none px-2 z-10 caret-white overflow-hidden shadow-none resize-none"
          v-model="inputLine"
          type="text"
        ></textarea>
      </div>
    </main>
  </div>
</template>

<style scoped>
#shell::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
#shell {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

textarea {
  border: none !important;
  box-shadow: none;
  background-color: transparent !important;
  padding: unset;
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
  font-family: Terminess;
}
</style>
