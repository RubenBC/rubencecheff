// ═══════════════════════════════════════
//   CONSTANTES
// ═══════════════════════════════════════
const ADMIN_PASSWORD = 'chef2024';

const CATEGORIES = ['Todas', 'Carnes', 'Pescados', 'Postres', 'Salsas y fondos', 'Ensaladas'];

const CAT_TAG = {
  'Carnes':          'tag-carnes',
  'Pescados':        'tag-pescados',
  'Postres':         'tag-postres',
  'Salsas y fondos': 'tag-salsas',
  'Ensaladas':       'tag-ensaladas',
};

const DIFF_TAG = {
  'Fácil': 'tag-facil',
  'Media': 'tag-media',
  'Alta':  'tag-alta',
};

// ═══════════════════════════════════════
//   DATOS DE EJEMPLO
// ═══════════════════════════════════════
const INITIAL_RECIPES = [
  {
    id: 'r1', name: 'Solomillo al Pedro Ximénez',
    category: 'Carnes', servings: 4, time: 35, difficulty: 'Media',
    photo: '', // URL de foto (Supabase Storage cuando esté listo)
    description: 'Solomillo de ternera con reducción de vino dulce y guarnición de patata panadera.',
    ingredients: [
      { id: 'i1', name: 'Solomillo de ternera',      amount: 800, unit: 'g'   },
      { id: 'i2', name: 'Pedro Ximénez',             amount: 200, unit: 'ml'  },
      { id: 'i3', name: 'Caldo de carne',            amount: 300, unit: 'ml'  },
      { id: 'i4', name: 'Mantequilla',               amount: 40,  unit: 'g'   },
      { id: 'i5', name: 'Chalota',                   amount: 3,   unit: 'uds' },
      { id: 'i6', name: 'Aceite de oliva',           amount: 30,  unit: 'ml'  },
    ],
    steps: [
      'Salpimentar el solomillo y marcar en plancha muy caliente 2 min por cada lado.',
      'Pochar la chalota finamente picada hasta que esté transparente.',
      'Añadir el Pedro Ximénez y reducir a la mitad a fuego medio.',
      'Incorporar el caldo de carne y reducir hasta conseguir una salsa napante.',
      'Montar la salsa fuera del fuego añadiendo la mantequilla fría en dados.',
      'Terminar el solomillo en horno a 180°C durante 8 minutos (punto medio).',
      'Reposar 3 minutos antes de cortar y emplatar con la salsa.',
    ],
  },
  {
    id: 'r2', name: 'Lubina a la sal',
    category: 'Pescados', servings: 2, time: 45, difficulty: 'Fácil',
    photo: '',
    description: 'Lubina entera cocida en costra de sal con aceite de hierbas.',
    ingredients: [
      { id: 'i1', name: 'Lubina entera (limpia)',          amount: 1,    unit: 'uds'  },
      { id: 'i2', name: 'Sal gorda',                       amount: 1500, unit: 'g'    },
      { id: 'i3', name: 'Clara de huevo',                  amount: 2,    unit: 'uds'  },
      { id: 'i4', name: 'Aceite de oliva virgen extra',    amount: 50,   unit: 'ml'   },
      { id: 'i5', name: 'Tomillo fresco',                  amount: 3,    unit: 'ramas'},
      { id: 'i6', name: 'Limón',                           amount: 1,    unit: 'uds'  },
    ],
    steps: [
      'Mezclar la sal gorda con las claras hasta obtener una masa húmeda.',
      'Cubrir la base de la bandeja con una capa de sal de 1 cm.',
      'Colocar la lubina con el tomillo en el interior.',
      'Cubrir completamente con el resto de la sal.',
      'Hornear a 200°C durante 25 minutos.',
      'Romper la costra en mesa y retirar la piel.',
      'Aliñar con aceite de oliva y unas gotas de limón.',
    ],
  },
  {
    id: 'r3', name: 'Crema Catalana',
    category: 'Postres', servings: 6, time: 40, difficulty: 'Fácil',
    photo: '',
    description: 'Crema pastelera especiada con costra de azúcar caramelizada.',
    ingredients: [
      { id: 'i1', name: 'Leche entera',       amount: 1000, unit: 'ml'  },
      { id: 'i2', name: 'Yemas de huevo',     amount: 8,    unit: 'uds' },
      { id: 'i3', name: 'Azúcar',             amount: 200,  unit: 'g'   },
      { id: 'i4', name: 'Maicena',            amount: 40,   unit: 'g'   },
      { id: 'i5', name: 'Piel de limón',      amount: 1,    unit: 'uds' },
      { id: 'i6', name: 'Rama de canela',     amount: 1,    unit: 'uds' },
      { id: 'i7', name: 'Azúcar para quemar', amount: 60,   unit: 'g'   },
    ],
    steps: [
      'Calentar la leche con la piel de limón y la canela, retirar antes de hervir.',
      'Batir las yemas con el azúcar hasta blanquear y añadir la maicena tamizada.',
      'Incorporar la leche colada sobre la mezcla de yemas poco a poco.',
      'Cocinar a fuego medio sin dejar de remover hasta que espese (82°C).',
      'Distribuir en cazuelitas y enfriar mínimo 2 horas en nevera.',
      'Espolvorear azúcar y quemar con soplete justo antes de servir.',
    ],
  },
  {
    id: 'r4', name: 'Fondo Oscuro de Ternera',
    category: 'Salsas y fondos', servings: 10, time: 240, difficulty: 'Alta',
    photo: '',
    description: 'Base esencial de cocina, fondo oscuro concentrado para salsas y estofados.',
    ingredients: [
      { id: 'i1', name: 'Huesos de ternera',    amount: 2000, unit: 'g'   },
      { id: 'i2', name: 'Cebolla',              amount: 300,  unit: 'g'   },
      { id: 'i3', name: 'Zanahoria',            amount: 200,  unit: 'g'   },
      { id: 'i4', name: 'Apio',                 amount: 100,  unit: 'g'   },
      { id: 'i5', name: 'Tomate concentrado',   amount: 50,   unit: 'g'   },
      { id: 'i6', name: 'Vino tinto',           amount: 300,  unit: 'ml'  },
      { id: 'i7', name: 'Bouquet garni',        amount: 1,    unit: 'uds' },
      { id: 'i8', name: 'Agua fría',            amount: 3000, unit: 'ml'  },
    ],
    steps: [
      'Rustir los huesos en horno a 220°C hasta que estén bien dorados (45 min).',
      'Dorar la verdura cortada en mirepoix con aceite.',
      'Añadir el tomate concentrado y cocinar 5 min hasta que caramelice.',
      'Incorporar los huesos y desglasar con el vino tinto.',
      'Cubrir con agua fría y llevar a ebullición retirando impurezas.',
      'Añadir el bouquet garni y cocinar a fuego mínimo 4 horas.',
      'Colar, desengrasar en frío y reducir hasta la consistencia deseada.',
    ],
  },
  {
    id: 'r5', name: 'Ensalada Niçoise',
    category: 'Ensaladas', servings: 4, time: 25, difficulty: 'Fácil',
    photo: '',
    description: 'Ensalada clásica francesa con atún, huevo y anchoas sobre base de judías verdes.',
    ingredients: [
      { id: 'i1', name: 'Atún en aceite de oliva',      amount: 240, unit: 'g'      },
      { id: 'i2', name: 'Judías verdes',                amount: 300, unit: 'g'      },
      { id: 'i3', name: 'Huevos',                       amount: 4,   unit: 'uds'   },
      { id: 'i4', name: 'Tomates cherry',               amount: 200, unit: 'g'      },
      { id: 'i5', name: 'Anchoas en salazón',           amount: 8,   unit: 'filetes'},
      { id: 'i6', name: 'Aceitunas negras',             amount: 80,  unit: 'g'      },
      { id: 'i7', name: 'Mostaza de Dijon',             amount: 10,  unit: 'g'      },
      { id: 'i8', name: 'Vinagre de vino blanco',       amount: 20,  unit: 'ml'     },
      { id: 'i9', name: 'Aceite de oliva virgen extra', amount: 60,  unit: 'ml'     },
    ],
    steps: [
      'Cocer las judías en agua salada 4 minutos y enfriar en agua con hielo.',
      'Cocer los huevos 9 minutos, pelar y cortar en cuartos.',
      'Emulsionar la mostaza con el vinagre y añadir el aceite en hilo.',
      'Disponer las judías como base en la fuente de servicio.',
      'Colocar el atún desmenuzado, huevos, cherry y aceitunas.',
      'Decorar con anchoas y aliñar con la vinagreta al final.',
    ],
  },
];

// ═══════════════════════════════════════
//   ESTADO
// ═══════════════════════════════════════
let recipes  = JSON.parse(localStorage.getItem('cb_recipes')  || 'null') || INITIAL_RECIPES;
let comments = JSON.parse(localStorage.getItem('cb_comments') || '[]');
let isAdmin  = false;
let currentFilter     = 'Todas';
let currentPage       = 'recipes';
let currentRecipeId   = null;
let currentMultiplier = 1;
let editorMode        = null; // 'add' | 'edit'
let editorData        = null;
let commentRecipeId   = null;

// ─── Persistencia local ───────────────
function save() {
  localStorage.setItem('cb_recipes',  JSON.stringify(recipes));
  localStorage.setItem('cb_comments', JSON.stringify(comments));
}

// ═══════════════════════════════════════
//   NAVEGACIÓN
// ═══════════════════════════════════════
function showPage(page, btn) {
  exitInnerView();
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(page + 'Page').classList.add('active');
  if (btn) btn.classList.add('active');
  else document.getElementById('nav-' + page)?.classList.add('active');
  currentPage = page;
  document.getElementById('searchSection').style.display = page === 'recipes' ? '' : 'none';
  document.getElementById('adminAddRow').style.display   = (page === 'recipes' && isAdmin) ? '' : 'none';
  if (page === 'converter') initConverter();
  if (page === 'admin')     renderAdmin();
}

function showDetail(id) {
  currentRecipeId = id;
  currentMultiplier = 1;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('detailPage').classList.add('active');
  document.getElementById('searchSection').style.display = 'none';
  document.getElementById('adminAddRow').style.display   = 'none';
  document.getElementById('mainNav').style.display       = 'none';
  renderDetail();
}

function exitInnerView() {
  document.getElementById('mainNav').style.display       = '';
  document.getElementById('searchSection').style.display = '';
}

function backToRecipes() {
  exitInnerView();
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('recipesPage').classList.add('active');
  document.getElementById('nav-recipes').classList.add('active');
  document.getElementById('adminAddRow').style.display = isAdmin ? '' : 'none';
  currentPage = 'recipes';
}

// ═══════════════════════════════════════
//   CHIPS / FILTROS
// ═══════════════════════════════════════
function initChips() {
  document.getElementById('chipsRow').innerHTML = CATEGORIES.map(c =>
    `<button class="chip ${c === currentFilter ? 'active' : ''}" onclick="setFilter('${c}')">${c}</button>`
  ).join('');
}

function setFilter(cat) {
  currentFilter = cat;
  initChips();
  renderRecipes();
}

// ═══════════════════════════════════════
//   LISTA DE RECETAS
// ═══════════════════════════════════════
function renderRecipes() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const filtered = recipes.filter(r =>
    (currentFilter === 'Todas' || r.category === currentFilter) &&
    r.name.toLowerCase().includes(q)
  );

  const list = document.getElementById('recipeList');

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state">
      <span class="material-symbols-outlined">search_off</span>
      No se encontraron recetas
    </div>`;
    return;
  }

  list.innerHTML = filtered.map(r => `
    <div class="recipe-card" onclick="showDetail('${r.id}')">
      ${r.photo
        ? `<img class="recipe-card-img" src="${r.photo}" alt="${r.name}" loading="lazy">`
        : `<div class="recipe-card-img-placeholder">
             <span class="material-symbols-outlined">restaurant</span>
           </div>`
      }
      <div class="recipe-card-body">
        <div class="recipe-card-meta">
          <span class="tag ${CAT_TAG[r.category] || ''}">${r.category}</span>
          <span class="tag ${DIFF_TAG[r.difficulty] || ''}">${r.difficulty}</span>
        </div>
        <h3>${r.name}</h3>
        <p>${r.description}</p>
        <div class="recipe-card-footer">
          <span><span class="material-symbols-outlined">timer</span>${r.time} min</span>
          <span><span class="material-symbols-outlined">group</span>${r.servings} raciones</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════
//   DETALLE DE RECETA
// ═══════════════════════════════════════
function renderDetail() {
  const r = recipes.find(x => x.id === currentRecipeId);
  if (!r) return;
  const m = currentMultiplier;

  const mBtns = [0.5, 1, 2, 3, 4].map(x =>
    `<button class="chip ${m === x ? 'active' : ''}" onclick="setMultiplier(${x})">${x === 0.5 ? '½' : '×' + x}</button>`
  ).join('');

  const ings = r.ingredients.map(ing => {
    const v = ing.amount * m;
    return `<div class="ing-row">
      <span class="ing-name">${ing.name}</span>
      <span class="ing-amount">${v % 1 === 0 ? v : v.toFixed(1)} ${ing.unit}</span>
    </div>`;
  }).join('');

  const steps = r.steps.map((s, i) =>
    `<div class="step-row">
      <div class="step-num">${i + 1}</div>
      <div class="step-text">${s}</div>
    </div>`
  ).join('');

  const adminBtns = isAdmin ? `
    <button class="btn-pill" onclick="openEditRecipe()">
      <span class="material-symbols-outlined" style="font-size:16px;">edit</span> Editar
    </button>
    <button class="btn-pill danger" onclick="deleteRecipe('${r.id}')">
      <span class="material-symbols-outlined" style="font-size:16px;">delete</span>
    </button>
  ` : '';

  const photoHtml = r.photo
    ? `<img class="detail-img" src="${r.photo}" alt="${r.name}">`
    : `<div class="detail-img-placeholder">
         <span class="material-symbols-outlined">restaurant</span>
       </div>`;

  document.getElementById('detailPage').innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; flex-wrap:wrap; gap:8px;">
      <button class="back-btn" onclick="backToRecipes()">
        <span class="material-symbols-outlined">arrow_back</span> Volver
      </button>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <button class="btn-pill ghost" onclick="openCommentModal('${r.id}','${r.name.replace(/'/g, "\\'")}')">
          <span class="material-symbols-outlined" style="font-size:16px;">report</span> Reportar error
        </button>
        ${adminBtns}
      </div>
    </div>

    ${photoHtml}

    <div class="card">
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
        <span class="tag ${CAT_TAG[r.category] || ''}">${r.category}</span>
        <span class="tag ${DIFF_TAG[r.difficulty] || ''}">${r.difficulty}</span>
      </div>
      <h2 style="font-size:22px; margin-bottom:6px;">${r.name}</h2>
      <p style="font-size:14px; color:var(--text2); line-height:1.5;">${r.description}</p>
      <div class="stat-row">
        <div class="stat-item">
          <span class="material-symbols-outlined">timer</span>
          <div><div class="stat-item-val">${r.time} min</div><div class="stat-item-lbl">Tiempo</div></div>
        </div>
        <div class="stat-item">
          <span class="material-symbols-outlined">group</span>
          <div><div class="stat-item-val">${r.servings * m}</div><div class="stat-item-lbl">Raciones</div></div>
        </div>
      </div>
    </div>

    <div class="multiplier-card">
      <div class="multiplier-label">
        <span class="material-symbols-outlined">scale</span>
        Ajustar cantidades
        ${m !== 1 ? `<span style="font-size:13px; color:var(--primary)">(×${m})</span>` : ''}
      </div>
      <div class="multiplier-row">
        ${mBtns}
        <input type="number" min="0.1" step="0.5" value="${m}"
          onchange="setMultiplier(parseFloat(this.value) || 1)">
      </div>
    </div>

    <div class="card">
      <div class="section-title">
        <span class="material-symbols-outlined">grocery</span> Ingredientes
      </div>
      ${ings}
    </div>

    <div class="card">
      <div class="section-title">
        <span class="material-symbols-outlined">format_list_numbered</span> Elaboración
      </div>
      ${steps}
    </div>
  `;
}

function setMultiplier(m) {
  currentMultiplier = m;
  renderDetail();
}

// ═══════════════════════════════════════
//   COMENTARIOS
// ═══════════════════════════════════════
function openCommentModal(id, name) {
  commentRecipeId = id;
  document.getElementById('commentRecipeName').textContent = name;
  document.getElementById('commentInput').value = '';
  document.getElementById('commentFormArea').style.display = '';
  document.getElementById('commentSuccess').style.display  = 'none';
  document.getElementById('commentModal').style.display    = 'flex';
}

function sendComment() {
  const text = document.getElementById('commentInput').value.trim();
  if (!text) return;
  const r = recipes.find(x => x.id === commentRecipeId);
  comments.push({
    id:         Date.now().toString(),
    recipeId:   commentRecipeId,
    recipeName: r ? r.name : '',
    text,
    date:       new Date().toLocaleDateString('es-ES'),
    resolved:   false,
  });
  save();
  updateBadges();
  document.getElementById('commentFormArea').style.display = 'none';
  document.getElementById('commentSuccess').style.display  = '';
  setTimeout(() => closeModal('commentModal'), 2200);
}

// ═══════════════════════════════════════
//   ADMIN / LOGIN
// ═══════════════════════════════════════
function toggleAdmin() {
  if (isAdmin) {
    isAdmin = false;
    document.getElementById('adminBtn').innerHTML =
      `<span class="material-symbols-outlined" style="font-size:16px;">lock</span> Admin`;
    document.getElementById('adminAddRow').style.display = 'none';
    showToast('Sesión cerrada');
  } else {
    document.getElementById('loginInput').value = '';
    document.getElementById('loginError').style.display = 'none';
    document.getElementById('loginModal').style.display = 'flex';
  }
}

function doLogin() {
  if (document.getElementById('loginInput').value === ADMIN_PASSWORD) {
    isAdmin = true;
    closeModal('loginModal');
    document.getElementById('adminBtn').innerHTML =
      `<span class="material-symbols-outlined" style="font-size:16px;">person</span> Chef
       <span class="material-symbols-outlined" style="font-size:14px;">logout</span>`;
    if (currentPage === 'recipes') document.getElementById('adminAddRow').style.display = '';
    showToast('Bienvenido, Chef 👨‍🍳');
    if (currentRecipeId) renderDetail();
  } else {
    document.getElementById('loginError').style.display = '';
  }
}

function renderAdmin() {
  const pending  = comments.filter(c => !c.resolved);
  const resolved = comments.filter(c =>  c.resolved);

  document.getElementById('adminStats').innerHTML = `
    <div class="stat-card">
      <span class="material-symbols-outlined">menu_book</span>
      <div class="stat-card-num">${recipes.length}</div>
      <div class="stat-card-lbl">Recetas</div>
    </div>
    <div class="stat-card">
      <span class="material-symbols-outlined">mark_chat_unread</span>
      <div class="stat-card-num">${pending.length}</div>
      <div class="stat-card-lbl">Pendientes</div>
    </div>
    <div class="stat-card">
      <span class="material-symbols-outlined">check_circle</span>
      <div class="stat-card-num">${resolved.length}</div>
      <div class="stat-card-lbl">Resueltos</div>
    </div>
  `;

  document.getElementById('pendingTitle').innerHTML =
    `<span class="material-symbols-outlined">inbox</span>
     Comentarios pendientes
     ${pending.length > 0 ? '<span class="badge">' + pending.length + '</span>' : ''}`;

  document.getElementById('commentsList').innerHTML = pending.length === 0
    ? `<div class="card" style="text-align:center; padding:24px; color:var(--text2);">
        <span class="material-symbols-outlined" style="font-size:40px; color:var(--primary); display:block; margin-bottom:8px;">check_circle</span>
        Sin comentarios pendientes
       </div>`
    : pending.map(c => `
        <div class="comment-card">
          <div style="flex:1;">
            <div class="comment-recipe">${c.recipeName}</div>
            <div class="comment-text">${c.text}</div>
            <div class="comment-date">${c.date}</div>
          </div>
          <button class="btn-pill" onclick="resolveComment('${c.id}')">
            <span class="material-symbols-outlined" style="font-size:15px;">check</span> Resolver
          </button>
        </div>`).join('');

  document.getElementById('resolvedSection').innerHTML = resolved.length === 0 ? '' : `
    <div class="section-title" style="margin-top:8px;">
      <span class="material-symbols-outlined">task_alt</span> Resueltos
    </div>
    ${resolved.map(c => `
      <div class="comment-card" style="opacity:0.55;">
        <div>
          <div class="comment-recipe">${c.recipeName} ✓</div>
          <div class="comment-text" style="font-size:13px;">${c.text}</div>
        </div>
      </div>`).join('')}
  `;
}

function resolveComment(id) {
  comments = comments.map(c => c.id === id ? { ...c, resolved: true } : c);
  save();
  updateBadges();
  renderAdmin();
}

function updateBadges() {
  const n = comments.filter(c => !c.resolved).length;
  const nb = document.getElementById('navBadge');
  const tb = document.getElementById('commentBadgeTop');
  if (n > 0) {
    nb.textContent = n; nb.style.display = '';
    tb.innerHTML = `<span class="badge">${n}</span>`; tb.style.display = '';
  } else {
    nb.style.display = 'none'; tb.style.display = 'none';
  }
}

// ═══════════════════════════════════════
//   EDITOR DE RECETA
// ═══════════════════════════════════════
function openAddRecipe() {
  editorMode = 'add';
  editorData = {
    id: Date.now().toString(), name: '', category: 'Carnes',
    servings: 4, time: 30, difficulty: 'Media',
    photo: '', description: '', ingredients: [], steps: [],
  };
  renderEditor();
  enterEditor();
}

function openEditRecipe() {
  editorMode = 'edit';
  editorData = JSON.parse(JSON.stringify(recipes.find(r => r.id === currentRecipeId)));
  renderEditor();
  enterEditor();
}

function enterEditor() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('editorPage').classList.add('active');
  document.getElementById('searchSection').style.display = 'none';
  document.getElementById('adminAddRow').style.display   = 'none';
  document.getElementById('mainNav').style.display       = 'none';
}

function renderEditor() {
  const r = editorData;
  const isNew = editorMode === 'add';

  const photoSection = `
    <div class="form-group">
      <div class="form-label">Foto del plato</div>
      ${r.photo
        ? `<img class="photo-preview" src="${r.photo}" id="photoPreview">
           <button class="btn-pill danger" onclick="removePhoto()" style="margin-bottom:8px;">
             <span class="material-symbols-outlined" style="font-size:15px;">delete</span> Quitar foto
           </button>`
        : `<div class="photo-upload-area" onclick="document.getElementById('photoInput').click()">
             <span class="material-symbols-outlined">add_photo_alternate</span>
             <p>Toca para añadir una foto</p>
             <p style="font-size:11px; margin-top:4px; opacity:0.7;">JPG, PNG · Máx. 5 MB</p>
           </div>`
      }
      <input type="file" id="photoInput" accept="image/*" style="display:none;" onchange="handlePhotoUpload(event)">
      <div class="form-group" style="margin-top:8px; margin-bottom:0;">
        <div class="form-label">O pega una URL de imagen</div>
        <input class="form-input" placeholder="https://..." value="${r.photo}"
          oninput="editorData.photo=this.value; updatePhotoPreview(this.value)">
      </div>
    </div>
  `;

  const ings = r.ingredients.map((ing, i) => `
    <div class="ing-edit-row">
      <input class="ing-edit-name" value="${ing.name}" placeholder="Ingrediente"
        oninput="editorData.ingredients[${i}].name=this.value">
      <input class="ing-edit-amount" type="number" value="${ing.amount}"
        oninput="editorData.ingredients[${i}].amount=parseFloat(this.value)||0">
      <input class="ing-edit-unit" value="${ing.unit}" placeholder="ud"
        oninput="editorData.ingredients[${i}].unit=this.value">
      <button class="btn-remove" onclick="removeIngredient(${i})">
        <span class="material-symbols-outlined" style="font-size:20px;">close</span>
      </button>
    </div>`).join('');

  const stps = r.steps.map((s, i) => `
    <div class="step-edit-row">
      <div class="step-edit-num">${i + 1}</div>
      <textarea rows="2" oninput="editorData.steps[${i}]=this.value">${s}</textarea>
      <button class="btn-remove" onclick="removeStep(${i})">
        <span class="material-symbols-outlined" style="font-size:20px;">close</span>
      </button>
    </div>`).join('');

  document.getElementById('editorPage').innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;">
      <button class="back-btn" onclick="cancelEditor()">
        <span class="material-symbols-outlined">close</span> Cancelar
      </button>
      <span style="font-size:17px; font-weight:800;">${isNew ? 'Nueva receta' : 'Editar receta'}</span>
      <button class="btn-pill filled" onclick="saveEditor()">Guardar</button>
    </div>

    <div class="card">
      ${photoSection}
      <div class="form-group">
        <div class="form-label">Nombre de la receta</div>
        <input class="form-input" value="${r.name}" placeholder="Nombre..."
          oninput="editorData.name=this.value">
      </div>
      <div class="form-group">
        <div class="form-label">Categoría</div>
        <select class="form-select" onchange="editorData.category=this.value">
          ${['Carnes','Pescados','Postres','Salsas y fondos','Ensaladas'].map(c =>
            `<option ${r.category === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="form-grid3">
        <div class="form-group">
          <div class="form-label">Raciones</div>
          <input class="form-input" type="number" value="${r.servings}"
            oninput="editorData.servings=parseInt(this.value)||1">
        </div>
        <div class="form-group">
          <div class="form-label">Tiempo (min)</div>
          <input class="form-input" type="number" value="${r.time}"
            oninput="editorData.time=parseInt(this.value)||0">
        </div>
        <div class="form-group">
          <div class="form-label">Dificultad</div>
          <select class="form-select" onchange="editorData.difficulty=this.value">
            ${['Fácil','Media','Alta'].map(d =>
              `<option ${r.difficulty === d ? 'selected' : ''}>${d}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-group">
        <div class="form-label">Descripción</div>
        <textarea class="form-textarea" rows="2"
          oninput="editorData.description=this.value">${r.description}</textarea>
      </div>
    </div>

    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div class="section-title" style="margin-bottom:0;">
          <span class="material-symbols-outlined">grocery</span> Ingredientes
        </div>
        <button class="btn-pill" onclick="addIngredient()">
          <span class="material-symbols-outlined" style="font-size:16px;">add</span> Añadir
        </button>
      </div>
      <div id="ingList">${ings}</div>
    </div>

    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div class="section-title" style="margin-bottom:0;">
          <span class="material-symbols-outlined">format_list_numbered</span> Elaboración
        </div>
        <button class="btn-pill" onclick="addStep()">
          <span class="material-symbols-outlined" style="font-size:16px;">add</span> Añadir paso
        </button>
      </div>
      <div id="stepList">${stps}</div>
    </div>
  `;
}

// ─── Foto helpers ─────────────────────
function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    editorData.photo = e.target.result;
    renderEditor();
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  editorData.photo = '';
  renderEditor();
}

function updatePhotoPreview(url) {
  // Se actualizará al guardar; aquí podría añadirse un preview en tiempo real
}

// ─── Ingredientes / Pasos ─────────────
function addIngredient() {
  editorData.ingredients.push({ id: Date.now().toString(), name: '', amount: 0, unit: 'g' });
  renderEditor();
}

function removeIngredient(i) {
  editorData.ingredients.splice(i, 1);
  renderEditor();
}

function addStep() {
  editorData.steps.push('');
  renderEditor();
}

function removeStep(i) {
  editorData.steps.splice(i, 1);
  renderEditor();
}

// ─── Guardar / Cancelar ───────────────
function saveEditor() {
  if (!editorData.name.trim()) { showToast('El nombre es obligatorio'); return; }
  if (editorMode === 'add') recipes.push(editorData);
  else recipes = recipes.map(r => r.id === editorData.id ? editorData : r);
  currentRecipeId = editorData.id;
  save();
  showToast('Receta guardada ✓');
  exitEditor();
}

function cancelEditor() { exitEditor(); }

function exitEditor() {
  exitInnerView();
  if (editorMode === 'edit') {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('detailPage').classList.add('active');
    renderDetail();
  } else {
    backToRecipes();
  }
  editorMode = null;
  editorData = null;
}

function deleteRecipe(id) {
  if (!confirm('¿Eliminar esta receta?')) return;
  recipes = recipes.filter(r => r.id !== id);
  save();
  showToast('Receta eliminada');
  backToRecipes();
}

// ═══════════════════════════════════════
//   CONVERSOR
// ═══════════════════════════════════════
const CONV_TYPES = {
  Peso: {
    units: ['g', 'kg', 'oz', 'lb'],
    toBase: { g: 1, kg: 1000, oz: 28.3495, lb: 453.592 },
  },
  Volumen: {
    units: ['ml', 'L', 'taza', 'fl oz', 'tbsp', 'tsp'],
    toBase: { ml: 1, L: 1000, taza: 236.588, 'fl oz': 29.5735, tbsp: 14.7868, tsp: 4.92892 },
  },
  Temperatura: {
    units: ['°C', '°F'],
    toBase: null,
  },
};

let convType = 'Peso';

function initConverter() {
  document.getElementById('convTypeChips').innerHTML = Object.keys(CONV_TYPES).map(t =>
    `<button class="chip ${t === convType ? 'active' : ''}" onclick="setConvType('${t}')">${t}</button>`
  ).join('');

  const units = CONV_TYPES[convType].units;
  ['convFrom', 'convTo'].forEach((id, i) => {
    const sel = document.getElementById(id);
    sel.innerHTML = units.map(u => `<option>${u}</option>`).join('');
    sel.value = units[i === 0 ? 0 : 1];
  });

  updateConverter();

  document.getElementById('tempRef').innerHTML = [
    ['Bajo',      '150°C', '300°F'],
    ['Medio',     '180°C', '356°F'],
    ['Fuerte',    '200°C', '392°F'],
    ['Muy fuerte','220°C', '428°F'],
    ['Brasa',     '240°C', '464°F'],
    ['Máximo',    '260°C', '500°F'],
  ].map(([l, c, f]) =>
    `<div class="ref-cell">
       <div class="ref-cell-lbl">${l}</div>
       <div class="ref-cell-val">${c}</div>
       <div class="ref-cell-sub">${f}</div>
     </div>`
  ).join('');
}

function setConvType(t) {
  convType = t;
  initConverter();
}

function updateConverter() {
  const val  = parseFloat(document.getElementById('convValue').value);
  const from = document.getElementById('convFrom').value;
  const to   = document.getElementById('convTo').value;
  if (isNaN(val)) { document.getElementById('convResult').textContent = '—'; return; }

  let result;
  if (convType === 'Temperatura') {
    result = from === to ? val : from === '°C' ? val * 9 / 5 + 32 : (val - 32) * 5 / 9;
  } else {
    const b = CONV_TYPES[convType].toBase;
    result = val * b[from] / b[to];
  }

  const d = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));
  document.getElementById('convResult').textContent    = d + ' ' + to;
  document.getElementById('convResultLabel').textContent = `${val} ${from} = ${d} ${to}`;
}

// ═══════════════════════════════════════
//   UTILIDADES
// ═══════════════════════════════════════
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

let toastTimer = null;
function showToast(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  if (toastTimer) clearTimeout(toastTimer);
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  toastTimer = setTimeout(() => t.remove(), 2800);
}

// ═══════════════════════════════════════
//   INIT
// ═══════════════════════════════════════
initChips();
renderRecipes();
updateBadges();
