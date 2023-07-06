<script setup lang="ts">
import type { File } from '@/Types'
import Folder from '@/assets/folder.png'
import { Filetype } from '@/Types'

defineProps({
  root: Array<File>,
  name: String,
  filetype: String
})
</script>
<template>
  <li>
    <div class="flex items-center gap-1">
      <img v-if="filetype == Filetype.folder" :src="Folder" />
      <p>{{ name }}</p>
    </div>
    <ul>
      <FileTree v-for="file in root" :root="file.content" :name="file.name" :filetype="file.type">
      </FileTree>
    </ul>
  </li>
</template>
