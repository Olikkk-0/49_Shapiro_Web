<!--
  pages/PostsPage.vue — Страница "Посты"
  Использует: usePostsStore (Pinia)
  Компоненты: PostCard, PostForm, LoadingBox, ErrorBox, PlaceholderBox, ApiBadge
  Запрет DOM: только v-for, v-if, @click, никаких document.*
-->
<template>
  <section class="api-section active" aria-label="Посты">
    <div class="section-header">
      <h2 class="section-title">
        Посты
        <ApiBadge method="GET" />
        <ApiBadge method="POST" />
        <ApiBadge method="PATCH" />
        <ApiBadge method="DELETE" />
      </h2>
      <p class="section-desc">
        Используется <strong>JSONPlaceholder API</strong> — REST API для тестирования.
        Поддерживает все HTTP-методы.
      </p>
    </div>

    <div class="posts-controls">
      <button class="btn-primary"   @click="store.loadPosts">Загрузить посты</button>
      <button class="btn-secondary" @click="store.openCreateForm">＋ Новый пост</button>
    </div>

    <!-- Форма создания/редактирования -->
    <PostForm
      v-if="store.formOpen"
      :editing-post="store.editingPost"
      :form-status="store.formStatus"
      :message="store.formMessage"
      :is-error="store.formIsError"
      @submit="handleFormSubmit"
      @cancel="store.closeForm"
    />

    <!-- Состояния списка -->
    <PlaceholderBox
      v-if="store.status === 'idle'"
      icon="📄"
      message="Нажмите «Загрузить посты», чтобы получить список"
    />

    <LoadingBox
      v-else-if="store.status === 'loading'"
      message="Загружаем посты…"
    />

    <ErrorBox
      v-else-if="store.status === 'error'"
      :message="store.error"
    />

    <!-- Сетка карточек -->
    <div
      v-else-if="store.status === 'success'"
      class="posts-grid"
      aria-live="polite"
    >
      <PostCard
        v-for="post in store.posts"
        :key="post.id"
        :post="post"
        @edit="store.openEditForm"
        @delete="store.removePost"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { usePostsStore } from '../stores/posts'
import PostCard       from '../components/PostCard.vue'
import PostForm       from '../components/PostForm.vue'
import LoadingBox     from '../components/LoadingBox.vue'
import ErrorBox       from '../components/ErrorBox.vue'
import PlaceholderBox from '../components/PlaceholderBox.vue'
import ApiBadge       from '../components/ApiBadge.vue'

export default defineComponent({
  name: 'PostsPage',
  components: { PostCard, PostForm, LoadingBox, ErrorBox, PlaceholderBox, ApiBadge },
  setup() {
    const store = usePostsStore()

    async function handleFormSubmit(title: string, body: string): Promise<void> {
      if (store.editingPost) {
        await store.submitUpdate(store.editingPost.id, title, body)
      } else {
        await store.submitCreate(title, body)
      }
    }

    return { store, handleFormSubmit }
  },
})
</script>
