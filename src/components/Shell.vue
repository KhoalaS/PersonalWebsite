<script setup lang="ts">
import { onMounted, onUpdated, provide, ref } from 'vue'
import type { Ref } from 'vue'
import type { OutputLine } from '@/Types'
import Filesystem from '@/components/Filesystem.vue'
import { shellOutputKey, shellInputKey, shellWidthKey } from '@/Keys'
import FileTree from '@/components/FileTree.vue'

const preamble = { type: 'preamble', content: '' }
const output: Ref<Array<OutputLine>> = ref([])
const inputLine = ref('')
const inputRef = ref<HTMLElement | null>(null)
const shellContainer = ref<HTMLDivElement | null>(null)
const history: Array<string> = []
const openaiKey = import.meta.env.VITE_OPENAI_KEY
let searchIndex = history.length
let width: Ref<number | undefined> = ref(undefined)

provide(shellWidthKey, width)

const props = defineProps({
  username: { type: String, required: true },
  host: { type: String, required: true }
})

onMounted(() => {
  width.value = shellContainer.value?.clientWidth
  window.addEventListener('resize', () => {
    width.value = shellContainer.value?.clientWidth
  })
})

provide(shellOutputKey, output)
provide(shellInputKey, inputLine)

const fs = ref<typeof Filesystem | null>(null)

init()

onUpdated(() => {
  shellContainer.value?.scrollTo(0, shellContainer.value.scrollHeight)
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

    fs.value?.handleInput(line)
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
      <FileTree :root="fs?.cwd.content" :name="fs?.cwd.name" :filetype="fs?.cwd.type"></FileTree>
    </ul>
    <main class="crt w-full">
      <Filesystem :user="username" ref="fs"></Filesystem>
      <div
        id="shell"
        ref="shellContainer"
        @click="(event) => prevent(event)"
        class="flex flex-col shadow-lg h-[28rem] border-2 border-black bg-black bg-opacity-60 overflow-y-scroll selection:bg-white selection:text-black"
      >
        <div @click="(event) => prevent(event)" class="px-2 active:outline-none hover:cursor-text">
          <div v-for="line in output" class="text-xl font-terminess">
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
              class="block bg-black h-fit text-white text-xl font-terminess w-full overflow-hidden bg-opacity-0 resize-none focus:outline-none shadow-none"
            ></textarea>
            <div v-else>
              <p class="text-white">{{ line.content }}</p>
            </div>
          </div>
        </div>
        <textarea
          spellcheck="false"
          ref="inputRef"
          autocomplete="on"
          @keydown="(event) => keyDown(event)"
          @keypress="(event) => keyPress(event)"
          class="mb-2 min-h-[1lh] text-white text-xl font-terminess h-full bg-black bg-opacity-0 focus:outline-none px-2 z-10 caret-white overflow-hidden shadow-none resize-none"
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
}
</style>
