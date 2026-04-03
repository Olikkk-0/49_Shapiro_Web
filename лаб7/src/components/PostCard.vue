<!--
  PostCard.vue — Карточка одного поста
  Props: post: Post
  Emits: edit(post), delete(id)
  Запрет DOM: нет document.*
-->
<template>
  <article class="post-card" :class="{ deleting: isDeleting }">
    <span class="post-card-id">#{{ post.id }}</span>
    <h3 class="post-card-title">{{ capitalise(post.title) }}</h3>
    <p class="post-card-body">{{ post.body }}</p>
    <div class="post-card-actions">
      <button class="btn-edit"   @click="$emit('edit', post)">✏️ Изменить</button>
      <button class="btn-delete" @click="handleDelete">🗑 Удалить</button>
    </div>
  </article>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue'
import type { Post } from '../types'

export default defineComponent({
  name: 'PostCard',
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true,
    },
  },
  emits: ['edit', 'delete'],
  setup(props, { emit }) {
    const isDeleting = ref<boolean>(false)

    function capitalise(str: string): string {
      if (!str) return ''
      return str.charAt(0).toUpperCase() + str.slice(1)
    }

    function handleDelete(): void {
      if (!window.confirm('Удалить этот пост? Это действие нельзя отменить.')) return
      isDeleting.value = true
      emit('delete', props.post.id)
    }

    return { isDeleting, capitalise, handleDelete }
  },
})
</script>
