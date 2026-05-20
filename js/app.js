// ═══════════════════════════════════════
//   SUPABASE
// ═══════════════════════════════════════
const { createClient } = supabase;
const sb = createClient(
  'https://rswzirygkeyainerfzjx.supabase.co',
  'sb_publishable_Uno7xmeQJLmvtcyZvtZfQw_IkpEth_y'
);

// ═══════════════════════════════════════
//   CONSTANTES
// ═══════════════════════════════════════
const ADMIN_PASSWORD = 'chef2024';

const RECIPE_CATEGORIES = ['Todas', 'Carnes', 'Pescados', 'Postres', 'Salsas y fondos', 'Ensaladas', 'Guarniciones', 'Plato del día'];

const CAT_TAG = {
  'Carnes':          'tag-carnes',
  'Pescados':        'tag-pescados',
  'Postres':         'tag-postres',
  'Salsas y fondos': 'tag-salsas',
  'Ensaladas':       'tag-ensaladas',
  'Guarniciones':    'tag-guarniciones',
  'Plato del día':   'tag-plato',
  'Sopas y salsas':  'tag-salsas',
  'Carnes':          'tag-carnes',
  'Vegetariano':     'tag-vegetariano',
  'Coulis':          'tag-coulis',
  'Vinagreta':       'tag-vinagreta',
};

const ALLERGENS = [
  { id: 'gluten',     label: 'Gluten',           emoji: '🌾' },
  { id: 'crustaceos', label: 'Crustáceos',        emoji: '🦐' },
  { id: 'huevo',      label: 'Huevo',             emoji: '🥚' },
  { id: 'pescado',    label: 'Pescado',            emoji: '🐟' },
  { id: 'cacahuetes', label: 'Cacahuetes',         emoji: '🥜' },
  { id: 'soja',       label: 'Soja',              emoji: '🫘' },
  { id: 'lacteos',    label: 'Lácteos',           emoji: '🥛' },
  { id: 'frutoscas',  label: 'Frutos de cáscara', emoji: '🌰' },
  { id: 'apio',       label: 'Apio',              emoji: '🌿' },
  { id: 'mostaza',    label: 'Mostaza',           emoji: '🟡' },
  { id: 'sesamo',     label: 'Sésamo',            emoji: '🌱' },
  { id: 'sulfitos',   label: 'Sulfitos',          emoji: '🍷' },
  { id: 'altramuces', label: 'Altramuces',        emoji: '🫛' },
  { id: 'moluscos',   label: 'Moluscos',          emoji: '🐚' },
];
let recipes              = [];
let productions          = [];
let recipeProductions    = [];
let comments             = [];
let weights              = [];
let brines               = [];
let productionCategories = [];
let isAdmin     = false;
let currentPage = 'recipes';

// Recetas
let recipeFilter       = 'Todas';
let currentRecipeId    = null;
let recipeEditorMode   = null;
let recipeEditorData   = null;

// Producciones
let prodFilter         = 'Todas';
let currentProdId      = null;
let prodEditorMode     = null;
let prodEditorData     = null;
let currentMultiplier  = 1;

// Comentarios
let commentContext     = { name: '', section: '', id: null };

// Fichas
let editingWeightId    = null;
let editingBrineId     = null;

// Link producciones
let linkingRecipeId    = null;
let selectedProdIds    = [];

// ═══════════════════════════════════════
//   CARGA INICIAL
// ═══════════════════════════════════════
async function loadData() {
  try {
    const [
      { data: rData },
      { data: pData },
      { data: rpData },
      { data: cData },
      { data: wData },
      { data: bData },
      { data: pcData },
    ] = await Promise.all([
      sb.from('recipes').select('*').order('name'),
      sb.from('productions').select('*').order('name'),
      sb.from('recipe_productions').select('*'),
      sb.from('comments').select('*').order('created_at', { ascending: false }),
      sb.from('weights').select('*').order('name'),
      sb.from('brines').select('*').order('category'),
      sb.from('production_categories').select('*').order('sort_order'),
    ]);

    recipes              = rData  || [];
    productions          = pData  || [];
    recipeProductions    = rpData || [];
    comments             = cData  || [];
    weights              = wData  || [];
    brines               = bData  || [];
    productionCategories = pcData || [];

    renderRecipes();
    updateBadges();

  } catch (err) {
    console.error('Error cargando datos:', err);
    document.getElementById('recipeList').innerHTML = `
      <div class="empty-state">
        <span class="material-symbols-outlined">wifi_off</span>
        Error al conectar con la base de datos
      </div>`;
  }
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

  const isRecipes = page === 'recipes';
  const isProd    = page === 'productions';
  document.getElementById('searchSection').style.display = (isRecipes || isProd) ? '' : 'none';
  document.getElementById('adminAddRecipeRow').style.display    = (isRecipes && isAdmin) ? '' : 'none';
  document.getElementById('adminAddProductionRow').style.display = (isProd    && isAdmin) ? '' : 'none';

  if (isRecipes) { initChips(RECIPE_CATEGORIES, recipeFilter, setRecipeFilter); renderRecipes(); }
  if (isProd)    { const cats = ['Todas', ...productionCategories.map(c => c.name)]; initChips(cats, prodFilter, setProdFilter); renderProductions(); }
  if (page === 'fichas')    renderFichas();
  if (page === 'converter') initConverter();
  if (page === 'admin')     renderAdmin();
}

function exitInnerView() {
  document.getElementById('mainNav').style.display       = '';
  document.getElementById('searchSection').style.display = '';
}

// ═══════════════════════════════════════
//   SEARCH
// ═══════════════════════════════════════
function onSearch() {
  if (currentPage === 'recipes')     renderRecipes();
  if (currentPage === 'productions') renderProductions();
}

// ═══════════════════════════════════════
//   CHIPS
// ═══════════════════════════════════════
function initChips(cats, active, setter) {
  document.getElementById('chipsRow').innerHTML = cats.map(c =>
    `<button class="chip ${c === active ? 'active' : ''}" onclick="${setter.name}('${c}')">${c}</button>`
  ).join('');
}

function setRecipeFilter(cat) { recipeFilter = cat; initChips(RECIPE_CATEGORIES, recipeFilter, setRecipeFilter); renderRecipes(); }
function setProdFilter(cat)   { prodFilter = cat; const cats = ['Todas', ...productionCategories.map(c => c.name)]; initChips(cats, prodFilter, setProdFilter); renderProductions(); }

// ═══════════════════════════════════════
//   ALÉRGENOS HELPERS
// ═══════════════════════════════════════
function renderAllergenBadges(allergens) {
  if (!allergens || allergens.length === 0)
    return '<p style="font-size:13px; color:var(--text2);">Sin alérgenos declarados</p>';
  return `<div class="allergen-grid">${allergens.map(id => {
    const a = ALLERGENS.find(x => x.id === id);
    return a ? `<div class="allergen-badge"><span class="allergen-emoji">${a.emoji}</span><span class="allergen-label">${a.label}</span></div>` : '';
  }).join('')}</div>`;
}

function renderAllergenSelector(selectedIds, onToggleFn) {
  return `<div class="allergen-selector">${ALLERGENS.map(a => `
    <div class="allergen-option ${selectedIds.includes(a.id) ? 'selected' : ''}" onclick="${onToggleFn}('${a.id}')">
      <span class="allergen-emoji">${a.emoji}</span>
      <span class="allergen-label">${a.label}</span>
    </div>`).join('')}</div>`;
}

function toggleRecipeAllergen(id) {
  const arr = recipeEditorData.allergens || [];
  recipeEditorData.allergens = arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id];
  renderRecipeEditor();
}

function toggleProdAllergen(id) {
  const arr = prodEditorData.allergens || [];
  prodEditorData.allergens = arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id];
  renderProdEditor();
}

// ═══════════════════════════════════════
//   RECETAS — LISTA
// ═══════════════════════════════════════
function renderRecipes() {
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const filtered = recipes.filter(r =>
    (recipeFilter === 'Todas' || r.category === recipeFilter) &&
    r.name.toLowerCase().includes(q)
  );

  const list = document.getElementById('recipeList');
  if (!list) return;

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state"><span class="material-symbols-outlined">search_off</span>No se encontraron recetas</div>`;
    return;
  }

  list.innerHTML = filtered.map(r => `
    <div class="recipe-card" onclick="showRecipeDetail('${r.id}')">
      ${r.photo
        ? `<img class="recipe-card-img" src="${r.photo}" alt="${r.name}" loading="lazy">`
        : `<div class="recipe-card-img-placeholder"><span class="material-symbols-outlined">restaurant</span></div>`}
      <div class="recipe-card-body">
        <div class="recipe-card-meta">
          <span class="tag ${CAT_TAG[r.category] || ''}">${r.category}</span>
        </div>
        <h3>${r.name}</h3>
        <p>${r.description}</p>
      </div>
    </div>`).join('');
}

// ═══════════════════════════════════════
//   RECETAS — DETALLE
// ═══════════════════════════════════════
function showRecipeDetail(id) {
  currentRecipeId = id;
  history.pushState({ view: 'recipeDetail', id }, '');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('detailPage').classList.add('active');
  document.getElementById('searchSection').style.display = 'none';
  document.getElementById('adminAddRecipeRow').style.display = 'none';
  document.getElementById('mainNav').style.display = 'none';
  renderRecipeDetail();
}

function renderRecipeDetail() {
  const r = recipes.find(x => x.id === currentRecipeId);
  if (!r) return;

  // Producciones vinculadas
  const linkedIds = recipeProductions.filter(rp => rp.recipe_id === r.id).map(rp => rp.production_id);
  const linkedProds = productions.filter(p => linkedIds.includes(p.id));

  const prodsHtml = linkedProds.length > 0
    ? linkedProds.map(p => `
        <div class="prod-link-row" onclick="showProdDetail('${p.id}')">
          <div>
            <div class="prod-link-name">${p.name}</div>
            <span class="tag ${CAT_TAG[p.category] || ''}" style="font-size:10px;">${p.category}</span>
          </div>
          <span class="material-symbols-outlined" style="color:var(--outline);">chevron_right</span>
        </div>`).join('')
    : `<p style="font-size:13px; color:var(--text2); padding:8px 0;">Sin producciones vinculadas</p>`;

  const ings = r.ingredients.map(ing =>
    `<div class="ing-row">
      <span class="ing-name">${ing.name}</span>
      <span class="ing-amount">${ing.amount} ${ing.unit}</span>
    </div>`).join('');

  const steps = r.steps.map((s, i) =>
    `<div class="step-row">
      <div class="step-num">${i + 1}</div>
      <div class="step-text">${s}</div>
    </div>`).join('');

  const photoHtml = r.photo
    ? `<img class="detail-img" src="${r.photo}" alt="Foto del plato" data-src="${r.photo}" onclick="openLightbox(this.dataset.src)" style="cursor:zoom-in;">`
    : `<div class="detail-img-placeholder"><span class="material-symbols-outlined">restaurant</span></div>`;

  const adminBtns = isAdmin ? `
    <button class="btn-pill" onclick="openEditRecipe()">
      <span class="material-symbols-outlined" style="font-size:16px;">edit</span> Editar
    </button>
    <button class="btn-pill" onclick="openLinkModal('${r.id}')">
      <span class="material-symbols-outlined" style="font-size:16px;">link</span> Vincular
    </button>
    <button class="btn-pill danger" onclick="deleteRecipe('${r.id}')">
      <span class="material-symbols-outlined" style="font-size:16px;">delete</span>
    </button>` : '';

  document.getElementById('detailPage').innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; flex-wrap:wrap; gap:8px;">
      <button class="back-btn" onclick="backTo('recipes')">
        <span class="material-symbols-outlined">arrow_back</span> Volver
      </button>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <button class="btn-pill ghost" onclick="openCommentModal('${r.name}','recipe','${r.id}')">
          <span class="material-symbols-outlined" style="font-size:16px;">report</span> Error
        </button>
        ${adminBtns}
      </div>
    </div>
    ${photoHtml}
    <div class="card">
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
        <span class="tag ${CAT_TAG[r.category] || ''}">${r.category}</span>
      </div>
      <h2 style="font-size:22px; margin-bottom:6px;">${r.name}</h2>
      <p style="font-size:14px; color:var(--text2); line-height:1.5;">${r.description}</p>
    </div>
    ${r.ingredients.length > 0 ? `
    <div class="card">
      <div class="section-title"><span class="material-symbols-outlined">grocery</span> Ingredientes</div>
      ${ings}
    </div>` : ''}
    ${r.steps.length > 0 ? `
    <div class="card">
      <div class="section-title"><span class="material-symbols-outlined">format_list_numbered</span> Elaboración</div>
      ${steps}
    </div>` : ''}
    ${r.plating ? `
    <div class="card">
      <div class="section-title"><span class="material-symbols-outlined">restaurant</span> Montaje</div>
      <p style="font-size:14px; line-height:1.6;">${r.plating}</p>
    </div>` : ''}
    <div class="card">
      <div class="section-title"><span class="material-symbols-outlined">blender</span> Producciones</div>
      ${prodsHtml}
    </div>
    <div class="card">
      <div class="section-title"><span class="material-symbols-outlined">warning</span> Alérgenos</div>
      ${(() => {
        const prodAllergens = linkedProds.flatMap(p => p.allergens || []);
        const recipeAllergens = r.allergens || [];
        const all = [...new Set([...prodAllergens, ...recipeAllergens])];
        return renderAllergenBadges(all);
      })()}
    </div>
  `;
}

function backTo(page) {
  exitInnerView();
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(page + 'Page').classList.add('active');
  document.getElementById('nav-' + page).classList.add('active');
  currentPage = page;
  if (page === 'recipes') {
    document.getElementById('adminAddRecipeRow').style.display = isAdmin ? '' : 'none';
    initChips(RECIPE_CATEGORIES, recipeFilter, setRecipeFilter);
  }
  if (page === 'productions') {
    document.getElementById('adminAddProductionRow').style.display = isAdmin ? '' : 'none';
    initChips(PROD_CATEGORIES, prodFilter, setProdFilter);
  }
}

// ═══════════════════════════════════════
//   RECETAS — EDITOR
// ═══════════════════════════════════════
function openAddRecipe() {
  recipeEditorMode = 'add';
  recipeEditorData = { id: Date.now().toString(), name: '', category: 'Carnes', servings: 4, description: '', photo: '', plating: '', ingredients: [], steps: [] };
  renderRecipeEditor();
  enterEditor('editorPage');
}

function openEditRecipe() {
  recipeEditorMode = 'edit';
  recipeEditorData = JSON.parse(JSON.stringify(recipes.find(r => r.id === currentRecipeId)));
  renderRecipeEditor();
  enterEditor('editorPage');
}

function enterEditor(pageId) {
  history.pushState({ view: 'editor', pageId }, '');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  document.getElementById('searchSection').style.display = 'none';
  document.getElementById('adminAddRecipeRow').style.display = 'none';
  document.getElementById('adminAddProductionRow').style.display = 'none';
  document.getElementById('mainNav').style.display = 'none';
}

function renderRecipeEditor() {
  const r = recipeEditorData;
  const isNew = recipeEditorMode === 'add';

  const photoSection = `
    <div class="form-group">
      <div class="form-label">Foto del plato</div>
      ${r.photo
        ? `<img class="photo-preview" src="${r.photo}">
           <button class="btn-pill danger" onclick="recipeEditorData.photo=''; renderRecipeEditor();" style="margin-bottom:8px;">
             <span class="material-symbols-outlined" style="font-size:15px;">delete</span> Quitar foto
           </button>`
        : `<div class="photo-upload-area" onclick="document.getElementById('recipePhotoInput').click()">
             <span class="material-symbols-outlined">add_photo_alternate</span>
             <p>Toca para añadir una foto</p>
           </div>`}
      <input type="file" id="recipePhotoInput" accept="image/*" style="display:none;" onchange="handleRecipePhoto(event)">
      <div class="form-group" style="margin-top:8px; margin-bottom:0;">
        <div class="form-label">O pega una URL</div>
        <input class="form-input" placeholder="https://..." value="${r.photo}" oninput="recipeEditorData.photo=this.value">
      </div>
    </div>`;

  const ings = r.ingredients.map((ing, i) => `
    <div class="ing-edit-row">
      <input class="ing-edit-name" value="${ing.name}" placeholder="Ingrediente" autocomplete="off" data-form-type="other" oninput="recipeEditorData.ingredients[${i}].name=this.value">
      <input class="ing-edit-amount" type="number" value="${ing.amount}" autocomplete="off" data-form-type="other" oninput="recipeEditorData.ingredients[${i}].amount=parseFloat(this.value)||0">
      <input class="ing-edit-unit" value="${ing.unit}" placeholder="ud" autocomplete="off" data-form-type="other" oninput="recipeEditorData.ingredients[${i}].unit=this.value">
      <button class="btn-remove" onclick="recipeEditorData.ingredients.splice(${i},1); renderRecipeEditor();">
        <span class="material-symbols-outlined" style="font-size:20px;">close</span>
      </button>
    </div>`).join('');

  const stps = r.steps.map((s, i) => `
    <div class="step-edit-row">
      <div class="step-edit-num">${i + 1}</div>
      <textarea rows="2" oninput="recipeEditorData.steps[${i}]=this.value">${s}</textarea>
      <button class="btn-remove" onclick="recipeEditorData.steps.splice(${i},1); renderRecipeEditor();">
        <span class="material-symbols-outlined" style="font-size:20px;">close</span>
      </button>
    </div>`).join('');

  document.getElementById('editorPage').innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;">
      <button class="back-btn" onclick="cancelRecipeEditor()">
        <span class="material-symbols-outlined">close</span> Cancelar
      </button>
      <span style="font-size:17px; font-weight:800;">${isNew ? 'Nueva receta' : 'Editar receta'}</span>
      <button class="btn-pill filled" id="saveRecipeBtn" onclick="saveRecipe()">Guardar</button>
    </div>
    <div class="card">
      ${photoSection}
      <div class="form-group">
        <div class="form-label">Nombre</div>
        <input class="form-input" value="${r.name}" placeholder="Nombre de la receta..." autocomplete="off" data-form-type="other" data-lpignore="true" oninput="recipeEditorData.name=this.value">
      </div>
      <div class="form-group">
        <div class="form-label">Categoría</div>
        <select class="form-select" onchange="recipeEditorData.category=this.value">
          ${RECIPE_CATEGORIES.filter(c => c !== 'Todas').map(c =>
            `<option ${r.category === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <div class="form-label">Descripción</div>
        <textarea class="form-textarea" rows="2" oninput="recipeEditorData.description=this.value">${r.description}</textarea>
      </div>
      <div class="form-group">
        <div class="form-label">Descripción del montaje</div>
        <textarea class="form-textarea" rows="3" placeholder="Cómo emplatar el plato..." oninput="recipeEditorData.plating=this.value">${r.plating || ''}</textarea>
      </div>
    </div>
    <div class="card">
      <div class="section-title" style="margin-bottom:12px;"><span class="material-symbols-outlined">warning</span> Alérgenos</div>
      ${renderAllergenSelector(r.allergens || [], 'toggleRecipeAllergen')}
    </div>
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div class="section-title" style="margin-bottom:0;"><span class="material-symbols-outlined">grocery</span> Ingredientes</div>
        <button class="btn-pill" onclick="recipeEditorData.ingredients.push({id:Date.now().toString(),name:'',amount:0,unit:'g'}); renderRecipeEditor();">
          <span class="material-symbols-outlined" style="font-size:16px;">add</span> Añadir
        </button>
      </div>
      <div id="recipeIngList">${ings}</div>
    </div>
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div class="section-title" style="margin-bottom:0;"><span class="material-symbols-outlined">format_list_numbered</span> Elaboración</div>
        <button class="btn-pill" onclick="recipeEditorData.steps.push(''); renderRecipeEditor();">
          <span class="material-symbols-outlined" style="font-size:16px;">add</span> Añadir paso
        </button>
      </div>
      <div id="recipeStepList">${stps}</div>
    </div>`;
}

async function handleRecipePhoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  showToast('Subiendo foto...');
  try {
    const filename = `${Date.now()}.${file.name.split('.').pop()}`;
    await sb.storage.from('recipe-photos').upload(filename, file);
    const { data } = sb.storage.from('recipe-photos').getPublicUrl(filename);
    recipeEditorData.photo = data.publicUrl;
    renderRecipeEditor();
    showToast('Foto subida ✓');
  } catch (err) { showToast('Error al subir la foto'); }
}

async function saveRecipe() {
  if (!recipeEditorData.name.trim()) { showToast('El nombre es obligatorio'); return; }
  const btn = document.getElementById('saveRecipeBtn');
  btn.textContent = 'Guardando...'; btn.disabled = true;
  const { error } = await sb.from('recipes').upsert(recipeEditorData);
  if (error) { showToast('Error al guardar'); btn.textContent = 'Guardar'; btn.disabled = false; return; }
  if (recipeEditorMode === 'add') recipes.push(recipeEditorData);
  else recipes = recipes.map(r => r.id === recipeEditorData.id ? recipeEditorData : r);
  currentRecipeId = recipeEditorData.id;
  showToast('Receta guardada ✓');
  exitRecipeEditor(true);
}

function cancelRecipeEditor() { exitRecipeEditor(recipeEditorMode === 'edit'); }

function exitRecipeEditor(goToDetail) {
  exitInnerView();
  if (goToDetail && currentRecipeId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('detailPage').classList.add('active');
    renderRecipeDetail();
  } else {
    backTo('recipes');
    renderRecipes();
  }
  recipeEditorMode = null; recipeEditorData = null;
}

async function deleteRecipe(id) {
  if (!confirm('¿Eliminar esta receta?')) return;
  await sb.from('recipes').delete().eq('id', id);
  recipes = recipes.filter(r => r.id !== id);
  showToast('Receta eliminada');
  backTo('recipes'); renderRecipes();
}

// ═══════════════════════════════════════
//   VINCULAR PRODUCCIONES
// ═══════════════════════════════════════
function openLinkModal(recipeId) {
  linkingRecipeId = recipeId;
  selectedProdIds = recipeProductions.filter(rp => rp.recipe_id === recipeId).map(rp => rp.production_id);
  document.getElementById('linkProductionList').innerHTML = productions.length === 0
    ? '<p style="color:var(--text2); font-size:13px;">No hay producciones creadas aún.</p>'
    : productions.map(p => `
        <div class="link-prod-row" onclick="toggleProdLink('${p.id}', this)">
          <div>
            <div style="font-size:14px; font-weight:600;">${p.name}</div>
            <span class="tag ${CAT_TAG[p.category] || ''}" style="font-size:10px;">${p.category}</span>
          </div>
          <span class="material-symbols-outlined check-icon" style="color:${selectedProdIds.includes(p.id) ? 'var(--primary)' : 'var(--outline-light)'};">
            ${selectedProdIds.includes(p.id) ? 'check_circle' : 'radio_button_unchecked'}
          </span>
        </div>`).join('');
  document.getElementById('linkModal').style.display = 'flex';
}

function toggleProdLink(prodId, row) {
  if (selectedProdIds.includes(prodId)) {
    selectedProdIds = selectedProdIds.filter(id => id !== prodId);
  } else {
    selectedProdIds.push(prodId);
  }
  const icon = row.querySelector('.check-icon');
  icon.textContent = selectedProdIds.includes(prodId) ? 'check_circle' : 'radio_button_unchecked';
  icon.style.color = selectedProdIds.includes(prodId) ? 'var(--primary)' : 'var(--outline-light)';
}

async function saveLinkProductions() {
  await sb.from('recipe_productions').delete().eq('recipe_id', linkingRecipeId);
  if (selectedProdIds.length > 0) {
    const rows = selectedProdIds.map((pid, i) => ({
      id: `${linkingRecipeId}_${pid}`,
      recipe_id: linkingRecipeId,
      production_id: pid,
      sort_order: i,
    }));
    await sb.from('recipe_productions').insert(rows);
  }
  recipeProductions = recipeProductions.filter(rp => rp.recipe_id !== linkingRecipeId);
  selectedProdIds.forEach((pid, i) => recipeProductions.push({ id: `${linkingRecipeId}_${pid}`, recipe_id: linkingRecipeId, production_id: pid, sort_order: i }));
  closeModal('linkModal');
  showToast('Producciones vinculadas ✓');
  renderRecipeDetail();
}

// ═══════════════════════════════════════
//   PRODUCCIONES — LISTA
// ═══════════════════════════════════════
function renderProductions() {
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const filtered = productions.filter(p =>
    (prodFilter === 'Todas' || p.category === prodFilter) &&
    p.name.toLowerCase().includes(q)
  );

  const list = document.getElementById('productionList');
  if (!list) return;

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state"><span class="material-symbols-outlined">search_off</span>No se encontraron producciones</div>`;
    return;
  }

  list.innerHTML = filtered.map(p => `
    <div class="recipe-card" onclick="showProdDetail('${p.id}')">
      <div class="recipe-card-body">
        <div class="recipe-card-meta">
          <span class="tag ${CAT_TAG[p.category] || ''}">${p.category}</span>
        </div>
        <h3>${p.name}</h3>
        <p>${p.description || ''}</p>
      </div>
    </div>`).join('');
}

// ═══════════════════════════════════════
//   PRODUCCIONES — DETALLE
// ═══════════════════════════════════════
function showProdDetail(id) {
  currentProdId = id;
  currentMultiplier = 1;
  const fromPage = currentPage;
  history.pushState({ view: 'prodDetail', id, fromPage }, '');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('productionDetailPage').classList.add('active');
  document.getElementById('searchSection').style.display = 'none';
  document.getElementById('adminAddProductionRow').style.display = 'none';
  document.getElementById('adminAddRecipeRow').style.display = 'none';
  document.getElementById('mainNav').style.display = 'none';
  renderProdDetail(fromPage);
}

function renderProdDetail(fromPage) {
  const p = productions.find(x => x.id === currentProdId);
  if (!p) return;
  const m = currentMultiplier;

  const mBtns = [0.5, 1, 2, 3, 4].map(x =>
    `<button class="chip ${m === x ? 'active' : ''}" onclick="setProdMultiplier(${x}, '${fromPage || 'productions'}')">${x === 0.5 ? '½' : '×' + x}</button>`
  ).join('');

  const ings = p.ingredients.map(ing => {
    const v = ing.amount * m;
    return `<div class="ing-row">
      <span class="ing-name">${ing.name}</span>
      <span class="ing-amount">${v % 1 === 0 ? v : v.toFixed(1)} ${ing.unit}</span>
    </div>`;
  }).join('');

  const steps = p.steps.map((s, i) =>
    `<div class="step-row">
      <div class="step-num">${i + 1}</div>
      <div class="step-text">${s}</div>
    </div>`).join('');

  const adminBtns = isAdmin ? `
    <button class="btn-pill" onclick="openEditProduction()">
      <span class="material-symbols-outlined" style="font-size:16px;">edit</span> Editar
    </button>
    <button class="btn-pill danger" onclick="deleteProduction('${p.id}')">
      <span class="material-symbols-outlined" style="font-size:16px;">delete</span>
    </button>` : '';

  const backPage = fromPage || 'productions';

  document.getElementById('productionDetailPage').innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; flex-wrap:wrap; gap:8px;">
      <button class="back-btn" onclick="backTo('${backPage}')">
        <span class="material-symbols-outlined">arrow_back</span> Volver
      </button>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <button class="btn-pill ghost" onclick="openCommentModal('${p.name}','production','${p.id}')">
          <span class="material-symbols-outlined" style="font-size:16px;">report</span> Error
        </button>
        ${adminBtns}
      </div>
    </div>
    <div class="card">
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
        <span class="tag ${CAT_TAG[p.category] || ''}">${p.category}</span>
      </div>
      <h2 style="font-size:22px; margin-bottom:6px;">${p.name}</h2>
      ${p.description ? `<p style="font-size:14px; color:var(--text2); line-height:1.5;">${p.description}</p>` : ''}
    </div>
    <div class="multiplier-card">
      <div class="multiplier-label">
        <span class="material-symbols-outlined">scale</span> Ajustar cantidades
        ${m !== 1 ? `<span style="font-size:13px; color:var(--primary)">(×${m})</span>` : ''}
      </div>
      <div class="multiplier-row">
        ${mBtns}
        <input type="number" min="0.1" step="0.5" value="${m}" onchange="setProdMultiplier(parseFloat(this.value)||1,'${backPage}')">
      </div>
    </div>
    <div class="card">
      <div class="section-title"><span class="material-symbols-outlined">grocery</span> Ingredientes</div>
      ${ings}
    </div>
    <div class="card">
      <div class="section-title"><span class="material-symbols-outlined">format_list_numbered</span> Elaboración</div>
      ${steps}
    </div>
    <div class="card">
      <div class="section-title"><span class="material-symbols-outlined">warning</span> Alérgenos</div>
      ${renderAllergenBadges(p.allergens)}
    </div>`;
}

function setProdMultiplier(m, fromPage) {
  currentMultiplier = m;
  renderProdDetail(fromPage);
}

// ═══════════════════════════════════════
//   PRODUCCIONES — EDITOR
// ═══════════════════════════════════════
function openAddProduction() {
  prodEditorMode = 'add';
  const defaultCat = productionCategories.length > 0 ? productionCategories[0].name : '';
  prodEditorData = { id: Date.now().toString(), name: '', category: defaultCat, description: '', ingredients: [], steps: [] };
  renderProdEditor();
  enterEditor('productionEditorPage');
}

function openEditProduction() {
  prodEditorMode = 'edit';
  prodEditorData = JSON.parse(JSON.stringify(productions.find(p => p.id === currentProdId)));
  renderProdEditor();
  enterEditor('productionEditorPage');
}

function renderProdEditor() {
  const p = prodEditorData;
  const isNew = prodEditorMode === 'add';

  const ings = p.ingredients.map((ing, i) => `
    <div class="ing-edit-row">
      <input class="ing-edit-name" value="${ing.name}" placeholder="Ingrediente" autocomplete="off" data-form-type="other" oninput="prodEditorData.ingredients[${i}].name=this.value">
      <input class="ing-edit-amount" type="number" value="${ing.amount}" autocomplete="off" data-form-type="other" oninput="prodEditorData.ingredients[${i}].amount=parseFloat(this.value)||0">
      <input class="ing-edit-unit" value="${ing.unit}" placeholder="ud" autocomplete="off" data-form-type="other" oninput="prodEditorData.ingredients[${i}].unit=this.value">
      <button class="btn-remove" onclick="prodEditorData.ingredients.splice(${i},1); renderProdEditor();">
        <span class="material-symbols-outlined" style="font-size:20px;">close</span>
      </button>
    </div>`).join('');

  const stps = p.steps.map((s, i) => `
    <div class="step-edit-row">
      <div class="step-edit-num">${i + 1}</div>
      <textarea rows="2" oninput="prodEditorData.steps[${i}]=this.value">${s}</textarea>
      <button class="btn-remove" onclick="prodEditorData.steps.splice(${i},1); renderProdEditor();">
        <span class="material-symbols-outlined" style="font-size:20px;">close</span>
      </button>
    </div>`).join('');

  document.getElementById('productionEditorPage').innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;">
      <button class="back-btn" onclick="cancelProdEditor()">
        <span class="material-symbols-outlined">close</span> Cancelar
      </button>
      <span style="font-size:17px; font-weight:800;">${isNew ? 'Nueva producción' : 'Editar producción'}</span>
      <button class="btn-pill filled" id="saveProdBtn" onclick="saveProduction()">Guardar</button>
    </div>
    <div class="card">
      <div class="form-group">
        <div class="form-label">Nombre</div>
        <input class="form-input" value="${p.name}" placeholder="Nombre de la producción..." autocomplete="off" data-form-type="other" data-lpignore="true" oninput="prodEditorData.name=this.value">
      </div>
      <div class="form-group">
        <div class="form-label">Categoría</div>
        <select class="form-select" onchange="prodEditorData.category=this.value">
          ${productionCategories.map(c =>
            `<option ${p.category === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <div class="form-label">Descripción (opcional)</div>
        <textarea class="form-textarea" rows="2" oninput="prodEditorData.description=this.value">${p.description || ''}</textarea>
      </div>
    </div>
    <div class="card">
      <div class="section-title" style="margin-bottom:12px;"><span class="material-symbols-outlined">warning</span> Alérgenos</div>
      ${renderAllergenSelector(p.allergens || [], 'toggleProdAllergen')}
    </div>
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div class="section-title" style="margin-bottom:0;"><span class="material-symbols-outlined">grocery</span> Ingredientes</div>
        <button class="btn-pill" onclick="prodEditorData.ingredients.push({id:Date.now().toString(),name:'',amount:0,unit:'g'}); renderProdEditor();">
          <span class="material-symbols-outlined" style="font-size:16px;">add</span> Añadir
        </button>
      </div>
      <div>${ings}</div>
    </div>
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div class="section-title" style="margin-bottom:0;"><span class="material-symbols-outlined">format_list_numbered</span> Elaboración</div>
        <button class="btn-pill" onclick="prodEditorData.steps.push(''); renderProdEditor();">
          <span class="material-symbols-outlined" style="font-size:16px;">add</span> Añadir paso
        </button>
      </div>
      <div>${stps}</div>
    </div>`;
}

async function saveProduction() {
  if (!prodEditorData.name.trim()) { showToast('El nombre es obligatorio'); return; }
  const btn = document.getElementById('saveProdBtn');
  btn.textContent = 'Guardando...'; btn.disabled = true;
  const { error } = await sb.from('productions').upsert(prodEditorData);
  if (error) { showToast('Error al guardar'); btn.textContent = 'Guardar'; btn.disabled = false; return; }
  if (prodEditorMode === 'add') productions.push(prodEditorData);
  else productions = productions.map(p => p.id === prodEditorData.id ? prodEditorData : p);
  currentProdId = prodEditorData.id;
  showToast('Producción guardada ✓');
  exitProdEditor(true);
}

function cancelProdEditor() { exitProdEditor(prodEditorMode === 'edit'); }

function exitProdEditor(goToDetail) {
  exitInnerView();
  if (goToDetail && currentProdId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('productionDetailPage').classList.add('active');
    renderProdDetail('productions');
  } else {
    backTo('productions');
    renderProductions();
  }
  prodEditorMode = null; prodEditorData = null;
}

async function deleteProduction(id) {
  if (!confirm('¿Eliminar esta producción?')) return;
  await sb.from('productions').delete().eq('id', id);
  productions = productions.filter(p => p.id !== id);
  showToast('Producción eliminada');
  backTo('productions'); renderProductions();
}

// ═══════════════════════════════════════
//   COMENTARIOS
// ═══════════════════════════════════════
function openCommentModal(name, section, id) {
  commentContext = { name, section, id };
  document.getElementById('commentSectionName').textContent = name;
  document.getElementById('commentInput').value = '';
  document.getElementById('commentFormArea').style.display = '';
  document.getElementById('commentSuccess').style.display  = 'none';
  document.getElementById('commentModal').style.display    = 'flex';
}

async function sendComment() {
  const text = document.getElementById('commentInput').value.trim();
  if (!text) return;
  const newComment = {
    id:           Date.now().toString(),
    section:      commentContext.section,
    section_id:   commentContext.id,
    section_name: commentContext.name,
    text,
    date:         new Date().toLocaleDateString('es-ES'),
    resolved:     false,
  };
  const { error } = await sb.from('comments').insert(newComment);
  if (error) { showToast('Error al enviar'); return; }
  comments.unshift(newComment);
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
    document.getElementById('adminBtn').innerHTML = `<span class="material-symbols-outlined" style="font-size:16px;">lock</span> Admin`;
    document.getElementById('adminAddRecipeRow').style.display    = 'none';
    document.getElementById('adminAddProductionRow').style.display = 'none';
    document.getElementById('addWeightBtn').style.display = 'none';
    document.getElementById('addBrineBtn').style.display  = 'none';
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
    if (currentPage === 'recipes')     document.getElementById('adminAddRecipeRow').style.display    = '';
    if (currentPage === 'productions') document.getElementById('adminAddProductionRow').style.display = '';
    if (currentPage === 'fichas') {
      document.getElementById('addWeightBtn').style.display = '';
      document.getElementById('addBrineBtn').style.display  = '';
    }
    showToast('Bienvenido, Chef 👨‍🍳');
    if (currentRecipeId && document.getElementById('detailPage').classList.contains('active')) renderRecipeDetail();
    if (currentProdId   && document.getElementById('productionDetailPage').classList.contains('active')) renderProdDetail(currentPage);
    if (currentPage === 'admin') renderAdmin();
  } else {
    document.getElementById('loginError').style.display = '';
  }
}

function renderAdmin() {
  const pending  = comments.filter(c => !c.resolved);
  const resolved = comments.filter(c =>  c.resolved);

  document.getElementById('adminStats').innerHTML = `
    <div class="stat-card"><span class="material-symbols-outlined">menu_book</span><div class="stat-card-num">${recipes.length}</div><div class="stat-card-lbl">Recetas</div></div>
    <div class="stat-card"><span class="material-symbols-outlined">blender</span><div class="stat-card-num">${productions.length}</div><div class="stat-card-lbl">Producciones</div></div>
    <div class="stat-card"><span class="material-symbols-outlined">mark_chat_unread</span><div class="stat-card-num">${isAdmin ? pending.length : '—'}</div><div class="stat-card-lbl">Pendientes</div></div>`;

  if (!isAdmin) {
    document.getElementById('pendingTitle').innerHTML = '';
    document.getElementById('commentsList').innerHTML = `
      <div class="card" style="text-align:center; padding:32px; color:var(--text2);">
        <span class="material-symbols-outlined" style="font-size:48px; color:var(--outline); display:block; margin-bottom:12px;">lock</span>
        <p style="font-weight:700;">Acceso restringido</p>
        <p style="font-size:13px; margin-top:4px;">Inicia sesión como admin para ver los comentarios.</p>
        <button class="btn-pill filled" style="margin-top:16px;" onclick="toggleAdmin()">Iniciar sesión</button>
      </div>`;
    document.getElementById('resolvedSection').innerHTML = '';
    return;
  }

  document.getElementById('pendingTitle').innerHTML =
    `<span class="material-symbols-outlined">inbox</span> Comentarios pendientes
     ${pending.length > 0 ? '<span class="badge">' + pending.length + '</span>' : ''}`;

  document.getElementById('commentsList').innerHTML = pending.length === 0
    ? `<div class="card" style="text-align:center; padding:24px; color:var(--text2);">
        <span class="material-symbols-outlined" style="font-size:40px; color:var(--primary); display:block; margin-bottom:8px;">check_circle</span>
        Sin comentarios pendientes
       </div>`
    : pending.map(c => `
        <div class="comment-card">
          <div style="flex:1;">
            <div class="comment-recipe">${c.section_name}</div>
            <div class="comment-text">${c.text}</div>
            <div class="comment-date">${c.date}</div>
          </div>
          <button class="btn-pill" onclick="resolveComment('${c.id}')">
            <span class="material-symbols-outlined" style="font-size:15px;">check</span> Resolver
          </button>
        </div>`).join('');

  document.getElementById('resolvedSection').innerHTML = resolved.length === 0 ? '' : `
    <div class="section-title" style="margin-top:8px;"><span class="material-symbols-outlined">task_alt</span> Resueltos</div>
    ${resolved.map(c => `
      <div class="comment-card" style="opacity:0.55;">
        <div><div class="comment-recipe">${c.section_name} ✓</div><div class="comment-text" style="font-size:13px;">${c.text}</div></div>
      </div>`).join('')}`;

  // Categorías de producción
  const catHtml = productionCategories.map(c => `
    <div class="ficha-row">
      <div class="ficha-name">${c.name}</div>
      <div style="display:flex; gap:6px;">
        <button class="btn-icon" onclick="renameProdCategory('${c.id}','${c.name}')">
          <span class="material-symbols-outlined" style="font-size:18px; color:var(--primary);">edit</span>
        </button>
        <button class="btn-icon" onclick="deleteProdCategory('${c.id}')">
          <span class="material-symbols-outlined" style="font-size:18px; color:var(--danger);">delete</span>
        </button>
      </div>
    </div>`).join('');

  document.getElementById('resolvedSection').innerHTML += `
    <div class="section-title" style="margin-top:16px;">
      <span class="material-symbols-outlined">label</span> Categorías de producción
    </div>
    <div class="card">
      ${catHtml}
      <div style="margin-top:12px; display:flex; gap:8px;">
        <input class="form-input" id="newCatInput" placeholder="Nueva categoría..." style="flex:1;">
        <button class="btn-pill filled" onclick="addProdCategory()">
          <span class="material-symbols-outlined" style="font-size:16px;">add</span>
        </button>
      </div>
    </div>`;
}

async function resolveComment(id) {
  await sb.from('comments').update({ resolved: true }).eq('id', id);
  comments = comments.map(c => c.id === id ? { ...c, resolved: true } : c);
  updateBadges(); renderAdmin();
}

// ─── Categorías de producción ─────────
async function addProdCategory() {
  const input = document.getElementById('newCatInput');
  const name = input?.value.trim();
  if (!name) return;
  const newCat = { id: Date.now().toString(), name, sort_order: productionCategories.length + 1 };
  const { error } = await sb.from('production_categories').insert(newCat);
  if (error) { showToast('Error al añadir'); return; }
  productionCategories.push(newCat);
  showToast('Categoría añadida ✓');
  renderAdmin();
}

async function renameProdCategory(id, currentName) {
  const newName = prompt('Nuevo nombre para la categoría:', currentName);
  if (!newName || newName === currentName) return;
  const { error } = await sb.from('production_categories').update({ name: newName }).eq('id', id);
  if (error) { showToast('Error al renombrar'); return; }
  productionCategories = productionCategories.map(c => c.id === id ? { ...c, name: newName } : c);
  productions = productions.map(p => p.category === currentName ? { ...p, category: newName } : p);
  showToast('Categoría renombrada ✓');
  renderAdmin();
}

async function deleteProdCategory(id) {
  const cat = productionCategories.find(c => c.id === id);
  if (!cat) return;
  if (!confirm(`¿Eliminar la categoría "${cat.name}"?`)) return;
  const { error } = await sb.from('production_categories').delete().eq('id', id);
  if (error) { showToast('Error al eliminar'); return; }
  productionCategories = productionCategories.filter(c => c.id !== id);
  showToast('Categoría eliminada');
  renderAdmin();
}

function updateBadges() {
  const n = comments.filter(c => !c.resolved).length;
  const nb = document.getElementById('navBadge');
  const tb = document.getElementById('commentBadgeTop');
  if (n > 0) { nb.textContent = n; nb.style.display = ''; tb.innerHTML = `<span class="badge">${n}</span>`; tb.style.display = ''; }
  else       { nb.style.display = 'none'; tb.style.display = 'none'; }
}

// ═══════════════════════════════════════
//   FICHAS
// ═══════════════════════════════════════
function renderFichas() {
  document.getElementById('addWeightBtn').style.display = isAdmin ? '' : 'none';
  document.getElementById('addBrineBtn').style.display  = isAdmin ? '' : 'none';
  renderWeights();
  renderBrines();
}

function renderWeights() {
  const el = document.getElementById('weightsList');
  if (!el) return;
  el.innerHTML = weights.length === 0
    ? '<p style="color:var(--text2); font-size:13px; padding:8px 0;">Sin datos</p>'
    : weights.map(w => `
        <div class="ficha-row">
          <div>
            <div class="ficha-name">${w.name}</div>
            ${w.notes ? `<div class="ficha-note">${w.notes}</div>` : ''}
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="ing-amount">${w.grams} g</span>
            ${isAdmin ? `
              <button class="btn-icon" onclick="openWeightModal('${w.id}')">
                <span class="material-symbols-outlined" style="font-size:18px; color:var(--primary);">edit</span>
              </button>
              <button class="btn-icon" onclick="deleteWeight('${w.id}')">
                <span class="material-symbols-outlined" style="font-size:18px; color:var(--danger);">delete</span>
              </button>` : ''}
          </div>
        </div>`).join('');
}

function renderBrines() {
  const el = document.getElementById('brinesList');
  if (!el) return;
  const cats = [...new Set(brines.map(b => b.category))];
  el.innerHTML = cats.length === 0
    ? '<p style="color:var(--text2); font-size:13px; padding:8px 0;">Sin datos</p>'
    : cats.map(cat => `
        <div class="ficha-category">${cat === 'Aves' ? '🐔' : cat === 'Cerdo' ? '🐷' : '🐟'} ${cat}</div>
        ${brines.filter(b => b.category === cat).map(b => `
          <div class="ficha-row">
            <div>
              <div class="ficha-name">${b.product}</div>
              ${b.notes ? `<div class="ficha-note">${b.notes}</div>` : ''}
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="ing-amount">${b.minutes >= 60 ? (b.minutes/60)+' h' : b.minutes+' min'}</span>
              ${isAdmin ? `
                <button class="btn-icon" onclick="openBrineModal('${b.id}')">
                  <span class="material-symbols-outlined" style="font-size:18px; color:var(--primary);">edit</span>
                </button>
                <button class="btn-icon" onclick="deleteBrine('${b.id}')">
                  <span class="material-symbols-outlined" style="font-size:18px; color:var(--danger);">delete</span>
                </button>` : ''}
            </div>
          </div>`).join('')}`).join('');
}

// ─── Pesos CRUD ───────────────────────
function openWeightModal(id) {
  editingWeightId = id;
  const w = id ? weights.find(x => x.id === id) : null;
  document.getElementById('weightModalTitle').textContent = id ? 'Editar peso' : 'Nuevo peso';
  document.getElementById('weightName').value  = w ? w.name  : '';
  document.getElementById('weightGrams').value = w ? w.grams : '';
  document.getElementById('weightNotes').value = w ? (w.notes || '') : '';
  document.getElementById('weightModal').style.display = 'flex';
}

async function saveWeight() {
  const name  = document.getElementById('weightName').value.trim();
  const grams = parseInt(document.getElementById('weightGrams').value);
  const notes = document.getElementById('weightNotes').value.trim();
  if (!name || !grams) { showToast('Nombre y gramos son obligatorios'); return; }
  const payload = { name, grams, notes };
  if (editingWeightId) {
    await sb.from('weights').update(payload).eq('id', editingWeightId);
    weights = weights.map(w => w.id === editingWeightId ? { ...w, ...payload } : w);
  } else {
    payload.id = Date.now().toString();
    await sb.from('weights').insert(payload);
    weights.push(payload);
  }
  closeModal('weightModal'); showToast('Guardado ✓'); renderWeights();
}

async function deleteWeight(id) {
  if (!confirm('¿Eliminar?')) return;
  await sb.from('weights').delete().eq('id', id);
  weights = weights.filter(w => w.id !== id);
  showToast('Eliminado'); renderWeights();
}

// ─── Salmueras CRUD ───────────────────
function openBrineModal(id) {
  editingBrineId = id;
  const b = id ? brines.find(x => x.id === id) : null;
  document.getElementById('brineModalTitle').textContent = id ? 'Editar salmuera' : 'Nueva salmuera';
  document.getElementById('brineName').value    = b ? b.product  : '';
  document.getElementById('brineCategory').value = b ? b.category : 'Aves';
  document.getElementById('brineMinutes').value = b ? b.minutes  : '';
  document.getElementById('brineNotes').value   = b ? (b.notes || '') : '';
  document.getElementById('brineModal').style.display = 'flex';
}

async function saveBrine() {
  const product  = document.getElementById('brineName').value.trim();
  const category = document.getElementById('brineCategory').value;
  const minutes  = parseInt(document.getElementById('brineMinutes').value);
  const notes    = document.getElementById('brineNotes').value.trim();
  if (!product || !minutes) { showToast('Producto y tiempo son obligatorios'); return; }
  const payload = { product, category, minutes, notes };
  if (editingBrineId) {
    await sb.from('brines').update(payload).eq('id', editingBrineId);
    brines = brines.map(b => b.id === editingBrineId ? { ...b, ...payload } : b);
  } else {
    payload.id = Date.now().toString();
    await sb.from('brines').insert(payload);
    brines.push(payload);
  }
  closeModal('brineModal'); showToast('Guardado ✓'); renderBrines();
}

async function deleteBrine(id) {
  if (!confirm('¿Eliminar?')) return;
  await sb.from('brines').delete().eq('id', id);
  brines = brines.filter(b => b.id !== id);
  showToast('Eliminado'); renderBrines();
}

// ═══════════════════════════════════════
//   CONVERSOR
// ═══════════════════════════════════════
const CONV_TYPES = {
  Peso:        { units: ['g','kg','oz','lb'],                   toBase: { g:1, kg:1000, oz:28.3495, lb:453.592 } },
  Volumen:     { units: ['ml','L','taza','fl oz','tbsp','tsp'], toBase: { ml:1, L:1000, taza:236.588, 'fl oz':29.5735, tbsp:14.7868, tsp:4.92892 } },
  Temperatura: { units: ['°C','°F'], toBase: null },
};
let convType = 'Peso';

function initConverter() {
  document.getElementById('convTypeChips').innerHTML = Object.keys(CONV_TYPES).map(t =>
    `<button class="chip ${t === convType ? 'active' : ''}" onclick="setConvType('${t}')">${t}</button>`
  ).join('');
  const units = CONV_TYPES[convType].units;
  ['convFrom','convTo'].forEach((id, i) => {
    const s = document.getElementById(id);
    s.innerHTML = units.map(u => `<option>${u}</option>`).join('');
    s.value = units[i === 0 ? 0 : 1];
  });
  updateConverter();
  document.getElementById('tempRef').innerHTML = [
    ['Bajo','150°C','300°F'],['Medio','180°C','356°F'],['Fuerte','200°C','392°F'],
    ['Muy fuerte','220°C','428°F'],['Brasa','240°C','464°F'],['Máximo','260°C','500°F'],
  ].map(([l,c,f]) =>
    `<div class="ref-cell"><div class="ref-cell-lbl">${l}</div><div class="ref-cell-val">${c}</div><div class="ref-cell-sub">${f}</div></div>`
  ).join('');
}

function setConvType(t) { convType = t; initConverter(); }

function updateConverter() {
  const val  = parseFloat(document.getElementById('convValue').value);
  const from = document.getElementById('convFrom').value;
  const to   = document.getElementById('convTo').value;
  if (isNaN(val)) { document.getElementById('convResult').textContent = '—'; return; }
  let result;
  if (convType === 'Temperatura') result = from === to ? val : from === '°C' ? val*9/5+32 : (val-32)*5/9;
  else { const b = CONV_TYPES[convType].toBase; result = val*b[from]/b[to]; }
  const d = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));
  document.getElementById('convResult').textContent     = d + ' ' + to;
  document.getElementById('convResultLabel').textContent = `${val} ${from} = ${d} ${to}`;
}

// ═══════════════════════════════════════
//   UTILIDADES
// ═══════════════════════════════════════
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function openLightbox(src) {
  let lb = document.getElementById('lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox-overlay';
    lb.style.display = 'none';
    lb.innerHTML = `
      <button class="lightbox-close" onclick="closeLightbox()">
        <span class="material-symbols-outlined">close</span>
      </button>
      <img id="lightboxImg" class="lightbox-img">`;
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    document.body.appendChild(lb);
  }
  document.getElementById('lightboxImg').src = src;
  lb.style.display = 'flex';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.style.display = 'none';
}

let toastTimer = null;
function showToast(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  if (toastTimer) clearTimeout(toastTimer);
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  toastTimer = setTimeout(() => t.remove(), 2800);
}

// ═══════════════════════════════════════
//   INIT
// ═══════════════════════════════════════

// Crear el input de búsqueda dinámicamente para evitar el gestor de contraseñas de Android
const searchInput = document.createElement('input');
searchInput.setAttribute('type', 'text');
searchInput.setAttribute('id', 'searchInput');
searchInput.setAttribute('placeholder', 'Buscar...');
searchInput.setAttribute('autocomplete', 'new-password');
searchInput.setAttribute('autocorrect', 'off');
searchInput.setAttribute('autocapitalize', 'off');
searchInput.setAttribute('spellcheck', 'false');
searchInput.setAttribute('data-form-type', 'other');
searchInput.setAttribute('data-lpignore', 'true');
searchInput.setAttribute('data-1p-ignore', 'true');
searchInput.setAttribute('role', 'searchbox');
searchInput.setAttribute('aria-autocomplete', 'none');
searchInput.style.cssText = 'border:none;background:none;outline:none;font-size:14px;font-family:Nunito,sans-serif;color:var(--text);flex:1;width:100%;';
searchInput.addEventListener('input', onSearch);
document.getElementById('searchInputWrap').appendChild(searchInput);

initChips(RECIPE_CATEGORIES, recipeFilter, setRecipeFilter);
loadData();

// Service Worker desactivado temporalmente
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/rubencecheff/sw.js').catch(() => {});
//   });
// }

// Botón atrás de Android
history.pushState({ view: 'home' }, '');

window.addEventListener('popstate', (e) => {
  const state = e.state;

  // Cerrar modales abiertos primero
  const openModal = document.querySelector('.modal-overlay[style*="flex"]');
  if (openModal) { openModal.style.display = 'none'; history.pushState({ view: 'modal' }, ''); return; }

  if (!state || state.view === 'home') {
    // Volver a la página principal
    if (document.getElementById('editorPage').classList.contains('active')) {
      cancelRecipeEditor(); history.pushState({ view: 'home' }, ''); return;
    }
    if (document.getElementById('productionEditorPage').classList.contains('active')) {
      cancelProdEditor(); history.pushState({ view: 'home' }, ''); return;
    }
    if (document.getElementById('detailPage').classList.contains('active')) {
      backTo('recipes'); history.pushState({ view: 'home' }, ''); return;
    }
    if (document.getElementById('productionDetailPage').classList.contains('active')) {
      backTo(currentPage || 'productions'); history.pushState({ view: 'home' }, ''); return;
    }
    history.pushState({ view: 'home' }, '');
    return;
  }

  if (state.view === 'editor') {
    if (document.getElementById('editorPage').classList.contains('active')) cancelRecipeEditor();
    else cancelProdEditor();
    return;
  }

  if (state.view === 'recipeDetail') {
    if (document.getElementById('detailPage').classList.contains('active')) backTo('recipes');
    return;
  }

  if (state.view === 'prodDetail') {
    if (document.getElementById('productionDetailPage').classList.contains('active')) backTo(state.fromPage || 'productions');
    return;
  }
});
