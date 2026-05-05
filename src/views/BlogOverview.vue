<script setup lang="ts">
import StandardLayout from '@/components/layout/StandardLayout.vue'
import BlogListing from '@/components/BlogListing.vue'
import { WindowBody, WindowComponent } from 'vue-98'
import { blogs } from './Blog'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Blogs',
  meta: [
    {
      name: 'description',
      content: 'Blog posts'
    }
  ]
})
</script>
<template>
  <StandardLayout>
    <template #main-content>
      <WindowComponent title="index" class="active min-w-fit!" :with-controller="false">
        <template #body>
          <WindowBody class="listing-window">
            <h1 class="font-bold!">Index of /blogs</h1>
            <hr />
            <pre
              style="font-family: monospace"
            ><BlogListing :blog="blog" v-for="blog in blogs" :key="blog.date"></BlogListing>
            </pre>
          </WindowBody>
        </template>
      </WindowComponent>
    </template>
  </StandardLayout>
</template>

<style scoped>
.listing-window {
  font-family: 'Times New Roman', Times, serif;
  background-color: white;
  padding: 0.5rem;
}

.listing-window > h1 {
  margin-block-end: 21px;
}
</style>
