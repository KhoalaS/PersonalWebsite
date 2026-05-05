<script setup lang="ts">
import FishWindow from '@/components/FishWindow.vue'
import ProfileWindow from '@/components/ProfileWindow.vue'
import ie from '@/assets/gifs/ie.gif'
import ns from '@/assets/gifs/ns.gif'
import css from '@/assets/css.gif'
import html from '@/assets/w3c.png'
import { WindowBody, WindowComponent } from 'vue-98'
</script>

<template>
  <main ref="parent" class="relative">
    <ProfileWindow class="absolute! top-4 left-12 h-fit w-fit" ref="profileWindow"></ProfileWindow>
    <FishWindow class="absolute! right-12 top-60 h-fit w-[600px]"></FishWindow>
    <WindowComponent title="Navlink" class="active absolute! top-45 left-90 h-fit w-fit">
      <template #body>
        <WindowBody>
          <div class="w-[180px]">
            <iframe
              width="180"
              height="180"
              style="border: none"
              src="https://dimden.neocities.org/navlink/"
              name="neolink"
            ></iframe>
          </div>
        </WindowBody>
      </template>
    </WindowComponent>
    <WindowComponent title="Recommended" class="active absolute! top-30 right-56 h-fit w-fit">
      <template #body>
        <WindowBody>
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
        </WindowBody>
      </template>
    </WindowComponent>
  </main>
</template>
