<script setup lang="ts">
import FishWindow from '@/components/FishWindow.vue'
import ProfileWindow from '@/components/ProfileWindow.vue'
import ie from '@/assets/gifs/ie.gif'
import ns from '@/assets/gifs/ns.gif'
import css from '@/assets/css.gif'
import html from '@/assets/w3c.png'
import { ref, onMounted } from 'vue'
import {
  StartButton,
  StatusBlock,
  TabComponent,
  TaskbarComponent,
  TaskbarDivider,
  TaskbarGroup
} from 'vue-98'

const height = ref(window.innerHeight)
const time = ref(Date.now())

onMounted(() => {
  height.value = window.innerHeight
})

function updateTime() {
  time.value += 5000
}

setInterval(updateTime, 5000)
</script>

<template>
  <main ref="parent" class="flex justify-center gap-4 flex-1">
    <div class="w-[60vw] flex flex-col gap-2">
      <ProfileWindow ref="profileWindow"></ProfileWindow>
      <FishWindow></FishWindow>
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
  </main>
  <TaskbarComponent>
    <StartButton></StartButton>
    <TaskbarGroup>
      <TabComponent label="Fish"></TabComponent>
      <TaskbarDivider></TaskbarDivider>
      <TabComponent label="Personal"></TabComponent>
    </TaskbarGroup>
    <TaskbarDivider class="ml-auto!"></TaskbarDivider>
    <StatusBlock></StatusBlock>
  </TaskbarComponent>
</template>
<style scoped>
.taskbar {
  box-shadow:
    inset 0px 1px #fff,
    inset 0px 2px #dfdfdf;
}
#start {
  padding: 0px 4px;
  min-width: 0px !important;
}
.task {
  padding-left: 4px !important;
}
</style>
