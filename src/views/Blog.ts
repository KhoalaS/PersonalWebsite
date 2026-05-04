import DOMPurify from 'dompurify'
import { Marked } from 'marked'
import builder_blog from '@/assets/blog/builder_blog.md?raw'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import { formatApacheDate } from '@/DateLib'

const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    }
  })
)

export type Blog = {
  title: string
  date: string
  content: string
  tags: string[]
  description: string
}

export const blogs: Blog[] = [
  {
    title: 'Kann dein Builder das auch?',
    content: DOMPurify.sanitize(await marked.parse(builder_blog)),
    date: '1777622081916',
    description: '',
    tags: ['ElysiaJS', 'Typescript', 'Builder Pattern']
  }
]

export function getDisplayTitle(blog: Blog) {
  return 'Blog ' + formatApacheDate(new Date(Number(blog.date)))
}
