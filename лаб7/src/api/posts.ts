// ╔══════════════════════════════════════════════════════╗
// ║  api/posts.ts — Posts API Module                     ║
// ║  JSONPlaceholder — GET, POST, PATCH, DELETE          ║
// ╚══════════════════════════════════════════════════════╝
import type { Post, CreatePostPayload, UpdatePostPayload } from '../types'

const BASE = 'https://jsonplaceholder.typicode.com/posts'

export async function getPosts(limit = 12): Promise<Post[]> {
  const res = await fetch(`${BASE}?_limit=${limit}`)
  if (!res.ok) throw new Error(`GET /posts failed: ${res.status}`)
  return res.json()
}

export async function getPost(id: number): Promise<Post> {
  const res = await fetch(`${BASE}/${id}`)
  if (!res.ok) throw new Error(`GET /posts/${id} failed: ${res.status}`)
  return res.json()
}

export async function createPost({ title, body, userId = 1 }: CreatePostPayload): Promise<Post> {
  if (!title?.trim()) throw new Error('Заголовок не может быть пустым')
  if (!body?.trim())  throw new Error('Содержание не может быть пустым')
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ title: title.trim(), body: body.trim(), userId }),
  })
  if (!res.ok) throw new Error(`POST /posts failed: ${res.status}`)
  return res.json()
}

export async function updatePost(id: number, { title, body }: UpdatePostPayload): Promise<Post> {
  if (!title?.trim()) throw new Error('Заголовок не может быть пустым')
  if (!body?.trim())  throw new Error('Содержание не может быть пустым')
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ title: title.trim(), body: body.trim() }),
  })
  if (!res.ok) throw new Error(`PATCH /posts/${id} failed: ${res.status}`)
  return res.json()
}

export async function deletePost(id: number): Promise<true> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`DELETE /posts/${id} failed: ${res.status}`)
  return true
}
