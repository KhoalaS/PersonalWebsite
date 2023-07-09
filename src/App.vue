<script setup lang="ts">
import { onMounted, ref,provide } from 'vue'
import { RouterView } from 'vue-router'
import TaskbarDivider from '@/components/TaskbarDivider.vue'
import Thingy from '@/components/Thingy.vue'
import { parentKey } from "@/Keys"

const parent = ref<HTMLElement|null>(null)
provide(parentKey, parent)

const height = ref(window.innerHeight)
const time = ref(Date.now())

const taskbarClass = ref(
  `taskbar flex w-full gap-1 fixed p-1 top-[0px] z-10 w-full h-[36px] bg-[silver] border-2 border-red-500 self-end`
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

</script>

<template>
  <header class="flex">
    <h1 class="mx-auto text-6xl animating-text">Awesome Website</h1>
  </header>
  <div ref="parent" class="flex">
    <RouterView />
  </div>
  <div :class="taskbarClass">
    <button id="start" class="flex items-center h-full w-fit">
      <img class="h-[24px]" src="windows.ico" />
      <p class="font-bold">Start</p>
    </button>
    <TaskbarDivider></TaskbarDivider>
    <Thingy></Thingy>
    <div class="w-[136px]"></div>
    <TaskbarDivider></TaskbarDivider>
    <Thingy></Thingy>
    <button class="task flex items-center gap-1 w-[160px] text-left text-[14px]">
      <div class="flex items-center">
        <img height="24" src="/console_prompt.ico" />
      </div>
      fish
    </button>
    <button class="task flex items-center gap-1 w-[160px] text-left text-[14px]">
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
