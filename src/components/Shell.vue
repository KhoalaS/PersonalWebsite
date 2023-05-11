<script setup lang="ts">
import { onMounted, onUpdated, provide, ref } from 'vue'
import type { Ref } from 'vue'
import type { OutputLine } from '@/Types'
import Filesystem from './Filesystem.vue'
import { shellOutputKey, shellInputKey } from '@/Keys'

const preamble = { type: 'preamble', content: '' }
const output: Ref<Array<OutputLine>> = ref([])
const inputLine = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const shellContainer = ref<HTMLDivElement | null>(null)
const history: Array<string> = []
const openaiKey = import.meta.env.VITE_OPENAI_KEY
let searchIndex = history.length
const props = defineProps({
  username: { type: String, required: true },
  host: { type: String, required: true }
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
    const line = inputLine.value.trim()
    if (line.length == 0) {
      return sendPreamble()
    }
    insertHistory(line)
    output.value.push({ type: 'input', content: `${inputLine.value.trim()}` })
    inputLine.value = ''

    if (line.split(' ')[0] == 'chat') {
      const answer = await chat(line.substring(5))
      output.value.push({ type: 'chat', content: answer })
      return sendPreamble()
    } else {
      fs.value?.handleInput(line)
    }
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

//TODO handle code in these ``` with regexp?
async function chat(input: string) {
  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: input.trim() }
    ]
  }
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiKey}`
    },
    body: JSON.stringify(data)
  })
  const answer = await response.json()

  return answer.choices[0].message.content
}
</script>

<template>
  <main>
    <Filesystem ref="fs"></Filesystem>
    <div
      id="shell"
      ref="shellContainer"
      @click="(event) => prevent(event)"
      class="crt flex flex-col h-[28rem] w-[50vw] border-2 border-black bg-black bg-opacity-60 overflow-y-scroll"
    >
      <div @click="(event) => prevent(event)" class="px-2 active:outline-none">
        <div v-for="line in output" class="text-xl font-terminess">
          <div v-if="line.type == 'preamble'" class="flex gap-[2px]">
            <p class="text-yellow-500">{{ props.username }}</p>
            <p class="text-white">@</p>
            <p class="text-purple-500">{{ props.host }}</p>
            <p v-if="line.path" class="text-white">{{ ':~' + line.path }}</p>
            <p v-else class="text-white">:~$</p>
          </div>
          <div v-else class="text-white">
            {{ line.content }}
          </div>
        </div>
      </div>
      <input
        spellcheck="false"
        ref="inputRef"
        autocomplete="on"
        @keydown="(event) => keyDown(event)"
        @keypress="(event) => keyPress(event)"
        class="text-white text-xl font-terminess bg-black bg-opacity-0 focus:outline-none px-2 z-10 caret-white"
        v-model="inputLine"
        type="text"
      />
    </div>
  </main>
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
</style>