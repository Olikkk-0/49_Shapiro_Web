// ╔══════════════════════════════════════════════════════╗
// ║  stores/posts.ts — Pinia Store: посты                ║
// ║  Глобальное хранилище + предзагрузка списка постов   ║
// ╚══════════════════════════════════════════════════════╝
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as PostsAPI from '../api/posts'
import type { Post, LoadStatus } from '../types'

export const usePostsStore = defineStore('posts', () => {
  // ── State ──────────────────────────────────────────────
  const posts        = ref<Post[]>([])
  const status       = ref<LoadStatus>('idle')
  const error        = ref<string>('')
  const editingPost  = ref<Post | null>(null)
  const formOpen     = ref<boolean>(false)
  const formStatus   = ref<LoadStatus>('idle')
  const formMessage  = ref<string>('')
  const formIsError  = ref<boolean>(false)

  // ── Actions: load ──────────────────────────────────────
  async function loadPosts(): Promise<void> {
    status.value = 'loading'
    error.value  = ''
    try {
      posts.value  = await PostsAPI.getPosts(12)
      status.value = 'success'
    } catch (err: unknown) {
      error.value  = err instanceof Error ? err.message : 'Не удалось загрузить посты'
      status.value = 'error'
    }
  }

  // ── Actions: form ──────────────────────────────────────
  function openCreateForm(): void {
    editingPost.value = null
    formOpen.value    = true
    formStatus.value  = 'idle'
    formMessage.value = ''
    formIsError.value = false
  }

  function openEditForm(post: Post): void {
    editingPost.value = { ...post }
    formOpen.value    = true
    formStatus.value  = 'idle'
    formMessage.value = ''
    formIsError.value = false
  }

  function closeForm(): void {
    formOpen.value    = false
    editingPost.value = null
    formStatus.value  = 'idle'
    formMessage.value = ''
    formIsError.value = false
  }

  // ── Actions: create ────────────────────────────────────
  async function submitCreate(title: string, body: string): Promise<void> {
    if (!validateForm(title, body)) return
    formStatus.value  = 'loading'
    formIsError.value = false
    try {
      const newPost = await PostsAPI.createPost({ title, body })
      // Предзагруженные данные обновляем в хранилище
      posts.value.unshift({ ...newPost, id: Date.now() }) // JSONPlaceholder всегда возвращает id=101
      formStatus.value  = 'success'
      formMessage.value = `✅ Пост создан! (сервер вернул ID: ${newPost.id})`
      setTimeout(closeForm, 2500)
    } catch (err: unknown) {
      formStatus.value  = 'error'
      formIsError.value = true
      formMessage.value = `⚠️ ${err instanceof Error ? err.message : 'Ошибка при сохранении'}`
    }
  }

  // ── Actions: update ────────────────────────────────────
  async function submitUpdate(id: number, title: string, body: string): Promise<void> {
    if (!validateForm(title, body)) return
    formStatus.value  = 'loading'
    formIsError.value = false
    try {
      const updated = await PostsAPI.updatePost(id, { title, body })
      // Обновляем в глобальном хранилище
      const idx = posts.value.findIndex(p => p.id === id)
      if (idx !== -1) posts.value[idx] = { ...posts.value[idx], title: updated.title, body: updated.body }
      formStatus.value  = 'success'
      formMessage.value = `✅ Пост #${updated.id} обновлён`
      setTimeout(closeForm, 2000)
    } catch (err: unknown) {
      formStatus.value  = 'error'
      formIsError.value = true
      formMessage.value = `⚠️ ${err instanceof Error ? err.message : 'Ошибка при обновлении'}`
    }
  }

  // ── Actions: delete ────────────────────────────────────
  async function removePost(id: number): Promise<void> {
    try {
      await PostsAPI.deletePost(id)
      // Удаляем из глобального хранилища
      posts.value = posts.value.filter(p => p.id !== id)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Ошибка удаления'
    }
  }

  // ── Helpers ────────────────────────────────────────────
  function validateForm(title: string, body: string): boolean {
    if (!title?.trim()) {
      formIsError.value = true
      formMessage.value = '⚠️ Введите заголовок поста'
      formStatus.value  = 'error'
      return false
    }
    if (title.trim().length < 3) {
      formIsError.value = true
      formMessage.value = '⚠️ Заголовок слишком короткий (мин. 3 символа)'
      formStatus.value  = 'error'
      return false
    }
    if (!body?.trim()) {
      formIsError.value = true
      formMessage.value = '⚠️ Введите содержание поста'
      formStatus.value  = 'error'
      return false
    }
    return true
  }

  return {
    posts, status, error,
    editingPost, formOpen, formStatus, formMessage, formIsError,
    loadPosts, openCreateForm, openEditForm, closeForm,
    submitCreate, submitUpdate, removePost,
  }
})
