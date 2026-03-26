/*
   POSTS API MODULE
   Uses: JSONPlaceholder — fake REST API
   Methods: GET (list), POST (create),
            PATCH (update), DELETE (remove)
 */

const PostsAPI = (() => {

  const BASE = 'https://jsonplaceholder.typicode.com/posts';

  /*  GET /posts?_limit=12  */
  async function getPosts(limit = 12) {
    const response = await fetch(`${BASE}?_limit=${limit}`);
    if (!response.ok) throw new Error(`GET /posts failed: ${response.status}`);
    return response.json();
  }

  /*  GET /posts/:id  */
  async function getPost(id) {
    const response = await fetch(`${BASE}/${id}`);
    if (!response.ok) throw new Error(`GET /posts/${id} failed: ${response.status}`);
    return response.json();
  }

  /*  POST /posts  */
  async function createPost({ title, body, userId = 1 }) {
    if (!title || !title.trim()) throw new Error('Заголовок не может быть пустым');
    if (!body  || !body.trim())  throw new Error('Содержание не может быть пустым');

    const response = await fetch(BASE, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body:    JSON.stringify({ title: title.trim(), body: body.trim(), userId }),
    });
    if (!response.ok) throw new Error(`POST /posts failed: ${response.status}`);
    return response.json();
  }

  /*  PATCH /posts/:id  */
  async function updatePost(id, { title, body }) {
    if (!title || !title.trim()) throw new Error('Заголовок не может быть пустым');
    if (!body  || !body.trim())  throw new Error('Содержание не может быть пустым');

    const response = await fetch(`${BASE}/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body:    JSON.stringify({ title: title.trim(), body: body.trim() }),
    });
    if (!response.ok) throw new Error(`PATCH /posts/${id} failed: ${response.status}`);
    return response.json();
  }

  /*  DELETE /posts/:id  */
  async function deletePost(id) {
    const response = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`DELETE /posts/${id} failed: ${response.status}`);
    return true;
  }

  return { getPosts, getPost, createPost, updatePost, deletePost };
})();
