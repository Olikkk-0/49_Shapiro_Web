"use strict";


//  БАЗОВЫЙ КЛАСС  

class Card {
  #id; #name; #rarity; #hp; #dmg; #dps;
  #atkSpd; #target; #duration; #desc; #elixir;
  #imageData; #isPreset;

  constructor({ id, name, rarity, hp, dmg, dps, atkSpd,
                target, duration, desc, elixir, imageData, isPreset }) {
    this.#id        = id        ?? `card-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    this.#name      = name      ?? 'Без названия';
    this.#rarity    = rarity    ?? 'common';
    this.#hp        = Number(hp)    || 0;
    this.#dmg       = Number(dmg)   || 0;
    this.#dps       = Number(dps)   || 0;
    this.#atkSpd    = Number(atkSpd)|| 0;
    this.#target    = target    ?? '';
    this.#duration  = (duration === '' || duration == null) ? null : Number(duration);
    this.#desc      = desc      ?? '';
    this.#elixir    = Number(elixir)|| 3;
    this.#imageData = imageData ?? '';
    this.#isPreset  = !!isPreset;
  }

  // Геттеры
  get id()        { return this.#id; }
  get name()      { return this.#name; }
  get rarity()    { return this.#rarity; }
  get hp()        { return this.#hp; }
  get dmg()       { return this.#dmg; }
  get dps()       { return this.#dps; }
  get atkSpd()    { return this.#atkSpd; }
  get target()    { return this.#target; }
  get duration()  { return this.#duration; }
  get desc()      { return this.#desc; }
  get elixir()    { return this.#elixir; }
  get imageData() { return this.#imageData; }
  get isPreset()  { return this.#isPreset; }

  // Сеттеры
  set name(v)      { this.#name = v; }
  set rarity(v)    { this.#rarity = v; }
  set hp(v)        { this.#hp = Number(v) || 0; }
  set dmg(v)       { this.#dmg = Number(v) || 0; }
  set dps(v)       { this.#dps = Number(v) || 0; }
  set atkSpd(v)    { this.#atkSpd = Number(v) || 0; }
  set target(v)    { this.#target = v; }
  set duration(v)  { this.#duration = (v === '' || v == null) ? null : Number(v); }
  set desc(v)      { this.#desc = v; }
  set elixir(v)    { this.#elixir = Number(v) || 3; }
  set imageData(v) { this.#imageData = v; }

  // Полиморфные — переопределяются в подклассах
  get type()      { return 'card'; }
  get typeLabel() { return 'Карта'; }
  get icon()      { return '🃏'; }

  // HTML-представление карты
  toHTML(editMode = false) {
    const RARITY_LABEL = {
      common: 'Обычная', rare: 'Редкая', epic: 'Эпическая',
      legendary: 'Легендарная', champion: 'Чемпион'
    };

    // Фото-зона
    const photoContent = this.#imageData
      ? `<img src="${this.#imageData}" alt="${this.#name}" loading="lazy"/>`
      : `<span class="photo-placeholder">${this.icon}</span>`;

    // Эликсир — картинка-капля + цифра
    const elixirBadge = `
      <div class="elixir-badge">
        <img src="img/elicsir.webp" alt="эликсир"/>
        <span>${this.#elixir}</span>
      </div>`;

    // Характеристики
    const stats = this._buildStats();

    const editBarClass = editMode ? 'card-edit-bar visible' : 'card-edit-bar';
    const deleteBtn = this.#isPreset ? '' :
      `<button class="btn-delete" onclick="deleteCard('${this.#id}')">🗑 Удалить</button>`;

    return `
      <article class="card${this.#isPreset ? ' preset' : ''}"
               data-id="${this.#id}"
               data-rarity="${this.#rarity}"
               style="animation-delay:${(Math.random() * .3).toFixed(2)}s">
        <div class="card-photo">
          ${photoContent}
          ${elixirBadge}
          <div class="rarity-badge">${RARITY_LABEL[this.#rarity] ?? this.#rarity}</div>
        </div>
        <div class="card-caption">
          <div class="card-name">${this.#name}</div>
          <div class="card-type-label">${this.typeLabel}</div>
          <div class="card-stats">${stats}</div>
          ${this.#desc ? `<p class="card-desc">${this.#desc}</p>` : ''}
        </div>
        <div class="${editBarClass}">
          <button class="btn-edit" onclick="openEditModal('${this.#id}')">✏️ Изменить</button>
          ${deleteBtn}
        </div>
      </article>`;
  }

  // Строки характеристик — переопределяется в подклассах
  _buildStats() {
    const rows = [];
    if (this.#hp    > 0) rows.push(stat('❤️ Здоровье',    this.#hp));
    if (this.#dmg   > 0) rows.push(stat('⚔️ Урон',         this.#dmg));
    if (this.#dps   > 0) rows.push(stat('💥 Урон/с',       this.#dps));
    if (this.#atkSpd> 0) rows.push(stat('⏱ Ск. атаки',    `${this.#atkSpd} с`));
    rows.push(stat('🎯 Цель', this.#target));
    if (this.#duration != null) rows.push(stat('⌛ Время', `${this.#duration} с`));
    return rows.join('');
  }

  toJSON() {
    return {
      id: this.id, type: this.type, name: this.name, rarity: this.rarity,
      hp: this.hp, dmg: this.dmg, dps: this.dps, atkSpd: this.atkSpd,
      target: this.target, duration: this.duration, desc: this.desc,
      elixir: this.elixir, imageData: this.imageData, isPreset: this.isPreset
    };
  }
}

// Хелпер одной характеристики
function stat(label, value) {
  return `<div class="stat"><div class="stat-label">${label}</div><div class="stat-value">${value}</div></div>`;
}


//  ПОДКЛАССЫ

class TroopCard extends Card {
  get type()      { return 'troop'; }
  get typeLabel() { return 'Воин'; }
  get icon()      { return '⚔️'; }
}

class SpellCard extends Card {
  get type()      { return 'spell'; }
  get typeLabel() { return 'Заклинание'; }
  get icon()      { return '✨'; }
  // У заклинания нет здоровья и скорости атаки
  _buildStats() {
    const rows = [];
    if (this.dmg > 0) rows.push(stat('💥 Урон', this.dmg));
    rows.push(stat('🎯 Цель', this.target));
    if (this.duration != null) rows.push(stat('⌛ Время', `${this.duration} с`));
    return rows.join('');
  }
}

class BuildingCard extends Card {
  get type()      { return 'building'; }
  get typeLabel() { return 'Строение'; }
  get icon()      { return '🏰'; }
}



function cardFromData(data) {
  const MAP = { troop: TroopCard, spell: SpellCard, building: BuildingCard };
  return new (MAP[data.type] ?? TroopCard)(data);
}


//  НАЧАЛЬНЫЕ КАРТЫ

const PRESET_DATA = [
  {
    id: 'p-pekka', type: 'troop', name: 'П.Е.К.К.А', isPreset: true,
    rarity: 'epic', hp: 3434, dmg: 554, dps: 231, atkSpd: 2.4,
    target: 'Земля', duration: null, elixir: 7,
    desc: 'Медленная, но смертоносная машина в тяжёлой броне.',
    imageData: 'img/PEKKA..webp'
  },
  {
    id: 'p-fireball', type: 'spell', name: 'Огненный шар', isPreset: true,
    rarity: 'rare', hp: 0, dmg: 900, dps: 0, atkSpd: 0,
    target: 'Земля и воздух', duration: null, elixir: 4,
    desc: 'Наносит большой урон по области. Хорош против зданий.',
    imageData: 'img/fireball.webp'
  },
  {
    id: 'p-musketeer', type: 'troop', name: 'Мушкетёр', isPreset: true,
    rarity: 'rare', hp: 714, dmg: 300, dps: 150, atkSpd: 2.0,
    target: 'Земля и воздух', duration: null, elixir: 4,
    desc: 'Дальнобойный юнит. Умеет сбивать воздушные цели.',
    imageData: 'img/mushketer.webp'
  },
  {
    id: 'p-inferno', type: 'building', name: 'Адская башня', isPreset: true,
    rarity: 'rare', hp: 1400, dmg: 100, dps: 100, atkSpd: 0,
    target: 'Земля', duration: null, elixir: 5,
    desc: 'Луч с нарастающим уроном. Кошмар для «тяжёлых» карт.',
    imageData: 'img/adskaya.webp'
  },
  {
    id: 'p-lightning', type: 'spell', name: 'Молния', isPreset: true,
    rarity: 'epic', hp: 0, dmg: 897, dps: 0, atkSpd: 0,
    target: 'Земля и воздух', duration: null, elixir: 6,
    desc: 'Поражает трёх врагов с наибольшим запасом HP.',
    imageData: 'img/molniya.webp'
  },
  {
    id: 'p-prizrak', type: 'troop', name: 'Королевский призрак', isPreset: true,
    rarity: 'legendary', hp: 1600, dmg: 345, dps: 191, atkSpd: 1.6,
    target: 'Земля', duration: null, elixir: 3,
    desc: 'Незаметно парит над ареной, пока его не напугает кто-нибудь из врагов. Тогда он бросается в бой! А потом снова становится невидимым. Эй, где ты?',
    imageData: 'img/prizrak.webp'
  },
  {
    id: 'p-valka', type: 'troop', name: 'Валькирия', isPreset: true,
    rarity: 'rare', hp: 2529, dmg: 354, dps: 236, atkSpd: 1.4,
    target: 'Земля', duration: null, elixir: 4,
    desc: 'Суровый воин ближнего боя, наносящий урон вокруг себя. Толпа, орда, рать? Не проблема! Она порвет всех на кусочки парой движений.',
    imageData: 'img/valka.webp'
  },
  {
    id: 'p-gkop', type: 'troop', name: 'Гоблиныы-копейщики', isPreset: true,
    rarity: 'common', hp: 193, dmg: 119, dps: 70, atkSpd: 1.7,
    target: 'Земля и воздух', duration: null, elixir: 2,
    desc: 'Три незащищённых воина дальнего боя. Кто вообще учил этих ребят метать копья?! Кто сказал, что это хорошая идея?!',
    imageData: 'img/gkop.webp'
  },
  {
    id: 'p-sparki', type: 'troop', name: 'Спарки', isPreset: true,
    rarity: 'legendary', hp: 2112, dmg: 1936, dps: 440, atkSpd: 4,
    target: 'Земля', duration: null, elixir: 6,
    desc: 'Cпарки атакует медленно, но её удар наносит ОГРОМНЫЙ урон. Ей незнакомо слово "переусердствовать".',
    imageData: 'img/sparki.webp'
  },
  {
    id: 'p-glbanda', type: 'troop', name: 'Главная бандитка', isPreset: true,
    rarity: 'champion', hp: 2880, dmg: 269, dps: 244, atkSpd: 1.1,
    target: 'Земля', duration: null, elixir: 6,
    desc: 'Предводительница лесной банды показала свое лицо... Ну, частично. Главная бандитка делает рывок к цели, во время которого она становится неуязвимой. На крайний случай у неё под рукой всегда есть пара дымовых шашек.',
    imageData: 'img/BossBanditCard.webp'
  }
];


//  СОСТОЯНИЕ

const STORAGE_KEY = 'cr_deck_v1';
let cards    = [];
let editMode = false;


//  ХРАНИЛИЩЕ

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards.map(c => c.toJSON())));
}
function loadFromStorage() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}
function initCards() {
  const saved = loadFromStorage();
  cards = (saved && saved.length)
    ? saved.map(d => cardFromData(d))
    : PRESET_DATA.map(d => cardFromData(d));
}


//  СБОРКА ВСЕГО <body>

function buildPage() {
  // Карточки
  const cardsHTML = cards.map(c => c.toHTML(editMode)).join('');

  document.body.innerHTML = `
    <!-- HEADER -->
    <header>
      <div class="header-inner">
        <div class="logo">
          <span class="logo-crown">♛</span>
          <span class="logo-title">CLASH ROYALE</span>
        </div>
        <label class="edit-toggle" aria-label="Режим редактирования">
          <input type="checkbox" id="editToggle" ${editMode ? 'checked' : ''}/>
          <span class="toggle-track"><span class="toggle-thumb"></span></span>
          <span class="toggle-label">Редактирование</span>
        </label>
      </div>
    </header>

    <!-- MAIN -->
    <main>
      <section class="cards-section" aria-label="Карты колоды">
        <div class="section-top">
          <h1 class="section-title">Моя колода</h1>
          <button class="btn-add" id="addCardBtn"
            style="display:${editMode ? 'inline-block' : 'none'}"
            onclick="openAddModal()">＋ Добавить</button>
        </div>
        <div class="cards-grid">${cardsHTML}</div>
      </section>
    </main>

    <!-- FOOTER -->
    <footer>
      <span>♛ Clash Royale Fan Deck - Лабораторная работа 5. Шапиро Ольга КС-26</span>
    </footer>

    <!-- РЕДАКТИРОВАНИЕ -->
    <div class="modal-overlay" id="editModal">
      <div class="modal">
        <div class="modal-header">
          <h2 id="modalTitle">Редактировать карту</h2>
          <button class="modal-close" onclick="closeModal('editModal')">✕</button>
        </div>
        <form class="modal-form" onsubmit="saveCard(event)">
          <input type="hidden" id="editCardId"/>
          <div class="upload-area" id="editUploadArea"
               onclick="document.getElementById('editImageFile').click()">
            <img id="editPreviewImg" src="" alt="" style="display:none"/>
            <span class="upload-hint" id="editUploadHint">📷 Нажмите для выбора фото</span>
            <input type="file" id="editImageFile" accept="image/*" style="display:none"
                   onchange="previewImage('editImageFile','editPreviewImg','editUploadHint')"/>
          </div>
          <div class="form-row">
            <label>Название<input type="text" id="editName" required/></label>
            <label>Тип
              <select id="editType">
                <option value="troop">Воин</option>
                <option value="spell">Заклинание</option>
                <option value="building">Строение</option>
              </select>
            </label>
          </div>
          <div class="form-row">
            <label>Редкость
              <select id="editRarity">
                <option value="common">Обычная</option>
                <option value="rare">Редкая</option>
                <option value="epic">Эпическая</option>
                <option value="legendary">Легендарная</option>
                <option value="champion">Чемпион</option>
              </select>
            </label>
            <label>Эликсир<input type="number" id="editElixir" min="1" max="10"/></label>
          </div>
          <div class="form-row">
            <label>Здоровье<input type="number" id="editHp" min="0"/></label>
            <label>Урон<input type="number" id="editDmg" min="0"/></label>
          </div>
          <div class="form-row">
            <label>Урон/с<input type="number" id="editDps" min="0" step="0.1"/></label>
            <label>Скорость атаки (с)<input type="number" id="editAtkSpd" min="0" step="0.01"/></label>
          </div>
          <div class="form-row">
            <label>Цель
              <select id="editTarget">
                <option value="Земля">Земля</option>
                <option value="Земля и воздух">Земля и воздух</option>
                <option value="Здания">Здания</option>
                <option value="—">—</option>
              </select>
            </label>
            <label>Время действия (с)<input type="number" id="editDuration" min="0" step="0.1" placeholder="не применимо"/></label>
          </div>
          <label>Описание<textarea id="editDesc" rows="2"></textarea></label>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" onclick="closeModal('editModal')">Отмена</button>
            <button type="submit" class="btn-primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ДОБАВЛЕНИЕ -->
    <div class="modal-overlay" id="addModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Новая карта</h2>
          <button class="modal-close" onclick="closeModal('addModal')">✕</button>
        </div>
        <form class="modal-form" onsubmit="addNewCard(event)">
          <div class="upload-area" id="addUploadArea"
               onclick="document.getElementById('addImageFile').click()">
            <img id="addPreviewImg" src="" alt="" style="display:none"/>
            <span class="upload-hint" id="addUploadHint">📷 Нажмите для выбора фото</span>
            <input type="file" id="addImageFile" accept="image/*" style="display:none"
                   onchange="previewImage('addImageFile','addPreviewImg','addUploadHint')"/>
          </div>
          <div class="form-row">
            <label>Название<input type="text" id="addName" required/></label>
            <label>Тип
              <select id="addType">
                <option value="troop">Воин</option>
                <option value="spell">Заклинание</option>
                <option value="building">Строение</option>
              </select>
            </label>
          </div>
          <div class="form-row">
            <label>Редкость
              <select id="addRarity">
                <option value="common">Обычная</option>
                <option value="rare">Редкая</option>
                <option value="epic">Эпическая</option>
                <option value="legendary">Легендарная</option>
                <option value="champion">Чемпион</option>
              </select>
            </label>
            <label>Эликсир<input type="number" id="addElixir" min="1" max="10" value="3"/></label>
          </div>
          <div class="form-row">
            <label>Здоровье<input type="number" id="addHp" min="0" value="0"/></label>
            <label>Урон<input type="number" id="addDmg" min="0" value="0"/></label>
          </div>
          <div class="form-row">
            <label>Урон/с<input type="number" id="addDps" min="0" step="0.1" value="0"/></label>
            <label>Скорость атаки (с)<input type="number" id="addAtkSpd" min="0" step="0.01" value="1"/></label>
          </div>
          <div class="form-row">
            <label>Цель
              <select id="addTarget">
                <option value="Земля">Земля</option>
                <option value="Земля и воздух">Земля и воздух</option>
                <option value="Здания">Здания</option>
                <option value="—">—</option>
              </select>
            </label>
            <label>Время действия (с)<input type="number" id="addDuration" min="0" step="0.1" placeholder="не применимо"/></label>
          </div>
          <label>Описание<textarea id="addDesc" rows="2"></textarea></label>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" onclick="closeModal('addModal')">Отмена</button>
            <button type="submit" class="btn-primary">Добавить</button>
          </div>
        </form>
      </div>
    </div>
  `;


  document.getElementById('editToggle').addEventListener('change', e => {
    editMode = e.target.checked;
    buildPage();
  });
  document.querySelectorAll('.modal-overlay').forEach(el => {
    el.addEventListener('click', e => { if (e.target === el) el.classList.remove('open'); });
  });
}


//  ПРЕВЬЮ ФОТО В МОДАЛКЕ

function previewImage(inputId, imgId, hintId) {
  const file = document.getElementById(inputId).files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img  = document.getElementById(imgId);
    const hint = document.getElementById(hintId);
    img.src = e.target.result;
    img.style.display = 'block';
    hint.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

//  РЕДАКТИРОВАНИЕ

function openEditModal(cardId) {
  const card = cards.find(c => c.id === cardId);
  if (!card) return;

  document.getElementById('editCardId').value   = card.id;
  document.getElementById('editName').value     = card.name;
  document.getElementById('editType').value     = card.type;
  document.getElementById('editRarity').value   = card.rarity;
  document.getElementById('editElixir').value   = card.elixir;
  document.getElementById('editHp').value       = card.hp;
  document.getElementById('editDmg').value      = card.dmg;
  document.getElementById('editDps').value      = card.dps;
  document.getElementById('editAtkSpd').value   = card.atkSpd;
  document.getElementById('editTarget').value   = card.target;
  document.getElementById('editDuration').value = card.duration ?? '';
  document.getElementById('editDesc').value     = card.desc;
  document.getElementById('modalTitle').textContent = `Изменить: ${card.name}`;

  const img  = document.getElementById('editPreviewImg');
  const hint = document.getElementById('editUploadHint');
  if (card.imageData) {
    img.src = card.imageData;
    img.style.display = 'block';
    hint.style.display = 'none';
  } else {
    img.style.display = 'none';
    hint.style.display = '';
    document.getElementById('editImageFile').value = '';
  }

  document.getElementById('editModal').classList.add('open');
}

function saveCard(e) {
  e.preventDefault();
  const id  = document.getElementById('editCardId').value;
  const idx = cards.findIndex(c => c.id === id);
  if (idx === -1) return;

  const newType = document.getElementById('editType').value;
  if (cards[idx].type !== newType) {
    cards[idx] = cardFromData({ ...cards[idx].toJSON(), type: newType });
  }
  const c = cards[idx];
  c.name     = document.getElementById('editName').value;
  c.rarity   = document.getElementById('editRarity').value;
  c.elixir   = document.getElementById('editElixir').value;
  c.hp       = document.getElementById('editHp').value;
  c.dmg      = document.getElementById('editDmg').value;
  c.dps      = document.getElementById('editDps').value;
  c.atkSpd   = document.getElementById('editAtkSpd').value;
  c.target   = document.getElementById('editTarget').value;
  c.duration = document.getElementById('editDuration').value;
  c.desc     = document.getElementById('editDesc').value;

  const file = document.getElementById('editImageFile').files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = ev => { c.imageData = ev.target.result; saveToStorage(); buildPage(); };
    reader.readAsDataURL(file);
  } else {
    saveToStorage(); buildPage();
  }
  closeModal('editModal');
}


//  ДОБАВЛЕНИЕ

function openAddModal() {
  document.getElementById('addModal').classList.add('open');
}

function addNewCard(e) {
  e.preventDefault();
  const newCard = cardFromData({
    type:     document.getElementById('addType').value,
    name:     document.getElementById('addName').value,
    rarity:   document.getElementById('addRarity').value,
    elixir:   document.getElementById('addElixir').value,
    hp:       document.getElementById('addHp').value,
    dmg:      document.getElementById('addDmg').value,
    dps:      document.getElementById('addDps').value,
    atkSpd:   document.getElementById('addAtkSpd').value,
    target:   document.getElementById('addTarget').value,
    duration: document.getElementById('addDuration').value,
    desc:     document.getElementById('addDesc').value,
    imageData: '', isPreset: false
  });

  const file = document.getElementById('addImageFile').files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = ev => {
      newCard.imageData = ev.target.result;
      cards.push(newCard); saveToStorage(); buildPage();
    };
    reader.readAsDataURL(file);
  } else {
    cards.push(newCard); saveToStorage(); buildPage();
  }
  closeModal('addModal');
}


//  УДАЛЕНИЕ

function deleteCard(cardId) {
  const card = cards.find(c => c.id === cardId);
  if (!card || card.isPreset) return;
  if (!confirm(`Удалить карту «${card.name}»?`)) return;
  cards = cards.filter(c => c.id !== cardId);
  saveToStorage(); buildPage();
}


//  ЗАКРЫТИЕ МОДАЛОК

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}


//  СТАРТ

document.addEventListener('DOMContentLoaded', () => {
  initCards();
  buildPage();
});
