<script setup lang="ts">
import StandardLayout from '@/components/layout/StandardLayout.vue'
import { WindowBody, WindowComponent } from 'vue-98'
import { blogs, getDisplayTitle } from './Blog'
import BlogTagComponent from '@/components/BlogTagComponent.vue'
</script>
<template>
  <StandardLayout>
    <template #main-content>
      <RouterLink v-for="blog in blogs" :key="blog.date" :to="`/blog/${blog.date}`">
        <WindowComponent class="active" :with-controller="false" :title="getDisplayTitle(blog)">
          <template #body>
            <WindowBody class="p2!">
              <h2>{{ blog.title }}</h2>
              <div class="tags flex gap-2">
                <BlogTagComponent :key="tag" v-for="tag in blog.tags" :tag="tag"></BlogTagComponent>
              </div>
            </WindowBody>
          </template>
        </WindowComponent>
      </RouterLink>
    </template>
  </StandardLayout>
</template>
