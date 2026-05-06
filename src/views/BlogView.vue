<script setup lang="ts">
import StandardLayout from '@/components/layout/StandardLayout.vue'
import { TitlebarIcon, WindowBody, WindowComponent } from 'vue-98'
import { blogs, getDisplayTitle } from './Blog'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import DOMPurify from 'dompurify'
import { marked } from './Blog'
import { useSeoMeta } from '@unhead/vue'

const route = useRoute('blog')
const content = ref('')

const ts = route.params.timestamp as string
const currentBlog = blogs.find((blog) => blog.date === ts)

useSeoMeta({
  title: currentBlog?.title,
  description: currentBlog?.description,
  articleTag: currentBlog?.tags
})

onMounted(async () => {
  if (currentBlog) {
    content.value = DOMPurify.sanitize(await marked.parse(currentBlog.content))
  }
})
</script>
<template>
  <StandardLayout>
    <template #main-content>
      <WindowComponent
        v-if="content && currentBlog"
        :title="getDisplayTitle(currentBlog)"
        :with-controller="false"
        class="active my-4!"
      >
        <template #title-icon>
          <TitlebarIcon icon="document"></TitlebarIcon>
        </template>
        <template #body>
          <WindowBody>
            <div class="content p-2 pt-0" v-html="content"></div>
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
