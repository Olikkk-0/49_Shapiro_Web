<!--
  PostForm.vue — Форма создания/редактирования поста
  Props: editingPost (null = создание, Post = редактирование)
  Emits: submit(title, body), cancel
  Запрет DOM: v-model вместо getElementById
-->
<template>
  <div class="form-wrapper">
    <h3 class="form-title">{{ editingPost ? 'Редактировать пост' : 'Новый пост' }}</h3>

    <div class="form-group">
      <label for="post-input-title">Заголовок</label>
      <input
        id="post-input-title"
        v-model="titleVal"
        type="text"
        placeholder="Заголовок поста"
      />
    </div>

    <div class="form-group">
      <label for="post-input-body">Содержание</label>
      <textarea
        id="post-input-body"
        v-model="bodyVal"
        rows="4"
        placeholder="Текст поста…"
      ></textarea>
    </div>

    <div class="form-actions">
      <button
        class="btn-primary"
        :disabled="isLoading"
        @click="handleSubmit"
      >
        Сохранить
      </button>
      <button class="btn-ghost" @click="$emit('cancel')">Отмена</button>
    </div>

    <div v-if="isLoading" class="loading-inline">
      <div class="spinner small"></div> Отправляем…
    </div>

    <div
      v-if="message"
      class="success-inline"
      :class="{ 'form-error-msg': isError }"
    >
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, type PropType } from 'vue'
import type { Post, LoadStatus } from '../types'

export default defineComponent({
  name: 'PostForm',
  props: {
    editingPost: {
      type: Object as PropType<Post | null>,
      default: null,
    },
    formStatus: {
      type: String as PropType<LoadStatus>,
      default: 'idle',
    },
    message: {
      type: String,
      default: '',
    },
    isError: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const titleVal = ref<string>(props.editingPost?.title ?? '')
    const bodyVal  = ref<string>(props.editingPost?.body  ?? '')

    // Синхронизируем поля при смене редактируемого поста
    watch(() => props.editingPost, (post) => {
      titleVal.value = post?.title ?? ''
      bodyVal.value  = post?.body  ?? ''
    })

    const isLoading = computed<boolean>(() => props.formStatus === 'loading')

    function handleSubmit(): void {
      emit('submit', titleVal.value, bodyVal.value)
    }

    return { titleVal, bodyVal, isLoading, handleSubmit }
  },
})
</script>
