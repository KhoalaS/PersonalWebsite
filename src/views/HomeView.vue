<script setup lang="ts">
import Shell from '@/components/Shell.vue'

import ad004 from '@/assets/gifs/ad-004.gif'
import eyeadbanner from '@/assets/gifs/eyeadbanner.gif'
import lain from '@/assets/gifs/lain.gif'
import cdsidebanner from '@/assets/gifs/musiclargesidebanner.gif'
import blacklagoon from '@/assets/gifs/blacklagoon.gif'
import ie from '@/assets/gifs/ie.gif'
import ns from '@/assets/gifs/ns.gif'
import css from '@/assets/css.gif'
import html from '@/assets/w3c.png'
</script>

<template>
  <main class="mx-auto flex gap-4">
    <div class="w-[40vw] flex flex-col gap-2">
      <div id="profile" class="window">
        <div class="title-bar h-[20px]">
          <div class="title-bar-text">Profile</div>
          <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div class="window-body flex gap-2">
          <img class="w-[120px] h-[120px] rounded" src="/pfp_edit.jpg" />
          <div>
            <p>
              Hello my name is Khoa. I like programming, gaming, reverse engineering (still nub
              tho).
            </p>
            <label class="">My programming interests:</label>
            <ul>
              <li>Vue</li>
              <li>Flutter</li>
              <li>Java</li>
              <li>Python</li>
              <li>Android RE</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="window">
        <div class="title-bar h-[20px]">
          <div class="title-bar-text">fish</div>
          <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <Shell username="khoa" host="brave"></Shell>
      </div>
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
    <div class="w-[180px]">
      <iframe
        width="180"
        height="180"
        style="border: none"
        src="https://dimden.neocities.org/navlink/"
        name="neolink"
      ></iframe>
      <ul>
        <li>Hello</li>
      </ul>
    </div>
  </main>
</template>
