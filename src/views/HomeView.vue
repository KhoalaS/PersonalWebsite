<script setup lang="ts">
import FishWindow from "@/components/FishWindow.vue"
import ProfileWindow from "@/components/ProfileWindow.vue"
import TaskbarDivider from "@/components/TaskbarDivider.vue"
import Thingy from "@/components/Thingy.vue"
import ie from '@/assets/gifs/ie.gif'
import ns from '@/assets/gifs/ns.gif'
import css from '@/assets/css.gif'
import html from '@/assets/w3c.png'
import { provide, ref, onMounted } from 'vue'
import { parentKey } from '@/Keys'

const parent = ref<HTMLElement|null>(null)
const fishWindow = ref<typeof FishWindow |null>(null)
const profileWindow = ref<typeof ProfileWindow|null>(null)

provide(parentKey, parent)


const height = ref(window.innerHeight)
const time = ref(Date.now())

console.log(window.innerHeight)
console.log(window.outerHeight)

const taskbarClass = ref(
  `taskbar flex w-full gap-1 fixed p-1 top-[${height.value-36}px] left-0 z-10 w-full h-[36px] bg-[silver] border-2 border-red-500 self-end`
)

onMounted(() => {
  height.value = window.innerHeight
})

onresize = (e) => {
  height.value = window.innerHeight
}

function updateTime(){
  time.value += 5000
}

setInterval(updateTime, 5000)

function minimize(key: string){
  switch(key){
    case "fish":
      fishWindow.value?.minimize()
      break;
    case "profile":
      profileWindow.value?.minimize()
      break
  }
}
</script>

<template>
  <main ref="parent" class="mx-auto flex gap-4 h-full">
    <div class="w-[40vw] flex flex-col gap-2">
      <ProfileWindow ref="profileWindow"></ProfileWindow>
      <FishWindow ref="fishWindow"></FishWindow>
    </div>
    <div class="w-[180px]">
      <iframe
        width="180"
        height="180"
        style="border: none"
        src="https://dimden.neocities.org/navlink/"
        name="neolink"
      ></iframe>
      <div class="flex flex-col items-center gap-3">
        <div class="font-serif">Page best viewed with:</div>
        <div class="flex">
          <a href="https://www.microsoft.com/en-us/download/404Error.aspx" target="_blank">
            <img :src="ie" />
          </a>
          <a href="http://archive.netscape.com/" target="_blank">
            <img :src="ns" />
          </a>
        </div>
        <div class="flex gap-1 items-center">
          <img class="h-8" :src="css" />
          <img class="h-8" :src="html" />
        </div>
      </div>
    </div>
    <div :class="taskbarClass">
      <button id="start" class="flex items-center h-full w-fit">
        <img class="h-[24px]" src="/windows.ico" />
        <p class="font-bold">Start</p>
      </button>
      <TaskbarDivider></TaskbarDivider>
      <Thingy></Thingy>
      <div class="w-[136px]"></div>
      <TaskbarDivider></TaskbarDivider>
      <Thingy></Thingy>
      <button @click="minimize('fish')" class="task flex items-center gap-1 w-[160px] text-left text-[14px]">
        <div class="flex items-center">
          <img height="24" src="/console_prompt.ico" />
        </div>
        fish
      </button>
      <button @click="minimize('profile')" class="task flex items-center gap-1 w-[160px] text-left text-[14px]">
        <div class="flex items-center">
          <img height="24" src="/msn3.ico" />
        </div>
        Profile
      </button>
      <TaskbarDivider class="ml-auto"></TaskbarDivider>
      <div class="status-bar">
        <p class="status-bar-field flex font-mssans px-2 items-center">
          <div class="flex items-center">
            <img height="22" src="/loudspeaker_rays.ico">
          </div>
          <p class="pl-2">
            {{ (new Date(time).toLocaleTimeString('de-DE',{hour:"2-digit", minute:"2-digit"})).replace(":", ": ") }}

          </p>
        </p>
      </div>
  </div>
  </main>
</template>
<style scoped>
.taskbar {
  box-shadow: inset 0px 1px #fff, inset 0px 2px #dfdfdf;
}
#start {
  padding: 0px 4px;
  min-width: 0px !important;
}
.task {
  padding-left: 4px !important;
}
</style>