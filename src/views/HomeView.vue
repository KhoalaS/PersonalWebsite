<script setup lang="ts">
import Shell from '@/components/Shell.vue'

import ad004 from '@/assets/gifs/ad-004.gif'
import eyeadbanner from '@/assets/gifs/eyeadbanner.gif'
import ie from '@/assets/gifs/ie.gif'
import lain from '@/assets/gifs/lain.gif'
import cdsidebanner from '@/assets/gifs/musiclargesidebanner.gif'
import ns from '@/assets/gifs/ns.gif'
import blacklagoon from '@/assets/gifs/blacklagoon.gif'

</script>

<template>
  <main class="flex flex-col w-full gap-2">
    <img class="w-1/2 self-center" :src="eyeadbanner" />

    <div class="flex gap-2">
      <img class="ml-2" :src="cdsidebanner" />
      <div>
        <Shell username="khoa" host="brave" class=""></Shell>
      </div>
      <div id="gifs" class="flex">
        <div>
          <img :src="lain" class="h-[300px]" />
          <div
            class="crt"
            ref="ad_4"
          >
            <img :src="blacklagoon" />
          </div>
        </div>
        <img class="h-12 z-10 top-1 left-12" :src="ad004" />
      </div>
    </div>

    <div class="flex flex-col self-center">
      <div class="font-serif">Page best viewed with:</div>
      <div class="flex">
        <a href="https://www.microsoft.com/en-us/download/404Error.aspx" target="_blank">
          <img :src="ie" />
        </a>
        <a href="http://archive.netscape.com/" target="_blank">
          <img :src="ns" />
        </a>
      </div>
    </div>
  </main>
</template>
