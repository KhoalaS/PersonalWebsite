<script setup lang="ts">
import StandardLayout from '@/components/layout/StandardLayout.vue'
import { TitlebarIcon, WindowBody, WindowComponent } from 'vue-98'
import { blogs, getDisplayTitle, type Blog } from './Blog'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const currentBlog = ref<Blog | undefined>()
const route = useRoute('blog')

const ts = route.params.timestamp as string

onMounted(async () => {
  currentBlog.value = blogs.find((blog) => blog.date === ts)
})
</script>
<template>
  <StandardLayout>
    <template #main-content>
      <WindowComponent
        v-if="currentBlog"
        :title="getDisplayTitle(currentBlog)"
        :with-controller="false"
        class="active my-4!"
      >
        <template #title-icon>
          <TitlebarIcon icon="document"></TitlebarIcon>
        </template>
        <template #body>
          <WindowBody>
            <div class="content p-2 pt-0" v-html="currentBlog.content"></div>
          </WindowBody>
        </template>
      </WindowComponent>
    </template>
  </StandardLayout>
</template>

<style scoped>
.content {
  font-family: 'Times New Roman', Times, serif !important;
  background-color: white;
  overflow: auto;
}

.content :deep(h1) {
  font-weight: bold;
}

.content :deep(pre) {
  padding: 0.25rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  background-color: #282c34;
}

.content :deep(a) {
  color: var(--title-bar-blue);
  text-decoration: underline;
}
</style>
