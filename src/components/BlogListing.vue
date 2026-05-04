<script setup lang="ts">
import { formatApacheDate } from '@/DateLib'
import type { Blog } from '@/views/Blog'

defineProps<{
  blog: Blog
}>()
</script>
<template><RouterLink :to="`/blog/${blog.date}`">{{ blog.title + '.md' }}</RouterLink
  >{{
    new Array(63 - (blog.title.length + 3)).fill('').join(' ') +
    formatApacheDate(new Date(Number(blog.date))) +
    `       -`
  }}
</template>
