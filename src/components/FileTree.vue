<script setup lang="ts">
import type { File } from '@/Types'
import Folder from '@/assets/folder.png'
import { type Filetype } from '@/Types'

defineProps<{
  root: File[]
  name: string
  filetype: Filetype
}>()
</script>
<template>
  <li>
    <div class="flex items-center gap-1">
      <img v-if="filetype === 'FOLDER'" :src="Folder" />
      <p>{{ name }}</p>
    </div>
    <ul>
      <FileTree
        v-for="file in root"
        :root="file.content"
        :name="file.name"
        :filetype="file.type"
        :key="file.name"
      >
      </FileTree>
    </ul>
  </li>
</template>
