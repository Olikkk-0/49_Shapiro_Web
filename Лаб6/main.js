/*
   MAIN.JS — Navigation + Section Controllers
   Follows single-responsibility decomposition:
   each section has init / render / show / hide
   helper functions.
 */

/*   HELPERS */

function show(el)  { el.classList.remove('hidden'); }
function hide(el)  { el.classList.add('hidden'); }
function setText(id, val) { document.getElementById(id).textContent = val; }
function getEl(id) { return document.getElementById(id); }

/* NAVIGATION */

function initNavigation() {
  const buttons  = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.api-section');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.section;
      activateSection(target, buttons, sections);
    });
  });
}

function activateSection(targetId, buttons, sections) {
  buttons.forEach(b  => b.classList.toggle('active', b.dataset.section === targetId));
  sections.forEach(s => {
    const isTarget = s.id === `section-${targetId}`;
    s.classList.toggle('active',  isTarget);
    s.classList.toggle('hidden', !isTarget);
  });
}

/* WEATHER CONTROLLER */

function initWeather() {
  const searchBtn = getEl('weather-search-btn');
  const cityInput = getEl('weather-city');

  searchBtn.addEventListener('click', handleWeatherSearch);
  cityInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleWeatherSearch();
  });
}

async function handleWeatherSearch() {
  const cityInput = getEl('weather-city');
  const city = cityInput.value.trim();

  if (!validateCityInput(city)) return;

  showWeatherLoading();

  try {
    const data = await WeatherAPI.searchByCity(city);
    renderWeatherResult(data);
  } catch (err) {
    showWeatherError(err.message || 'Не удалось получить данные о погоде');
  }
}

function validateCityInput(city) {
  if (!city) {
    showWeatherError('Введите название города');
    return false;
  }
  if (city.length < 2) {
    showWeatherError('Название города слишком короткое');
    return false;
  }
  return true;
}

function showWeatherLoading() {
  hide(getEl('weather-placeholder'));
  hide(getEl('weather-error'));
  hide(getEl('weather-result'));
  show(getEl('weather-loading'));
}

function showWeatherError(message) {
  hide(getEl('weather-loading'));
  hide(getEl('weather-result'));
  hide(getEl('weather-placeholder'));
  setText('weather-error-msg', message);
  show(getEl('weather-error'));
}

function renderWeatherResult(data) {
  hide(getEl('weather-loading'));
  hide(getEl('weather-error'));
  hide(getEl('weather-placeholder'));

  setText('weather-city-name', `${data.city}, ${data.country}`);
  setText('weather-condition', data.condition);
  setText('weather-temp', `${data.temp}°C`);
  setText('weather-emoji', data.emoji);
  setText('weather-feels', `${data.feels}°C`);
  setText('weather-humidity', `${data.humidity}%`);
  setText('weather-wind', `${data.wind} м/с`);
  setText('weather-visibility', data.visibility >= 1000
    ? `${(data.visibility / 1000).toFixed(1)} км`
    : `${data.visibility} м`);
  setText('weather-coords', `${data.lat.toFixed(4)}°N, ${data.lon.toFixed(4)}°E`);

  show(getEl('weather-result'));
}

/* POSTS CONTROLLER */

/* State held in closure */
const postsState = {
  posts: [],
  editingId: null,
};

function initPosts() {
  getEl('posts-load-btn').addEventListener('click', handleLoadPosts);
  getEl('posts-create-btn').addEventListener('click', openCreatePostForm);
  getEl('post-form-submit').addEventListener('click', handlePostFormSubmit);
  getEl('post-form-cancel').addEventListener('click', closePostForm);
}

/* ── Load posts ── */
async function handleLoadPosts() {
  showPostsLoading();

  try {
    const posts = await PostsAPI.getPosts(12);
    postsState.posts = posts;
    renderPostsList(posts);
  } catch (err) {
    showPostsError(err.message || 'Не удалось загрузить посты');
  }
}

function showPostsLoading() {
  hide(getEl('posts-placeholder'));
  hide(getEl('posts-error'));
  hide(getEl('posts-list'));
  show(getEl('posts-loading'));
}

function showPostsError(message) {
  hide(getEl('posts-loading'));
  hide(getEl('posts-list'));
  setText('posts-error-msg', message);
  show(getEl('posts-error'));
}

function renderPostsList(posts) {
  hide(getEl('posts-loading'));
  hide(getEl('posts-error'));
  hide(getEl('posts-placeholder'));

  const list = getEl('posts-list');
  list.innerHTML = '';
  posts.forEach(post => list.appendChild(createPostCard(post)));
  show(list);
}

function createPostCard(post) {
  const article = document.createElement('article');
  article.className = 'post-card';
  article.dataset.id = post.id;

  const id      = document.createElement('span');
  id.className  = 'post-card-id';
  id.textContent = `#${post.id}`;

  const title   = document.createElement('h3');
  title.className = 'post-card-title';
  title.textContent = capitalise(post.title);

  const body    = document.createElement('p');
  body.className = 'post-card-body';
  body.textContent = post.body;

  const actions = document.createElement('div');
  actions.className = 'post-card-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'btn-edit';
  editBtn.textContent = '✏️ Изменить';
  editBtn.addEventListener('click', () => openEditPostForm(post));

  const delBtn = document.createElement('button');
  delBtn.className = 'btn-delete';
  delBtn.textContent = '🗑 Удалить';
  delBtn.addEventListener('click', () => handleDeletePost(post.id, article));

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);
  article.append(id, title, body, actions);
  return article;
}

/* ── Create / Edit form ── */
function openCreatePostForm() {
  postsState.editingId = null;
  getEl('post-form-title').textContent = 'Новый пост';
  getEl('post-edit-id').value  = '';
  getEl('post-input-title').value = '';
  getEl('post-input-body').value  = '';
  hide(getEl('post-form-loading'));
  hide(getEl('post-form-success'));
  show(getEl('post-form-wrapper'));
  getEl('post-input-title').focus();
}

function openEditPostForm(post) {
  postsState.editingId = post.id;
  getEl('post-form-title').textContent = 'Редактировать пост';
  getEl('post-edit-id').value       = post.id;
  getEl('post-input-title').value   = post.title;
  getEl('post-input-body').value    = post.body;
  hide(getEl('post-form-loading'));
  hide(getEl('post-form-success'));
  show(getEl('post-form-wrapper'));
  getEl('post-input-title').focus();
}

function closePostForm() {
  hide(getEl('post-form-wrapper'));
  postsState.editingId = null;
}

async function handlePostFormSubmit() {
  const title = getEl('post-input-title').value;
  const body  = getEl('post-input-body').value;

  try {
    validatePostFormInput(title, body);
  } catch (err) {
    showPostFormError(err.message);
    return;
  }

  showPostFormLoading();

  try {
    if (postsState.editingId) {
      await submitEditPost(postsState.editingId, title, body);
    } else {
      await submitNewPost(title, body);
    }
  } catch (err) {
    hidePostFormLoading();
    showPostFormError(err.message || 'Ошибка при сохранении');
  }
}

function validatePostFormInput(title, body) {
  if (!title || !title.trim()) throw new Error('Введите заголовок поста');
  if (!body  || !body.trim())  throw new Error('Введите содержание поста');
  if (title.trim().length < 3) throw new Error('Заголовок слишком короткий (мин. 3 символа)');
}

function showPostFormLoading() {
  hide(getEl('post-form-success'));
  show(getEl('post-form-loading'));
  getEl('post-form-submit').disabled = true;
}

function hidePostFormLoading() {
  hide(getEl('post-form-loading'));
  getEl('post-form-submit').disabled = false;
}

function showPostFormError(msg) {
  const el = getEl('post-form-success');
  el.textContent = `⚠️ ${msg}`;
  el.style.background = 'rgba(224,90,90,0.12)';
  el.style.borderColor = 'rgba(224,90,90,0.3)';
  el.style.color = 'var(--red)';
  show(el);
}

async function submitNewPost(title, body) {
  const newPost = await PostsAPI.createPost({ title, body });
  hidePostFormLoading();

  const successEl = getEl('post-form-success');
  successEl.textContent = `✅ Пост создан! (сервер вернул ID: ${newPost.id})`;
  successEl.style.cssText = '';
  show(successEl);

  /* Prepend to visible list if it's loaded */
  const list = getEl('posts-list');
  if (!list.classList.contains('hidden')) {
    const card = createPostCard({ ...newPost, id: `NEW-${Date.now()}` });
    list.prepend(card);
  }

  setTimeout(closePostForm, 2500);
}

async function submitEditPost(id, title, body) {
  const updated = await PostsAPI.updatePost(id, { title, body });
  hidePostFormLoading();

  const successEl = getEl('post-form-success');
  successEl.textContent = `✅ Пост #${updated.id} обновлён`;
  successEl.style.cssText = '';
  show(successEl);

  /* Update card in DOM */
  const card = document.querySelector(`.post-card[data-id="${id}"]`);
  if (card) {
    card.querySelector('.post-card-title').textContent = capitalise(updated.title);
    card.querySelector('.post-card-body').textContent  = updated.body;
  }

  setTimeout(closePostForm, 2000);
}

/* ── Delete post ── */
async function handleDeletePost(id, cardEl) {
  if (!confirmDelete()) return;

  cardEl.classList.add('deleting');

  try {
    await PostsAPI.deletePost(id);
    animateRemoveCard(cardEl);
  } catch (err) {
    cardEl.classList.remove('deleting');
    alert(`Ошибка удаления: ${err.message}`);
  }
}

function confirmDelete() {
  return window.confirm('Удалить этот пост? Это действие нельзя отменить.');
}

function animateRemoveCard(cardEl) {
  cardEl.style.transition = 'opacity 0.4s, transform 0.4s, max-height 0.4s';
  cardEl.style.opacity    = '0';
  cardEl.style.transform  = 'scale(0.95)';
  cardEl.style.maxHeight  = '0';
  cardEl.style.overflow   = 'hidden';
  cardEl.style.padding    = '0';
  setTimeout(() => cardEl.remove(), 420);
}

/* FACTS CONTROLLER */

function initFacts() {
  getEl('facts-one-btn').addEventListener('click', handleGetOneFact);
  getEl('facts-many-btn').addEventListener('click', handleGetManyFacts);
}

async function handleGetOneFact() {
  showFactsLoading();
  try {
    const fact = await FactsAPI.getRandomFact();
    renderFacts([fact]);
  } catch (err) {
    showFactsError(err.message || 'Не удалось загрузить факт');
  }
}

async function handleGetManyFacts() {
  showFactsLoading();
  try {
    const facts = await FactsAPI.getFacts(5);
    renderFacts(facts);
  } catch (err) {
    showFactsError(err.message || 'Не удалось загрузить факты');
  }
}

function showFactsLoading() {
  hide(getEl('facts-placeholder'));
  hide(getEl('facts-error'));
  hide(getEl('facts-result'));
  show(getEl('facts-loading'));
}

function showFactsError(message) {
  hide(getEl('facts-loading'));
  setText('facts-error-msg', message);
  show(getEl('facts-error'));
}

function renderFacts(facts) {
  hide(getEl('facts-loading'));
  hide(getEl('facts-error'));
  hide(getEl('facts-placeholder'));

  const container = getEl('facts-result');
  container.innerHTML = '';

  facts.forEach((fact, index) => {
    container.appendChild(createFactCard(fact, index));
  });

  show(container);
}

function createFactCard(fact, index) {
  const icons = ['🐱', '🐾', '😸', '🐈', '😺'];
  const div   = document.createElement('div');
  div.className = 'fact-card';
  div.style.animationDelay = `${index * 0.07}s`;

  const icon = document.createElement('span');
  icon.className = 'fact-icon';
  icon.textContent = icons[index % icons.length];

  const content = document.createElement('div');

  const text = document.createElement('p');
  text.className   = 'fact-text';
  text.textContent = fact.text;

  const meta = document.createElement('p');
  meta.className   = 'fact-meta';
  meta.textContent = `${fact.length} символов`;

  content.appendChild(text);
  content.appendChild(meta);
  div.appendChild(icon);
  div.appendChild(content);
  return div;
}

/*UTILITIES*/

function capitalise(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/*  BOOTSTRAP */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initWeather();
  initPosts();
  initFacts();
});
