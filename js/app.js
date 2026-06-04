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
const APP_VERSION = 'v13';
const ADMIN_PASSWORD = 'chef2024';

const RECIPE_CATEGORIES = ['Todas', 'Carnes', 'Pescados', 'Ensaladas', 'Postres'];

const CAT_TAG = {
  'Carnes':          'tag-carnes',
  'Pescados':        'tag-pescados',
  'Postres':         'tag-postres',
  'Salsas y fondos': 'tag-salsas',
  'Ensaladas':       'tag-ensaladas',
  'Guarniciones':    'tag-guarniciones',
  'Sopas y salsas':  'tag-salsas',
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

// ─── Grupos de proveedor para la lista de pedidos ───
const SUPPLIER_GROUPS = [
  { id: 'aves',       label: 'Aves',                   emoji: '🐔', kw: ['pollo','pollos','pavo','pavos','pato','patos','magret','pechuga','pechugas','muslo','muslos','contramuslo','contramuslos','alita','alitas','gallina','gallinas','codorniz','codornices','perdiz','perdices','pularda','pulardas','capon','capones','pichon','pichones','jamoncito','jamoncitos','ave','aves'] },
  { id: 'carnes',     label: 'Carnes',                 emoji: '🥩', kw: ['ternera','vacuno','buey','solomillo','lomo','cerdo','cochinillo','cordero','lechazo','conejo','costilla','costillar','chuleta','chuleton','entrecot','panceta','bacon','beicon','jamon','chorizo','salchicha','salchichon','morcilla','butifarra','secreto','presa','pluma','carrillera','carrilleras','rabo','codillo','hamburguesa','albondiga','albondigas','foie','higado','callos','manitas','careta','tocino','cabezada'] },
  { id: 'pescados',   label: 'Pescados y mariscos',    emoji: '🐟', kw: ['salmon','merluza','bacalao','atun','bonito','lubina','dorada','rape','mero','rodaballo','lenguado','trucha','sardina','sardinas','boqueron','boquerones','anchoa','anchoas','caballa','jurel','pez','gamba','gambas','langostino','langostinos','cigala','cigalas','bogavante','carabinero','quisquilla','mejillon','mejillones','almeja','almejas','navaja','navajas','berberecho','berberechos','calamar','calamares','chipiron','chipirones','sepia','choco','pulpo','vieira','vieiras','zamburina','ostra','ostras','marisco','percebe','percebes','centollo','necora','langosta'] },
  { id: 'fruver',     label: 'Frutas y verduras',      emoji: '🥬', kw: ['lechuga','tomate','tomates','cebolla','cebolleta','chalota','ajo','ajos','puerro','puerros','pimiento','pimientos','zanahoria','zanahorias','calabacin','berenjena','berenjenas','espinaca','espinacas','acelga','acelgas','brocoli','coliflor','romanesco','patata','patatas','apio','calabaza','champinon','champinones','seta','setas','boletus','niscalo','esparrago','esparragos','judia','judias','guisante','guisantes','haba','habas','rucula','canonigo','canonigos','escarola','endivia','endivias','remolacha','nabo','rabano','rabanos','hinojo','alcachofa','alcachofas','pepino','maiz','col','repollo','lombarda','kale','germinado','brote','brotes','jengibre','aguacate','tirabeque','tirabeques','borraja','cardo','grelo','grelos','perejil','cilantro','albahaca','hierbabuena','menta','manzana','manzanas','pera','peras','platano','platanos','naranja','naranjas','limon','limones','lima','limas','mandarina','pomelo','fresa','fresas','freson','frambuesa','frambuesas','arandano','arandanos','mora','moras','grosella','mango','pina','melon','sandia','uva','uvas','higo','higos','granada','kiwi','melocoton','albaricoque','nectarina','cereza','cerezas','ciruela','ciruelas','coco','maracuya','papaya'] },
  { id: 'lacteos',    label: 'Lácteos y huevos',       emoji: '🧀', kw: ['leche','nata','queso','quesos','mantequilla','yogur','yogures','huevo','huevos','crema','parmesano','mozzarella','mascarpone','requeson','cuajada','kefir','burrata','feta','gruyer','emmental','cheddar','idiazabal','manchego','cabra','mantequa'] },
  { id: 'encurtidos', label: 'Encurtidos y conservas', emoji: '🫙', kw: ['pepinillo','pepinillos','alcaparra','alcaparras','aceituna','aceitunas','encurtido','encurtidos','banderilla','banderillas','guindilla','guindillas','piparra','piparras','conserva','escabeche','antipasto','mojama','salazon','ventresca'] },
  { id: 'panaderia',  label: 'Panadería y pastelería', emoji: '🥖', kw: ['harina','pan','levadura','masa','hojaldre','brioche','miga','picatoste','picatostes','obleas','empanadilla','panko','bizcocho','galleta','galletas','fondant','merengue','crema pastelera','pasta brisa','filo','tortilla de trigo'] },
  { id: 'despensa',   label: 'Despensa y especias',    emoji: '🧂', kw: ['sal','azucar','aceite','vinagre','pimienta','pimenton','comino','curry','canela','nuez moscada','clavo','azafran','laurel','oregano','tomillo','romero','especia','especias','caldo','fondo','soja','mostaza','miel','sirope','chocolate','cacao','almendra','almendras','nuez','nueces','avellana','avellanas','pinon','pinones','pistacho','pistachos','sesamo','gelatina','agar','maicena','fecula','tomate frito','concentrado','mayonesa','ketchup','wasabi','miso','tahini','tahin','vainilla','bicarbonato','glucosa','isomalt','lecitina','arroz','pasta','fideo','fideos','espagueti','macarron','macarrones','cuscus','semola','polenta','bulgur','quinoa','lenteja','lentejas','garbanzo','garbanzos','alubia','alubias','pan rallado'] },
  { id: 'bebidas',    label: 'Bebidas y bodega',       emoji: '🍷', kw: ['vino','brandy','conac','jerez','ron','whisky','cerveza','cava','champan','champagne','oporto','vermut','vermouth','licor','sidra','ginebra','sake','agua','zumo','refresco','tonica'] },
];
const OTHER_GROUP = { id: 'otros', label: 'Otros / Sin asignar', emoji: '📦' };

function normalizeText(s) {
  return (s || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
}

// Coletillas de cantidad que a veces se escriben dentro del nombre del
// ingrediente. Se quitan SOLO para la lista de pedidos (no tocan la receta).
const AMOUNT_NOTE_PHRASES = ['a ojo', 'al gusto', 'cantidad suficiente', 'c/s', 'qb', 'a discrecion', 'a discreción', 'a demanda', 'to taste'];
function cleanIngredientName(raw) {
  let s = (raw || '').toString();
  AMOUNT_NOTE_PHRASES.forEach(p => {
    const esc = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    s = s.replace(new RegExp('\\(?\\s*\\b' + esc + '\\b\\s*\\)?', 'gi'), ' ');
  });
  return s
    .replace(/\(\s*\)/g, ' ')        // paréntesis vacíos
    .replace(/\s{2,}/g, ' ')         // espacios dobles
    .replace(/^[\s,;:.\-–]+|[\s,;:.\-–]+$/g, '') // separadores colgando
    .trim();
}

// Clasifica una materia prima en un grupo. Prioridad: asignación manual
// guardada > diccionario por palabra clave > "Otros / Sin asignar".
function classifyIngredient(name) {
  const key = normalizeText(name);
  if (!key) return 'otros';
  const override = orderState[key] && orderState[key].supplier_group;
  if (override) return override;
  for (const g of SUPPLIER_GROUPS) {
    for (const kw of g.kw) {
      const k = normalizeText(kw).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (new RegExp('\\b' + k + '\\b').test(key)) return g.id;
    }
  }
  return 'otros';
}
function groupMeta(id) { return SUPPLIER_GROUPS.find(g => g.id === id) || OTHER_GROUP; }

let recipes              = [];
let productions          = [];
let recipeProductions    = [];
let comments             = [];
let weights              = [];
let brines               = [];
let productionCategories = [];
let orderItems = [];        // filas de la tabla order_items (estado guardado)
let orderState = {};        // key normalizada -> { name, supplier_group, checked, comment }
let utilTab    = 'pesos';   // 'pesos' | 'conv' | 'pedidos'
let pedidosSearch = '';
let pedidosEdit   = false;  // modo edición de la lista de pedidos
let orderEditCols = false;  // ¿existen las columnas hidden/manual/display_name?
let _pedidosIndex = [];     // ítems de la lista en el render actual (para los onclick)
let isAdmin     = false;
let currentPage = 'recipes';
let savedScroll = {};

// Recetas
let recipeFilter        = 'Todas';
let currentRecipeId     = null;
let recipeEditorMode    = null;
let recipeEditorData    = null;
let recipeEditorBaseline = null;   // snapshot para detectar cambios sin guardar

// Producciones
let prodFilter         = 'Todas';
let currentProdId      = null;
let prodEditorMode     = null;
let prodEditorData     = null;
let prodEditorBaseline = null;     // snapshot para detectar cambios sin guardar
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

    // La tabla de pedidos puede no existir todavía: cárgala sin romper el resto.
    try {
      const { data: oData, error: oErr } = await sb.from('order_items').select('*');
      if (oErr) throw oErr;
      orderItems = oData || [];
    } catch (e) {
      console.warn('order_items no disponible (¿falta crear la tabla?):', e?.message || e);
      orderItems = [];
    }
    // ¿Están las columnas para editar la lista (hidden/manual/display_name)?
    try {
      const { error: cErr } = await sb.from('order_items').select('hidden,manual,display_name').limit(1);
      orderEditCols = !cErr;
    } catch (e) { orderEditCols = false; }
    rebuildOrderState();

    renderRecipes();
    updateBadges();
    restoreAdminSession();

  } catch (err) {
    console.error('Error cargando datos:', err);
    const errHtml = `
      <div class="empty-state">
        <span class="material-symbols-outlined">wifi_off</span>
        Error al conectar con la base de datos
      </div>`;
    const rl = document.getElementById('recipeList');
    const pl = document.getElementById('productionList');
    if (rl) rl.innerHTML = errHtml;
    if (pl) pl.innerHTML = errHtml;
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
  // El buscador global siempre visible
  document.getElementById('searchSection').style.display = '';
  // Los chips de categoría solo en platos y producciones
  document.getElementById('chipsRow').style.display = (isRecipes || isProd) ? '' : 'none';
  document.getElementById('adminAddRecipeRow').style.display    = (isRecipes && isAdmin) ? '' : 'none';
  document.getElementById('adminAddProductionRow').style.display = (isProd    && isAdmin) ? '' : 'none';

  if (isRecipes) { initChips(RECIPE_CATEGORIES, recipeFilter, setRecipeFilter); renderRecipes(); }
  if (isProd)    { const cats = ['Todas', ...productionCategories.map(c => c.name)]; initChips(cats, prodFilter, setProdFilter); renderProductions(); }
  if (page === 'fichas')    renderFichas();
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
  const si = document.getElementById('searchInput');
  const btn = document.getElementById('searchClearBtn');
  const q = (si ? si.innerText : '').trim().toLowerCase();
  if (btn) btn.style.display = q ? 'flex' : 'none';

  // Filtrado inline de la lista actual (platos/producciones)
  if (currentPage === 'recipes')     renderRecipes();
  if (currentPage === 'productions') renderProductions();

  // Búsqueda global en desplegable
  renderSearchDropdown(q);
}

function renderSearchDropdown(q) {
  const dd = document.getElementById('searchDropdown');
  if (!dd) return;
  if (!q) { dd.style.display = 'none'; dd.innerHTML = ''; return; }

  const matchedRecipes = recipes.filter(r => r.name.toLowerCase().includes(q));
  const matchedProds   = productions.filter(p => p.name.toLowerCase().includes(q));

  if (matchedRecipes.length === 0 && matchedProds.length === 0) {
    dd.innerHTML = `<div class="search-dropdown-empty">Sin resultados para "${q}"</div>`;
    dd.style.display = 'block';
    return;
  }

  let html = '';
  if (matchedRecipes.length > 0) {
    html += `<div class="search-dropdown-section">Platos</div>`;
    html += matchedRecipes.map(r => `
      <div class="search-dropdown-item" onclick="goToSearchResult('recipe','${r.id}')">
        <span class="material-symbols-outlined" style="font-size:18px; color:var(--primary);">menu_book</span>
        <div class="search-dropdown-info">
          <div class="search-dropdown-name">${r.name}</div>
          <span class="tag ${CAT_TAG[r.category] || ''}" style="font-size:10px;">${r.category}</span>
        </div>
      </div>`).join('');
  }
  if (matchedProds.length > 0) {
    html += `<div class="search-dropdown-section">Producciones</div>`;
    html += matchedProds.map(p => `
      <div class="search-dropdown-item" onclick="goToSearchResult('production','${p.id}')">
        <span class="material-symbols-outlined" style="font-size:18px; color:var(--primary);">blender</span>
        <div class="search-dropdown-info">
          <div class="search-dropdown-name">${p.name}</div>
          <span class="tag ${CAT_TAG[p.category] || ''}" style="font-size:10px;">${p.category}</span>
        </div>
      </div>`).join('');
  }
  dd.innerHTML = html;
  dd.style.display = 'block';
}

function goToSearchResult(type, id) {
  clearSearch();
  if (type === 'recipe') showRecipeDetail(id);
  else showProdDetail(id);
}

function clearSearch() {
  const si = document.getElementById('searchInput');
  if (si) si.innerText = '';
  const btn = document.getElementById('searchClearBtn');
  if (btn) btn.style.display = 'none';
  const dd = document.getElementById('searchDropdown');
  if (dd) { dd.style.display = 'none'; dd.innerHTML = ''; }
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
//   FORMATO CANTIDADES
// ═══════════════════════════════════════
function initSortable(containerId, arr, rerender) {
  const el = document.getElementById(containerId);
  if (!el || typeof Sortable === 'undefined') return;
  Sortable.create(el, {
    handle: '.drag-handle',
    animation: 150,
    delay: 120,
    delayOnTouchOnly: true,
    onEnd: (evt) => {
      if (evt.oldIndex === evt.newIndex) return;
      const item = arr.splice(evt.oldIndex, 1)[0];
      arr.splice(evt.newIndex, 0, item);
      rerender();
    }
  });
}

function formatAmount(amount) {
  const fractions = {
    0.25: '¼', 0.5: '½', 0.75: '¾',
    0.33: '⅓', 0.333: '⅓', 0.66: '⅔', 0.667: '⅔',
    1.25: '1¼', 1.5: '1½', 1.75: '1¾',
    2.5: '2½', 3.5: '3½',
  };
  if (Number.isInteger(amount)) return amount;
  const rounded = parseFloat(amount.toFixed(3));
  return fractions[rounded] !== undefined ? fractions[rounded] : parseFloat(amount.toFixed(2));
}

// ═══════════════════════════════════════
//   RECETAS — LISTA
// ═══════════════════════════════════════
function renderRecipes() {
  const si = document.getElementById('searchInput');
  const q = (si ? (si.innerText || '') : '').trim().toLowerCase();
  const filtered = recipes.filter(r =>
    (recipeFilter === 'Todas' || r.category === recipeFilter) &&
    r.name.toLowerCase().includes(q)
  ).sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));

  const list = document.getElementById('recipeList');
  if (!list) return;

  if (filtered.length === 0) {
    let msg;
    if (recipes.length === 0) msg = 'Aún no hay platos creados';
    else if (q) msg = `Ningún plato coincide con "${q}"`;
    else msg = `No hay platos en "${recipeFilter}"`;
    list.innerHTML = `<div class="empty-state"><span class="material-symbols-outlined">restaurant</span>${msg}</div>`;
    return;
  }

  list.innerHTML = filtered.map(r => {
    const numProds = recipeProductions.filter(rp => rp.recipe_id === r.id).length;
    return `
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
        ${numProds > 0 ? `<div class="recipe-card-footer"><span><span class="material-symbols-outlined">blender</span>${numProds} ${numProds === 1 ? 'producción' : 'producciones'}</span></div>` : ''}
      </div>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════
//   RECETAS — DETALLE
// ═══════════════════════════════════════
function showRecipeDetail(id) {
  savedScroll[currentPage] = window.scrollY;
  currentRecipeId = id;
  history.pushState({ view: 'recipeDetail', id, fromPage: currentPage }, '');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('detailPage').classList.add('active');
  document.getElementById('searchSection').style.display = 'none';
  document.getElementById('adminAddRecipeRow').style.display = 'none';
  document.getElementById('mainNav').style.display = 'none';
  window.scrollTo(0, 0);
  renderRecipeDetail();
}

function renderRecipeDetail() {
  const r = recipes.find(x => x.id === currentRecipeId);
  if (!r) return;

  // Producciones vinculadas (ordenadas por sort_order)
  const linkedRels = recipeProductions
    .filter(rp => rp.recipe_id === r.id)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const linkedProds = linkedRels
    .map(rel => productions.find(p => p.id === rel.production_id))
    .filter(Boolean);

  const prodsHtml = linkedProds.length > 0
    ? linkedProds.map((p, idx) => `
        <div class="prod-link-row">
          <div style="flex:1; display:flex; align-items:center; gap:8px;" onclick="showProdDetail('${p.id}')">
            ${isAdmin ? `<div class="reorder-btns">
              <button class="reorder-btn" ${idx === 0 ? 'disabled' : ''} onclick="event.stopPropagation(); moveLinkedProd('${r.id}',${idx},-1)"><span class="material-symbols-outlined">keyboard_arrow_up</span></button>
              <button class="reorder-btn" ${idx === linkedProds.length - 1 ? 'disabled' : ''} onclick="event.stopPropagation(); moveLinkedProd('${r.id}',${idx},1)"><span class="material-symbols-outlined">keyboard_arrow_down</span></button>
            </div>` : ''}
            <div>
              <div class="prod-link-name">${p.name}</div>
              <span class="tag ${CAT_TAG[p.category] || ''}" style="font-size:10px;">${p.category}</span>
            </div>
          </div>
          <span class="material-symbols-outlined" style="color:var(--outline);" onclick="showProdDetail('${p.id}')">chevron_right</span>
        </div>`).join('')
    : `<p style="font-size:13px; color:var(--text2); padding:8px 0;">Sin producciones vinculadas</p>`;

  const ings = r.ingredients.map(ing =>
    `<div class="ing-row">
      <span class="ing-name">${ing.name}</span>
      <span class="ing-amount">${formatAmount(ing.amount)} ${ing.unit}</span>
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
    const cats = ['Todas', ...productionCategories.map(c => c.name)];
    initChips(cats, prodFilter, setProdFilter);
  }
  // Restaurar la posición de scroll donde estaba el usuario
  const y = savedScroll[page] || 0;
  requestAnimationFrame(() => window.scrollTo(0, y));
}

// ═══════════════════════════════════════
//   RECETAS — EDITOR
// ═══════════════════════════════════════
function openAddRecipe() {
  recipeEditorMode = 'add';
  recipeEditorData = { id: Date.now().toString(), name: '', category: 'Carnes', servings: 4, description: '', photo: '', plating: '', ingredients: [], steps: [] };
  recipeEditorBaseline = JSON.stringify(recipeEditorData);
  renderRecipeEditor();
  enterEditor('editorPage');
}

function openEditRecipe() {
  recipeEditorMode = 'edit';
  recipeEditorData = JSON.parse(JSON.stringify(recipes.find(r => r.id === currentRecipeId)));
  recipeEditorBaseline = JSON.stringify(recipeEditorData);
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
        <div class="form-input ce-input" contenteditable="true" data-placeholder="https://..." oninput="recipeEditorData.photo=this.innerText.trim()">${r.photo}</div>
      </div>
    </div>`;

  const ings = r.ingredients.map((ing, i) => `
    <div class="ing-edit-row" data-index="${i}">
      <div class="drag-handle"><span class="material-symbols-outlined">drag_indicator</span></div>
      <div class="ing-edit-name ce-input" contenteditable="true" data-placeholder="Ingrediente" oninput="recipeEditorData.ingredients[${i}].name=this.innerText.trim()">${ing.name}</div>
      <div class="ing-edit-amount ce-input" contenteditable="true" inputmode="decimal" data-placeholder="0" oninput="recipeEditorData.ingredients[${i}].amount=parseFloat(this.innerText.replace(',','.'))||0">${ing.amount}</div>
      <div class="ing-edit-unit ce-input" contenteditable="true" data-placeholder="ud" oninput="recipeEditorData.ingredients[${i}].unit=this.innerText.trim()">${ing.unit}</div>
      <button class="btn-remove" onclick="recipeEditorData.ingredients.splice(${i},1); renderRecipeEditor();">
        <span class="material-symbols-outlined" style="font-size:20px;">close</span>
      </button>
    </div>`).join('');

  const stps = r.steps.map((s, i) => `
    <div class="step-edit-row" data-index="${i}">
      <div class="drag-handle"><span class="material-symbols-outlined">drag_indicator</span></div>
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
        <div class="form-input contenteditable-input" contenteditable="true" data-placeholder="Nombre de la receta..." oninput="recipeEditorData.name=this.innerText.trim()">${r.name}</div>
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

  initSortable('recipeIngList', recipeEditorData.ingredients, renderRecipeEditor);
  initSortable('recipeStepList', recipeEditorData.steps, renderRecipeEditor);
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
  const ok = await runWithLoading(btn, 'Guardando...', async () => {
    const { error } = await sb.from('recipes').upsert(recipeEditorData);
    if (error) { showToast('Error al guardar'); return false; }
    return true;
  });
  if (!ok) return;
  if (recipeEditorMode === 'add') recipes.push(recipeEditorData);
  else recipes = recipes.map(r => r.id === recipeEditorData.id ? recipeEditorData : r);
  currentRecipeId = recipeEditorData.id;
  recipeEditorBaseline = JSON.stringify(recipeEditorData); // ya guardado: sin cambios pendientes
  showToast('Receta guardada ✓');
  refreshPedidosIfVisible();
  exitRecipeEditor(true);
}

function cancelRecipeEditor() { return requestExitRecipeEditor(); }

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
  recipeEditorMode = null; recipeEditorData = null; recipeEditorBaseline = null;
}

async function deleteRecipe(id) {
  const ok = await showConfirm({
    title:       'Eliminar receta',
    message:     '¿Seguro que quieres eliminar esta receta? Esta acción no se puede deshacer.',
    confirmText: 'Eliminar',
    danger:      true,
    icon:        'delete',
    onConfirm:   async () => {
      const { error } = await sb.from('recipes').delete().eq('id', id);
      if (error) throw error;
      recipes = recipes.filter(r => r.id !== id);
    },
  });
  if (!ok) return;
  showToast('Receta eliminada');
  refreshPedidosIfVisible();
  backTo('recipes'); renderRecipes();
}

// ═══════════════════════════════════════
//   VINCULAR PRODUCCIONES
// ═══════════════════════════════════════
function openLinkModal(recipeId) {
  linkingRecipeId = recipeId;
  document.querySelector('#linkModal .modal-title').textContent = 'Vincular producciones';
  document.querySelector('#linkModal .btn-action').setAttribute('onclick', 'saveLinkProductions()');
  selectedProdIds = recipeProductions.filter(rp => rp.recipe_id === recipeId).map(rp => rp.production_id);
  const sortedProds = [...productions].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  document.getElementById('linkProductionList').innerHTML = sortedProds.length === 0
    ? '<p style="color:var(--text2); font-size:13px;">No hay producciones creadas aún.</p>'
    : sortedProds.map(p => `
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
  const btn = document.querySelector('#linkModal .btn-action');
  await runWithLoading(btn, 'Guardando...', async () => {
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
  });
  closeModal('linkModal');
  showToast('Producciones vinculadas ✓');
  renderRecipeDetail();
}

async function moveLinkedProd(recipeId, idx, dir) {
  const rels = recipeProductions
    .filter(rp => rp.recipe_id === recipeId)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= rels.length) return;
  // Intercambiar
  const tmp = rels[idx];
  rels[idx] = rels[newIdx];
  rels[newIdx] = tmp;
  // Reasignar sort_order y guardar
  for (let i = 0; i < rels.length; i++) {
    rels[i].sort_order = i;
    await sb.from('recipe_productions').update({ sort_order: i }).eq('id', rels[i].id);
  }
  renderRecipeDetail();
}

// ─── Vincular platos desde una producción ───
let linkingProdId = null;
let selectedRecipeIds = [];

function openLinkRecipesModal(prodId) {
  linkingProdId = prodId;
  selectedRecipeIds = recipeProductions.filter(rp => rp.production_id === prodId).map(rp => rp.recipe_id);
  const sortedRecipes = [...recipes].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  document.getElementById('linkProductionList').innerHTML = sortedRecipes.length === 0
    ? '<p style="color:var(--text2); font-size:13px;">No hay platos creados aún.</p>'
    : sortedRecipes.map(r => `
        <div class="link-prod-row" onclick="toggleRecipeLink('${r.id}', this)">
          <div>
            <div style="font-size:14px; font-weight:600;">${r.name}</div>
            <span class="tag ${CAT_TAG[r.category] || ''}" style="font-size:10px;">${r.category}</span>
          </div>
          <span class="material-symbols-outlined check-icon" style="color:${selectedRecipeIds.includes(r.id) ? 'var(--primary)' : 'var(--outline-light)'};">
            ${selectedRecipeIds.includes(r.id) ? 'check_circle' : 'radio_button_unchecked'}
          </span>
        </div>`).join('');
  // Cambiar título y acción del modal
  document.querySelector('#linkModal .modal-title').textContent = 'Vincular platos';
  document.querySelector('#linkModal .btn-action').setAttribute('onclick', 'saveLinkRecipes()');
  document.getElementById('linkModal').style.display = 'flex';
}

function toggleRecipeLink(recipeId, row) {
  if (selectedRecipeIds.includes(recipeId)) {
    selectedRecipeIds = selectedRecipeIds.filter(id => id !== recipeId);
  } else {
    selectedRecipeIds.push(recipeId);
  }
  const icon = row.querySelector('.check-icon');
  icon.textContent = selectedRecipeIds.includes(recipeId) ? 'check_circle' : 'radio_button_unchecked';
  icon.style.color = selectedRecipeIds.includes(recipeId) ? 'var(--primary)' : 'var(--outline-light)';
}

async function saveLinkRecipes() {
  const btn = document.querySelector('#linkModal .btn-action');
  await runWithLoading(btn, 'Guardando...', async () => {
    // Para cada plato seleccionado, añadir el vínculo si no existe.
    // Para los deseleccionados, quitarlo.
    const currentlyLinked = recipeProductions.filter(rp => rp.production_id === linkingProdId).map(rp => rp.recipe_id);

    // Añadir nuevos
    for (const rid of selectedRecipeIds) {
      if (!currentlyLinked.includes(rid)) {
        const order = recipeProductions.filter(rp => rp.recipe_id === rid).length;
        const row = { id: `${rid}_${linkingProdId}`, recipe_id: rid, production_id: linkingProdId, sort_order: order };
        await sb.from('recipe_productions').insert(row);
        recipeProductions.push(row);
      }
    }
    // Quitar los deseleccionados
    for (const rid of currentlyLinked) {
      if (!selectedRecipeIds.includes(rid)) {
        await sb.from('recipe_productions').delete().eq('id', `${rid}_${linkingProdId}`);
        recipeProductions = recipeProductions.filter(rp => rp.id !== `${rid}_${linkingProdId}`);
      }
    }
  });
  // Restaurar el modal a su estado original (vincular producciones)
  document.querySelector('#linkModal .modal-title').textContent = 'Vincular producciones';
  document.querySelector('#linkModal .btn-action').setAttribute('onclick', 'saveLinkProductions()');
  closeModal('linkModal');
  showToast('Platos vinculados ✓');
  renderProdDetail(currentPage);
}

// ═══════════════════════════════════════
//   PRODUCCIONES — LISTA
// ═══════════════════════════════════════
function renderProductions() {
  const si = document.getElementById('searchInput');
  const q = (si ? (si.innerText || '') : '').trim().toLowerCase();
  const filtered = productions.filter(p =>
    (prodFilter === 'Todas' || p.category === prodFilter) &&
    p.name.toLowerCase().includes(q)
  ).sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));

  const list = document.getElementById('productionList');
  if (!list) return;

  if (filtered.length === 0) {
    let msg;
    if (productions.length === 0) msg = 'Aún no hay producciones creadas';
    else if (q) msg = `Ninguna producción coincide con "${q}"`;
    else msg = `No hay producciones en "${prodFilter}"`;
    list.innerHTML = `<div class="empty-state"><span class="material-symbols-outlined">blender</span>${msg}</div>`;
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
  savedScroll[currentPage] = window.scrollY;
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
  window.scrollTo(0, 0);
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
      <span class="ing-amount">${formatAmount(v)} ${ing.unit}</span>
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
    <button class="btn-pill" onclick="openLinkRecipesModal('${p.id}')">
      <span class="material-symbols-outlined" style="font-size:16px;">link</span> Vincular plato
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
    </div>
    <div class="card">
      <div class="section-title"><span class="material-symbols-outlined">menu_book</span> Platos que la usan</div>
      ${(() => {
        const linkedRecipeIds = recipeProductions.filter(rp => rp.production_id === p.id).map(rp => rp.recipe_id);
        const linkedRecipes = recipes.filter(r => linkedRecipeIds.includes(r.id))
          .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
        return linkedRecipes.length > 0
          ? linkedRecipes.map(r => `
              <div class="prod-link-row" onclick="goToRecipeFromProd('${r.id}')">
                <div>
                  <div class="prod-link-name">${r.name}</div>
                  <span class="tag ${CAT_TAG[r.category] || ''}" style="font-size:10px;">${r.category}</span>
                </div>
                <span class="material-symbols-outlined" style="color:var(--outline);">chevron_right</span>
              </div>`).join('')
          : `<p style="font-size:13px; color:var(--text2); padding:8px 0;">No está vinculada a ningún plato</p>`;
      })()}
    </div>`;
}

function setProdMultiplier(m, fromPage) {
  currentMultiplier = m;
  renderProdDetail(fromPage);
}

function goToRecipeFromProd(recipeId) {
  currentRecipeId = recipeId;
  history.pushState({ view: 'recipeDetail', id: recipeId, fromPage: 'productions' }, '');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('detailPage').classList.add('active');
  renderRecipeDetail();
}

// ═══════════════════════════════════════
//   PRODUCCIONES — EDITOR
// ═══════════════════════════════════════
function openAddProduction() {
  prodEditorMode = 'add';
  const defaultCat = productionCategories.length > 0 ? productionCategories[0].name : '';
  prodEditorData = { id: Date.now().toString(), name: '', category: defaultCat, description: '', ingredients: [], steps: [] };
  prodEditorBaseline = JSON.stringify(prodEditorData);
  renderProdEditor();
  enterEditor('productionEditorPage');
}

function openEditProduction() {
  prodEditorMode = 'edit';
  prodEditorData = JSON.parse(JSON.stringify(productions.find(p => p.id === currentProdId)));
  prodEditorBaseline = JSON.stringify(prodEditorData);
  renderProdEditor();
  enterEditor('productionEditorPage');
}

function renderProdEditor() {
  const p = prodEditorData;
  const isNew = prodEditorMode === 'add';

  const ings = p.ingredients.map((ing, i) => `
    <div class="ing-edit-row" data-index="${i}">
      <div class="drag-handle"><span class="material-symbols-outlined">drag_indicator</span></div>
      <div class="ing-edit-name ce-input" contenteditable="true" data-placeholder="Ingrediente" oninput="prodEditorData.ingredients[${i}].name=this.innerText.trim()">${ing.name}</div>
      <div class="ing-edit-amount ce-input" contenteditable="true" inputmode="decimal" data-placeholder="0" oninput="prodEditorData.ingredients[${i}].amount=parseFloat(this.innerText.replace(',','.'))||0">${ing.amount}</div>
      <div class="ing-edit-unit ce-input" contenteditable="true" data-placeholder="ud" oninput="prodEditorData.ingredients[${i}].unit=this.innerText.trim()">${ing.unit}</div>
      <button class="btn-remove" onclick="prodEditorData.ingredients.splice(${i},1); renderProdEditor();">
        <span class="material-symbols-outlined" style="font-size:20px;">close</span>
      </button>
    </div>`).join('');

  const stps = p.steps.map((s, i) => `
    <div class="step-edit-row" data-index="${i}">
      <div class="drag-handle"><span class="material-symbols-outlined">drag_indicator</span></div>
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
        <div class="form-input contenteditable-input" contenteditable="true" data-placeholder="Nombre de la producción..." oninput="prodEditorData.name=this.innerText.trim()">${p.name}</div>
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
      <div id="prodIngList">${ings}</div>
    </div>
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div class="section-title" style="margin-bottom:0;"><span class="material-symbols-outlined">format_list_numbered</span> Elaboración</div>
        <button class="btn-pill" onclick="prodEditorData.steps.push(''); renderProdEditor();">
          <span class="material-symbols-outlined" style="font-size:16px;">add</span> Añadir paso
        </button>
      </div>
      <div id="prodStepList">${stps}</div>
    </div>`;

  initSortable('prodIngList', prodEditorData.ingredients, renderProdEditor);
  initSortable('prodStepList', prodEditorData.steps, renderProdEditor);
}

async function saveProduction() {
  if (!prodEditorData.name.trim()) { showToast('El nombre es obligatorio'); return; }
  const btn = document.getElementById('saveProdBtn');
  const ok = await runWithLoading(btn, 'Guardando...', async () => {
    const { error } = await sb.from('productions').upsert(prodEditorData);
    if (error) { showToast('Error al guardar'); return false; }
    return true;
  });
  if (!ok) return;
  if (prodEditorMode === 'add') productions.push(prodEditorData);
  else productions = productions.map(p => p.id === prodEditorData.id ? prodEditorData : p);
  currentProdId = prodEditorData.id;
  prodEditorBaseline = JSON.stringify(prodEditorData);
  showToast('Producción guardada ✓');
  refreshPedidosIfVisible();
  exitProdEditor(true);
}

function cancelProdEditor() { return requestExitProdEditor(); }

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
  prodEditorMode = null; prodEditorData = null; prodEditorBaseline = null;
}

async function deleteProduction(id) {
  const ok = await showConfirm({
    title:       'Eliminar producción',
    message:     '¿Seguro que quieres eliminar esta producción? Esta acción no se puede deshacer.',
    confirmText: 'Eliminar',
    danger:      true,
    icon:        'delete',
    onConfirm:   async () => {
      const { error } = await sb.from('productions').delete().eq('id', id);
      if (error) throw error;
      productions = productions.filter(p => p.id !== id);
    },
  });
  if (!ok) return;
  showToast('Producción eliminada');
  refreshPedidosIfVisible();
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
  const btn = document.querySelector('#commentModal .btn-action');
  const ok = await runWithLoading(btn, 'Enviando...', async () => {
    const { error } = await sb.from('comments').insert(newComment);
    if (error) { showToast('Error al enviar'); return false; }
    return true;
  });
  if (!ok) return;
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
    try { localStorage.removeItem('rubencechef-admin'); } catch(e) {}
    document.getElementById('adminBtn').innerHTML = `<span class="material-symbols-outlined" style="font-size:16px;">lock</span> Admin`;
    document.getElementById('adminAddRecipeRow').style.display    = 'none';
    document.getElementById('adminAddProductionRow').style.display = 'none';
    document.getElementById('addWeightBtn').style.display = 'none';
    document.getElementById('addBrineBtn').style.display  = 'none';
    if (currentPage === 'fichas') renderFichas();
    showToast('Sesión cerrada');
  } else {
    // Crear modal dinámicamente — el campo password no existe en el DOM
    // hasta que se necesita, evitando que Android lo asocie con otros campos
    const existing = document.getElementById('loginModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'loginModal';
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-sheet" onclick="event.stopPropagation()">
        <div class="modal-header">
          <span class="modal-title">Acceso Administrador</span>
          <button class="modal-close" onclick="closeLoginModal()">✕</button>
        </div>
        <div style="text-align:center; padding:12px 0 20px;">
          <span class="material-symbols-outlined" style="font-size:52px; color:var(--primary);">lock</span>
        </div>
        <div class="form-group">
          <div class="form-label">Contraseña</div>
          <input type="password" class="form-input" id="loginInput"
            placeholder="Contraseña de administrador"
            onkeydown="if(event.key==='Enter') doLogin()">
        </div>
        <p id="loginError" style="color:var(--danger); font-size:13px; display:none; margin-bottom:12px;">Contraseña incorrecta</p>
        <button class="btn-action" onclick="doLogin()">Entrar</button>
      </div>`;
    modal.addEventListener('click', e => { if (e.target === modal) closeLoginModal(); });
    document.body.appendChild(modal);
    setTimeout(() => document.getElementById('loginInput')?.focus(), 150);
  }
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.remove();
}

function doLogin() {
  if (document.getElementById('loginInput').value === ADMIN_PASSWORD) {
    isAdmin = true;
    try { localStorage.setItem('rubencechef-admin', '1'); } catch(e) {}
    closeLoginModal();
    activateAdminUI();
    showToast('Bienvenido, Chef 👨‍🍳');
    if (currentRecipeId && document.getElementById('detailPage').classList.contains('active')) renderRecipeDetail();
    if (currentProdId   && document.getElementById('productionDetailPage').classList.contains('active')) renderProdDetail(currentPage);
    if (currentPage === 'admin') renderAdmin();
  } else {
    const err = document.getElementById('loginError');
    if (err) err.style.display = '';
  }
}

function activateAdminUI() {
  document.getElementById('adminBtn').innerHTML =
    `<span class="material-symbols-outlined" style="font-size:16px;">person</span> Chef
     <span class="material-symbols-outlined" style="font-size:14px;">logout</span>`;
  if (currentPage === 'recipes')     document.getElementById('adminAddRecipeRow').style.display    = '';
  if (currentPage === 'productions') document.getElementById('adminAddProductionRow').style.display = '';
  if (currentPage === 'fichas') renderFichas();
}

function restoreAdminSession() {
  let saved = false;
  try { saved = localStorage.getItem('rubencechef-admin') === '1'; } catch(e) {}
  if (saved) {
    isAdmin = true;
    activateAdminUI();
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
          <button class="btn-pill" onclick="resolveComment('${c.id}', this)">
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
        <button class="btn-icon" onclick="renameProdCategory('${c.id}')">
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
        <div class="form-input ce-input" id="newCatInput" contenteditable="true" data-placeholder="Nueva categoría..." style="flex:1;"></div>
        <button class="btn-pill filled" id="addCatBtn" onclick="addProdCategory()">
          <span class="material-symbols-outlined" style="font-size:16px;">add</span>
        </button>
      </div>
    </div>`;
}

async function resolveComment(id, btn) {
  await runWithLoading(btn, '', async () => {
    const { error } = await sb.from('comments').update({ resolved: true }).eq('id', id);
    if (error) { showToast('Error al resolver'); throw error; }
    comments = comments.map(c => c.id === id ? { ...c, resolved: true } : c);
  }).catch(() => {});
  updateBadges(); renderAdmin();
}

// ─── Categorías de producción ─────────
async function addProdCategory() {
  const input = document.getElementById('newCatInput');
  const name = (input?.innerText || '').trim();
  if (!name) return;
  const newCat = { id: Date.now().toString(), name, sort_order: productionCategories.length + 1 };
  const btn = document.getElementById('addCatBtn');
  const ok = await runWithLoading(btn, '', async () => {
    const { error } = await sb.from('production_categories').insert(newCat);
    if (error) { showToast('Error al añadir'); return false; }
    return true;
  });
  if (!ok) return;
  productionCategories.push(newCat);
  showToast('Categoría añadida ✓');
  renderAdmin();
}

async function renameProdCategory(id) {
  const cat = productionCategories.find(c => c.id === id);
  if (!cat) return;
  const currentName = cat.name;
  const newName = await showPrompt({
    title:       'Renombrar categoría',
    label:       'Nuevo nombre',
    value:       currentName,
    placeholder: 'Nombre de la categoría',
    confirmText: 'Guardar',
    onConfirm:   async (name) => {
      if (name === currentName) return;
      const { error } = await sb.from('production_categories').update({ name }).eq('id', id);
      if (error) throw error;
      productionCategories = productionCategories.map(c => c.id === id ? { ...c, name } : c);
      productions = productions.map(p => p.category === currentName ? { ...p, category: name } : p);
    },
  });
  if (!newName || newName === currentName) return;
  showToast('Categoría renombrada ✓');
  renderAdmin();
}

async function deleteProdCategory(id) {
  const cat = productionCategories.find(c => c.id === id);
  if (!cat) return;
  const ok = await showConfirm({
    title:       'Eliminar categoría',
    message:     `¿Seguro que quieres eliminar la categoría "${cat.name}"?`,
    confirmText: 'Eliminar',
    danger:      true,
    icon:        'delete',
    onConfirm:   async () => {
      const { error } = await sb.from('production_categories').delete().eq('id', id);
      if (error) throw error;
      productionCategories = productionCategories.filter(c => c.id !== id);
    },
  });
  if (!ok) return;
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
// ═══════════════════════════════════════
//   UTILIDADES (Pesos · Conversión · Pedidos)
// ═══════════════════════════════════════
function renderFichas() {
  const segPed = document.getElementById('seg-pedidos');
  if (segPed) segPed.style.display = isAdmin ? '' : 'none';
  if (utilTab === 'pedidos' && !isAdmin) utilTab = 'pesos';

  document.getElementById('seg-pesos').classList.toggle('active', utilTab === 'pesos');
  document.getElementById('seg-conv').classList.toggle('active', utilTab === 'conv');
  if (segPed) segPed.classList.toggle('active', utilTab === 'pedidos');

  document.getElementById('utilPesos').style.display   = utilTab === 'pesos'   ? '' : 'none';
  document.getElementById('utilConv').style.display    = utilTab === 'conv'    ? '' : 'none';
  document.getElementById('utilPedidos').style.display = utilTab === 'pedidos' ? '' : 'none';

  if (utilTab === 'pesos')   renderPesos();
  if (utilTab === 'conv')    renderConvTab();
  if (utilTab === 'pedidos') renderPedidos();
}
function setUtilTab(tab) { utilTab = tab; renderFichas(); }

function renderPesos() {
  document.getElementById('addWeightBtn').style.display = isAdmin ? '' : 'none';
  document.getElementById('addBrineBtn').style.display  = isAdmin ? '' : 'none';
  renderWeights();
  renderBrines();
}

function renderConvTab() {
  initConverter();
  updateRuleOfThree();
}

// ─── Regla de tres ─────────────────────
function updateRuleOfThree() {
  const a = parseFloat(document.getElementById('rotA').value);
  const b = parseFloat(document.getElementById('rotB').value);
  const c = parseFloat(document.getElementById('rotC').value);
  const box = document.getElementById('rotResult');
  if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) { box.style.display = 'none'; return; }
  const x = b * c / a;
  const d = Number.isInteger(x) ? x : parseFloat(x.toFixed(3));
  document.getElementById('rotResultVal').textContent = d;
  document.getElementById('rotResultLbl').textContent = `${fmtNum(a)} : ${fmtNum(b)}  =  ${fmtNum(c)} : ${d}`;
  box.style.display = '';
}
function fmtNum(n) { return Number.isInteger(n) ? n : parseFloat(n.toFixed(3)); }

// ═══════════════════════════════════════
//   LISTA DE PEDIDOS
// ═══════════════════════════════════════
let _pedIndexByKey = {};

function escAttr(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Reconstruye el estado guardado (check/comentario/grupo/edición) por materia prima.
function rebuildOrderState() {
  orderState = {};
  (orderItems || []).forEach(it => {
    const key = it.key || normalizeText(it.name);
    if (!key) return;
    orderState[key] = {
      name: it.name || key,
      supplier_group: it.supplier_group || null,
      checked: !!it.checked,
      comment: it.comment || '',
      hidden: !!it.hidden,
      manual: !!it.manual,
      display_name: it.display_name || null,
    };
  });
}

// Lista de materias primas en vivo desde ingredientes de recetas + producciones,
// más los nombres de pesos de ración y de salmueras.
function buildMateriasPrimas() {
  const map = {}; // key normalizada -> nombre a mostrar
  const addName = (raw) => {
    const cleaned = cleanIngredientName(raw);
    if (!cleaned) return;
    const key = normalizeText(cleaned);
    if (!key || map[key]) return;
    map[key] = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  };
  const addIngredients = (arr) => (arr || []).forEach(e => (e.ingredients || []).forEach(ing => addName(ing.name)));
  addIngredients(recipes);
  addIngredients(productions);
  (weights || []).forEach(w => addName(w.name));     // pesos de ración
  (brines  || []).forEach(b => addName(b.product));  // salmueras
  return map;
}

// La lista de pedidos es 100% manual: se construye solo con los artículos
// que el admin añade (no se saca de recetas, producciones, pesos ni salmueras).
function buildPedidoEntries() {
  const entries = [];
  Object.keys(orderState).forEach(key => {
    const st = orderState[key];
    if (!st || !st.manual) return; // solo ítems añadidos a mano
    const display = st.display_name || st.name || key;
    entries.push({
      key, display,
      group: st.supplier_group || classifyIngredient(display),
      checked: !!st.checked, comment: st.comment || '',
    });
  });
  return { entries };
}

function renderPedidos() {
  const root = document.getElementById('utilPedidos');
  if (!root) return;
  if (!isAdmin) {
    root.innerHTML = `<div class="ped-locked"><span class="material-symbols-outlined">lock</span>Esta sección es solo para administradores.</div>`;
    return;
  }
  root.innerHTML = `
    <div class="ped-toolbar">
      <div class="ped-search">
        <span class="material-symbols-outlined">search</span>
        <input type="text" id="pedSearchInput" placeholder="Buscar en la lista…" oninput="onPedidosSearch(this.value)">
      </div>
      ${orderEditCols ? `<button class="btn-pill ${pedidosEdit ? '' : 'ghost'}" id="pedEditBtn" onclick="setPedidosEdit(${!pedidosEdit})">
        <span class="material-symbols-outlined" style="font-size:15px;">${pedidosEdit ? 'done' : 'edit'}</span> ${pedidosEdit ? 'Listo' : 'Editar'}
      </button>` : ''}
      <button class="btn-pill ghost" onclick="resetPedidos()">
        <span class="material-symbols-outlined" style="font-size:15px;">restart_alt</span> Reiniciar
      </button>
    </div>
    ${!orderEditCols ? `<div class="ped-hint">Para poder crear y editar la lista, ejecuta la pequeña actualización SQL que te paso.</div>` : ''}
    <div class="ped-count" id="pedCount"></div>
    <div id="pedList"></div>
    <div class="ped-send-bar">
      <button class="btn-action" id="pedSendBtn" onclick="sendPedidoPDF()"></button>
    </div>`;
  document.getElementById('pedSearchInput').value = pedidosSearch;
  renderPedidosList();
}

function onPedidosSearch(v) { pedidosSearch = v; renderPedidosList(); }
function setPedidosEdit(on) { pedidosEdit = !!on; renderPedidos(); }

function renderPedidosList() {
  const listEl = document.getElementById('pedList');
  if (!listEl) return;
  const q = normalizeText(pedidosSearch);

  const { entries: all } = buildPedidoEntries();
  _pedIndexByKey = {};
  all.forEach(e => { _pedIndexByKey[e.key] = e; });

  const totalItems   = all.length;
  const totalChecked = all.filter(e => e.checked).length;

  let entries = all;
  if (q) entries = entries.filter(e => normalizeText(e.display).includes(q));

  const byGroup = {};
  entries.forEach(e => (byGroup[e.group] = byGroup[e.group] || []).push(e));
  const order = [...SUPPLIER_GROUPS.map(g => g.id), 'otros'];

  let html = '';
  if (orderEditCols) {
    html += `<button class="btn-pill ped-add" onclick="addManualMateriaPrima()">
      <span class="material-symbols-outlined" style="font-size:16px;">add</span> Añadir artículo
    </button>`;
  }

  if (entries.length === 0) {
    html += `<div class="empty-state"><span class="material-symbols-outlined">${q ? 'search_off' : 'inventory_2'}</span>${q ? 'Sin coincidencias' : 'Lista vacía. Pulsa "Añadir artículo" para empezar tu lista de pedidos.'}</div>`;
  } else {
    order.forEach(gid => {
      const list = byGroup[gid];
      if (!list || !list.length) return;
      const meta = groupMeta(gid);
      list.sort((a, b) => a.display.localeCompare(b.display, 'es', { sensitivity: 'base' }));
      html += `<div class="order-group-head"><span class="gh-emoji">${meta.emoji}</span> ${meta.label} <span class="gh-count">${list.length}</span></div>`;
      list.forEach(e => {
        const k = encodeURIComponent(e.key);
        if (pedidosEdit) {
          html += `
            <div class="order-row edit">
              <span class="order-name">${e.display}</span>
              <button class="order-act btn-icon" onclick="renamePedido('${k}')" title="Renombrar"><span class="material-symbols-outlined">edit</span></button>
              <button class="order-act btn-icon" onclick="openGroupPicker('${k}')" title="Cambiar grupo"><span class="material-symbols-outlined">swap_horiz</span></button>
              <button class="order-act btn-icon" onclick="deletePedido('${k}')" title="Eliminar"><span class="material-symbols-outlined" style="color:var(--danger);">delete</span></button>
            </div>`;
        } else {
          html += `
            <div class="order-row ${e.checked ? 'checked' : ''}">
              <span class="order-check material-symbols-outlined" onclick="togglePedido('${k}')">${e.checked ? 'check_circle' : 'radio_button_unchecked'}</span>
              <span class="order-name">${e.display}</span>
              <input class="order-comment" type="text" placeholder="Nota…" value="${escAttr(e.comment)}" onchange="setPedidoComment('${k}', this.value)">
              <button class="order-move btn-icon" onclick="openGroupPicker('${k}')"><span class="material-symbols-outlined">swap_horiz</span></button>
            </div>`;
        }
      });
    });
  }
  listEl.innerHTML = html;

  const countEl = document.getElementById('pedCount');
  if (countEl) {
    countEl.textContent = pedidosEdit
      ? `${totalItems} artículo${totalItems === 1 ? '' : 's'}`
      : `${totalChecked} marcados · ${totalItems} artículo${totalItems === 1 ? '' : 's'}`;
  }
  const sendBtn = document.getElementById('pedSendBtn');
  if (sendBtn) sendBtn.innerHTML = `<span class="material-symbols-outlined" style="font-size:19px; vertical-align:middle;">picture_as_pdf</span> Enviar pedido (${totalChecked})`;
}

// Guarda (upsert) el estado de una materia prima en Supabase.
async function upsertOrderItem(key, display, patch) {
  const cur = orderState[key] || { name: display, supplier_group: null, checked: false, comment: '', hidden: false, manual: false, display_name: null };
  const next = { ...cur, ...patch, name: cur.name || display };
  orderState[key] = next;
  const row = {
    key, name: next.name, supplier_group: next.supplier_group,
    checked: next.checked, comment: next.comment, updated_at: new Date().toISOString(),
  };
  if (orderEditCols) {
    row.hidden = !!next.hidden;
    row.manual = !!next.manual;
    row.display_name = next.display_name || null;
  }
  try {
    const { error } = await sb.from('order_items').upsert(row, { onConflict: 'key' });
    if (error) throw error;
  } catch (e) {
    console.error('Error guardando order_items:', e);
    showToast('Error al guardar el pedido');
  }
}

async function togglePedido(enc) {
  const key = decodeURIComponent(enc);
  const e = _pedIndexByKey[key];
  const display = e ? e.display : (orderState[key]?.name || key);
  const checked = !(orderState[key]?.checked);
  orderState[key] = { ...(orderState[key] || { name: display, supplier_group: null, comment: '' }), checked };
  renderPedidosList();
  await upsertOrderItem(key, display, { checked });
}

async function setPedidoComment(enc, value) {
  const key = decodeURIComponent(enc);
  const e = _pedIndexByKey[key];
  const display = e ? e.display : (orderState[key]?.name || key);
  orderState[key] = { ...(orderState[key] || { name: display, supplier_group: null, checked: false }), comment: value };
  await upsertOrderItem(key, display, { comment: value });
}

function openGroupPicker(enc) {
  const key = decodeURIComponent(enc);
  const e = _pedIndexByKey[key];
  const display = e ? e.display : (orderState[key]?.name || key);
  const current = e ? e.group : classifyIngredient(display);
  closeGroupPicker();
  const all = [...SUPPLIER_GROUPS, OTHER_GROUP];
  const modal = document.createElement('div');
  modal.id = 'groupPickerModal';
  modal.className = 'modal-overlay';
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="modal-sheet" onclick="event.stopPropagation()">
      <div class="modal-header">
        <span class="modal-title">Grupo de "${escAttr(display)}"</span>
        <button class="modal-close" onclick="closeGroupPicker()">✕</button>
      </div>
      <div>${all.map(g => `
        <div class="gp-option ${g.id === current ? 'selected' : ''}" onclick="assignIngredientGroup('${enc}','${g.id}')">
          <span class="gp-emoji">${g.emoji}</span>
          <span class="gp-label">${g.label}</span>
          ${g.id === current ? '<span class="material-symbols-outlined" style="margin-left:auto; color:var(--primary);">check</span>' : ''}
        </div>`).join('')}</div>
    </div>`;
  modal.addEventListener('click', ev => { if (ev.target === modal) closeGroupPicker(); });
  document.body.appendChild(modal);
}
function closeGroupPicker() { const m = document.getElementById('groupPickerModal'); if (m) m.remove(); }

async function assignIngredientGroup(enc, gid) {
  const key = decodeURIComponent(enc);
  const e = _pedIndexByKey[key];
  const display = e ? e.display : (orderState[key]?.name || key);
  orderState[key] = { ...(orderState[key] || { name: display, checked: false, comment: '' }), supplier_group: gid };
  closeGroupPicker();
  renderPedidosList();
  await upsertOrderItem(key, display, { supplier_group: gid });
  showToast('Grupo actualizado');
}

// ─── Edición de la lista ───────────────
async function addManualMateriaPrima() {
  const name = await showPrompt({
    title:       'Nuevo artículo',
    label:       'Nombre',
    placeholder: 'Ej: Sal Maldon',
    confirmText: 'Añadir',
    icon:        'add_shopping_cart',
  });
  if (!name) return;
  const clean = cleanIngredientName(name) || name.trim();
  const key = normalizeText(clean);
  if (!key) return;
  const display = clean.charAt(0).toUpperCase() + clean.slice(1);
  orderState[key] = { ...(orderState[key] || { supplier_group: null, checked: false, comment: '' }), name: display, manual: true, hidden: false };
  await upsertOrderItem(key, display, { manual: true, hidden: false, name: display });
  renderPedidosList();
  showToast('Materia prima añadida ✓');
}

async function renamePedido(enc) {
  const key = decodeURIComponent(enc);
  const e = _pedIndexByKey[key];
  const current = e ? e.display : (orderState[key]?.name || key);
  const name = await showPrompt({
    title:       'Renombrar',
    label:       'Nombre mostrado',
    value:       current,
    placeholder: 'Nombre de la materia prima',
    confirmText: 'Guardar',
    icon:        'edit',
  });
  if (!name || name === current) return;
  const display = name.trim();
  await upsertOrderItem(key, display, { display_name: display });
  renderPedidosList();
  showToast('Renombrado ✓');
}

async function deletePedido(enc) {
  const key = decodeURIComponent(enc);
  const display = (_pedIndexByKey[key] && _pedIndexByKey[key].display) || orderState[key]?.name || key;
  const ok = await showConfirm({
    title:       'Eliminar artículo',
    message:     `¿Quitar "${display}" de la lista?`,
    confirmText: 'Eliminar',
    danger:      true,
    icon:        'delete',
    onConfirm:   async () => {
      const { error } = await sb.from('order_items').delete().eq('key', key);
      if (error) throw error;
      delete orderState[key];
    },
  });
  if (!ok) return;
  renderPedidosList();
  showToast('Eliminado');
}

async function resetPedidos() {
  const ok = await showConfirm({
    title:       'Reiniciar lista',
    message:     'Se desmarcarán todos los artículos y se borrarán los comentarios. Las asignaciones de grupo se mantienen.',
    confirmText: 'Reiniciar',
    danger:      true,
    icon:        'restart_alt',
    onConfirm:   async () => {
      const { error } = await sb.from('order_items').update({ checked: false, comment: '' }).not('key', 'is', null);
      if (error) throw error;
      Object.keys(orderState).forEach(k => { orderState[k].checked = false; orderState[k].comment = ''; });
    },
  });
  if (!ok) return;
  showToast('Lista reiniciada');
  renderPedidosList();
}

// Genera el PDF con los marcados y abre el menú de compartir (WhatsApp, etc.).
async function sendPedidoPDF() {
  const entries = buildPedidoEntries().entries.filter(e => e.checked && !e.hidden);

  if (!entries.length) { showToast('Marca al menos una materia prima'); return; }
  if (!window.jspdf || !window.jspdf.jsPDF) { showToast('No se pudo cargar el generador de PDF'); return; }

  const btn = document.getElementById('pedSendBtn');
  await runWithLoading(btn, 'Generando…', async () => {
    const now   = new Date();
    const fecha = now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    const hora  = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const title = `Pedidos carta del ${fecha} a las ${hora}`;

    const { jsPDF } = window.jspdf;

    // Página estrecha tipo ticket para lectura cómoda en el móvil (sin zoom).
    const W = 90, M = 8, CW = W - M * 2;

    const byGroup = {};
    entries.forEach(e => (byGroup[e.group] = byGroup[e.group] || []).push(e));
    const order = [...SUPPLIER_GROUPS.map(g => g.id), 'otros'];

    // Recorre el contenido midiendo (render=false) o dibujando (render=true).
    // Devuelve la altura total usada, para crear la página a medida.
    const layout = (doc, render) => {
      let y = M;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(17);
      if (render) doc.text('Pedido', M, y);
      y += 8;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
      if (render) { doc.setTextColor(120); doc.text(`${fecha} · ${hora}`, M, y); doc.setTextColor(20); }
      y += 4;
      if (render) { doc.setDrawColor(210); doc.line(M, y, W - M, y); }
      y += 7;

      order.forEach(gid => {
        const list = byGroup[gid];
        if (!list || !list.length) return;
        list.sort((a, b) => a.display.localeCompare(b.display, 'es', { sensitivity: 'base' }));
        const meta = groupMeta(gid);

        doc.setFont('helvetica', 'bold'); doc.setFontSize(12.5);
        if (render) doc.text(`${meta.label}`, M, y);
        y += 6;

        doc.setFont('helvetica', 'normal'); doc.setFontSize(12);
        list.forEach(e => {
          let line = `[ ]  ${e.display}`;
          const nameLines = doc.splitTextToSize(line, CW);
          if (render) doc.text(nameLines, M, y);
          y += nameLines.length * 6.2;
          if (e.comment) {
            doc.setFontSize(10.5); doc.setTextColor(110);
            const cLines = doc.splitTextToSize(e.comment, CW - 7);
            if (render) doc.text(cLines, M + 7, y);
            y += cLines.length * 5.4;
            doc.setFontSize(12); doc.setTextColor(20);
          }
          y += 2.6; // separación entre artículos
        });
        y += 5; // separación entre grupos
      });
      return y;
    };

    // 1ª pasada: medir altura. 2ª pasada: dibujar en una página a medida.
    const probe = new jsPDF({ unit: 'mm', format: [W, 1200] });
    const H = Math.max(layout(probe, false) + M, 60);
    const doc = new jsPDF({ unit: 'mm', format: [W, H] });
    layout(doc, true);

    const safe = `Pedido ${now.toLocaleDateString('es-ES').replace(/\//g, '-')} ${hora.replace(':', '.')}.pdf`;
    const blob = doc.output('blob');
    const file = new File([blob], safe, { type: 'application/pdf' });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title, text: title });
      } else {
        doc.save(safe);
        showToast('PDF descargado (este dispositivo no permite compartir archivos)');
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return; // el usuario canceló
      console.error('Error al compartir:', err);
      doc.save(safe);
      showToast('PDF descargado');
    }
  });
}

// Recalcula la lista si está visible (tras añadir/editar/borrar recetas).
function refreshPedidosIfVisible() {
  if (document.getElementById('fichasPage')?.classList.contains('active') && utilTab === 'pedidos') {
    renderPedidosList();
  }
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
  document.getElementById('weightName').innerText  = w ? w.name  : '';
  document.getElementById('weightGrams').innerText = w ? w.grams : '';
  document.getElementById('weightNotes').innerText = w ? (w.notes || '') : '';
  document.getElementById('weightModal').style.display = 'flex';
}

async function saveWeight() {
  const name  = document.getElementById('weightName').innerText.trim();
  const grams = parseInt(document.getElementById('weightGrams').innerText);
  const notes = document.getElementById('weightNotes').innerText.trim();
  if (!name || !grams) { showToast('Nombre y gramos son obligatorios'); return; }
  const payload = { name, grams, notes };
  const btn = document.querySelector('#weightModal .btn-action');
  const ok = await runWithLoading(btn, 'Guardando...', async () => {
    if (editingWeightId) {
      const { error } = await sb.from('weights').update(payload).eq('id', editingWeightId);
      if (error) { showToast('Error al guardar'); return false; }
      weights = weights.map(w => w.id === editingWeightId ? { ...w, ...payload } : w);
    } else {
      payload.id = Date.now().toString();
      const { error } = await sb.from('weights').insert(payload);
      if (error) { showToast('Error al guardar'); return false; }
      weights.push(payload);
    }
    return true;
  });
  if (!ok) return;
  closeModal('weightModal'); showToast('Guardado ✓'); renderWeights();
}

async function deleteWeight(id) {
  const w = weights.find(x => x.id === id);
  const ok = await showConfirm({
    title:       'Eliminar peso',
    message:     w ? `¿Eliminar "${w.name}" de la lista de pesos?` : '¿Eliminar este peso?',
    confirmText: 'Eliminar',
    danger:      true,
    icon:        'delete',
    onConfirm:   async () => {
      const { error } = await sb.from('weights').delete().eq('id', id);
      if (error) throw error;
      weights = weights.filter(w => w.id !== id);
    },
  });
  if (!ok) return;
  showToast('Eliminado'); renderWeights();
}

// ─── Salmueras CRUD ───────────────────
function openBrineModal(id) {
  editingBrineId = id;
  const b = id ? brines.find(x => x.id === id) : null;
  document.getElementById('brineModalTitle').textContent = id ? 'Editar salmuera' : 'Nueva salmuera';
  document.getElementById('brineName').innerText    = b ? b.product  : '';
  document.getElementById('brineCategory').value = b ? b.category : 'Aves';
  document.getElementById('brineMinutes').innerText = b ? b.minutes  : '';
  document.getElementById('brineNotes').innerText   = b ? (b.notes || '') : '';
  document.getElementById('brineModal').style.display = 'flex';
}

async function saveBrine() {
  const product  = document.getElementById('brineName').innerText.trim();
  const category = document.getElementById('brineCategory').value;
  const minutes  = parseInt(document.getElementById('brineMinutes').innerText);
  const notes    = document.getElementById('brineNotes').innerText.trim();
  if (!product || !minutes) { showToast('Producto y tiempo son obligatorios'); return; }
  const payload = { product, category, minutes, notes };
  const btn = document.querySelector('#brineModal .btn-action');
  const ok = await runWithLoading(btn, 'Guardando...', async () => {
    if (editingBrineId) {
      const { error } = await sb.from('brines').update(payload).eq('id', editingBrineId);
      if (error) { showToast('Error al guardar'); return false; }
      brines = brines.map(b => b.id === editingBrineId ? { ...b, ...payload } : b);
    } else {
      payload.id = Date.now().toString();
      const { error } = await sb.from('brines').insert(payload);
      if (error) { showToast('Error al guardar'); return false; }
      brines.push(payload);
    }
    return true;
  });
  if (!ok) return;
  closeModal('brineModal'); showToast('Guardado ✓'); renderBrines();
}

async function deleteBrine(id) {
  const b = brines.find(x => x.id === id);
  const ok = await showConfirm({
    title:       'Eliminar salmuera',
    message:     b ? `¿Eliminar la salmuera de "${b.product}"?` : '¿Eliminar esta salmuera?',
    confirmText: 'Eliminar',
    danger:      true,
    icon:        'delete',
    onConfirm:   async () => {
      const { error } = await sb.from('brines').delete().eq('id', id);
      if (error) throw error;
      brines = brines.filter(b => b.id !== id);
    },
  });
  if (!ok) return;
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
// ═══════════════════════════════════════
//   DIÁLOGO DE CONFIRMACIÓN PROPIO
// ═══════════════════════════════════════
// Sustituye al confirm() del navegador. Devuelve una promesa que
// resuelve true (confirmar) o false (cancelar). Si se pasa onConfirm,
// la acción asíncrona se ejecuta mostrando el botón en estado de carga
// y el diálogo no se cierra hasta que termina.
let _confirmResolve = null;

function showConfirm(opts = {}) {
  const {
    title       = 'Confirmar',
    message     = '',
    confirmText = 'Confirmar',
    cancelText  = 'Cancelar',
    danger      = false,
    icon        = danger ? 'warning' : 'help',
    onConfirm   = null,
  } = opts;

  return new Promise(resolve => {
    const existing = document.getElementById('confirmModal');
    if (existing) existing.remove();

    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      _confirmResolve = null;
      const m = document.getElementById('confirmModal');
      if (m) m.remove();
      resolve(result);
    };
    // Permite que el botón "atrás" de Android cancele el diálogo
    _confirmResolve = () => finish(false);

    const modal = document.createElement('div');
    modal.id = 'confirmModal';
    modal.className = 'modal-overlay confirm-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-sheet confirm-sheet" onclick="event.stopPropagation()">
        <div class="confirm-icon ${danger ? 'danger' : ''}">
          <span class="material-symbols-outlined">${icon}</span>
        </div>
        <div class="confirm-title">${title}</div>
        ${message ? `<p class="confirm-message">${message}</p>` : ''}
        <div class="confirm-actions">
          <button class="btn-confirm cancel" id="confirmCancelBtn">${cancelText}</button>
          <button class="btn-confirm ok ${danger ? 'danger' : ''}" id="confirmOkBtn">${confirmText}</button>
        </div>
      </div>`;
    modal.addEventListener('click', e => { if (e.target === modal) finish(false); });
    document.body.appendChild(modal);

    const cancelBtn = modal.querySelector('#confirmCancelBtn');
    const okBtn     = modal.querySelector('#confirmOkBtn');

    cancelBtn.addEventListener('click', () => finish(false));
    okBtn.addEventListener('click', async () => {
      if (!onConfirm) { finish(true); return; }
      const orig = okBtn.innerHTML;
      okBtn.disabled = true; cancelBtn.disabled = true;
      okBtn.innerHTML = `<span class="material-symbols-outlined spin">progress_activity</span>`;
      okBtn.classList.add('btn-loading');
      try {
        await onConfirm();
        finish(true);
      } catch (err) {
        console.error(err);
        showToast('Error, inténtalo de nuevo');
        okBtn.disabled = false; cancelBtn.disabled = false;
        okBtn.classList.remove('btn-loading');
        okBtn.innerHTML = orig;
      }
    });

    setTimeout(() => okBtn.focus(), 100);
  });
}

// Diálogo de entrada de texto propio (sustituye a prompt()).
// Resuelve con el texto introducido, o null si se cancela. Si se pasa
// onConfirm(valor), se ejecuta con el botón en estado de carga.
function showPrompt(opts = {}) {
  const {
    title       = '',
    label       = '',
    value       = '',
    placeholder = '',
    confirmText = 'Guardar',
    cancelText  = 'Cancelar',
    icon        = 'edit',
    onConfirm   = null,
  } = opts;

  return new Promise(resolve => {
    const existing = document.getElementById('confirmModal');
    if (existing) existing.remove();

    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      _confirmResolve = null;
      const m = document.getElementById('confirmModal');
      if (m) m.remove();
      resolve(result);
    };
    _confirmResolve = () => finish(null);

    const modal = document.createElement('div');
    modal.id = 'confirmModal';
    modal.className = 'modal-overlay confirm-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-sheet confirm-sheet" onclick="event.stopPropagation()">
        <div class="confirm-icon"><span class="material-symbols-outlined">${icon}</span></div>
        ${title ? `<div class="confirm-title">${title}</div>` : ''}
        <div class="form-group" style="text-align:left; margin-top:14px;">
          ${label ? `<div class="form-label">${label}</div>` : ''}
          <input type="text" class="form-input" id="promptInput" placeholder="${placeholder}"
            onkeydown="if(event.key==='Enter') document.getElementById('promptOkBtn').click();">
        </div>
        <div class="confirm-actions">
          <button class="btn-confirm cancel" id="promptCancelBtn">${cancelText}</button>
          <button class="btn-confirm ok" id="promptOkBtn">${confirmText}</button>
        </div>
      </div>`;
    modal.addEventListener('click', e => { if (e.target === modal) finish(null); });
    document.body.appendChild(modal);

    const input     = modal.querySelector('#promptInput');
    const cancelBtn = modal.querySelector('#promptCancelBtn');
    const okBtn     = modal.querySelector('#promptOkBtn');
    input.value = value;

    cancelBtn.addEventListener('click', () => finish(null));
    okBtn.addEventListener('click', async () => {
      const text = input.value.trim();
      if (!text) { input.focus(); return; }
      if (!onConfirm) { finish(text); return; }
      const orig = okBtn.innerHTML;
      okBtn.disabled = true; cancelBtn.disabled = true; input.disabled = true;
      okBtn.innerHTML = `<span class="material-symbols-outlined spin">progress_activity</span>`;
      okBtn.classList.add('btn-loading');
      try {
        await onConfirm(text);
        finish(text);
      } catch (err) {
        console.error(err);
        showToast('Error, inténtalo de nuevo');
        okBtn.disabled = false; cancelBtn.disabled = false; input.disabled = false;
        okBtn.classList.remove('btn-loading');
        okBtn.innerHTML = orig;
      }
    });

    setTimeout(() => { input.focus(); input.select(); }, 120);
  });
}

// ═══════════════════════════════════════
//   ESTADO DE CARGA EN BOTONES (consistente)
// ═══════════════════════════════════════
// Deshabilita el botón, muestra un spinner + etiqueta mientras corre la
// tarea asíncrona y restaura el estado original al terminar (o fallar).
async function runWithLoading(btn, label, task) {
  if (!btn) return task();
  const original     = btn.innerHTML;
  const wasDisabled  = btn.disabled;
  btn.disabled = true;
  btn.classList.add('btn-loading');
  btn.innerHTML = `<span class="material-symbols-outlined spin">progress_activity</span>${label ? ' ' + label : ''}`;
  try {
    return await task();
  } finally {
    btn.disabled = wasDisabled;
    btn.classList.remove('btn-loading');
    btn.innerHTML = original;
  }
}

// ═══════════════════════════════════════
//   CAMBIOS SIN GUARDAR (editores)
// ═══════════════════════════════════════
function isRecipeEditorDirty() {
  return !!recipeEditorData && recipeEditorBaseline !== null
    && JSON.stringify(recipeEditorData) !== recipeEditorBaseline;
}
function isProdEditorDirty() {
  return !!prodEditorData && prodEditorBaseline !== null
    && JSON.stringify(prodEditorData) !== prodEditorBaseline;
}

// Intenta salir del editor de recetas. Si hay cambios sin guardar pide
// confirmación. Devuelve true si finalmente se salió, false si se queda.
async function requestExitRecipeEditor() {
  if (isRecipeEditorDirty()) {
    const ok = await showConfirm({
      title:       'Cambios sin guardar',
      message:     'Si sales ahora perderás los cambios que no has guardado.',
      confirmText: 'Salir sin guardar',
      cancelText:  'Seguir editando',
      icon:        'edit_off',
    });
    if (!ok) return false;
  }
  exitRecipeEditor(recipeEditorMode === 'edit');
  return true;
}

async function requestExitProdEditor() {
  if (isProdEditorDirty()) {
    const ok = await showConfirm({
      title:       'Cambios sin guardar',
      message:     'Si sales ahora perderás los cambios que no has guardado.',
      confirmText: 'Salir sin guardar',
      cancelText:  'Seguir editando',
      icon:        'edit_off',
    });
    if (!ok) return false;
  }
  exitProdEditor(prodEditorMode === 'edit');
  return true;
}

function closeModal(id) { document.getElementById(id).style.display = 'none'; }

// ═══════════════════════════════════════
//   MODO OSCURO
// ═══════════════════════════════════════
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  try { localStorage.setItem('rubencechef-theme', isDark ? 'dark' : 'light'); } catch(e) {}
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  const btn = document.getElementById('themeBtn');
  if (btn) btn.querySelector('.material-symbols-outlined').textContent = isDark ? 'light_mode' : 'dark_mode';
}

function initTheme() {
  let saved = 'light';
  try { saved = localStorage.getItem('rubencechef-theme') || 'light'; } catch(e) {}
  const isDark = saved === 'dark';
  if (isDark) document.body.classList.add('dark');
  updateThemeIcon(isDark);
}

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
initTheme();

// Crear el campo de búsqueda como contenteditable para evitar el autorelleno de Android
const searchInput = document.createElement('div');
searchInput.setAttribute('id', 'searchInput');
searchInput.setAttribute('contenteditable', 'true');
searchInput.setAttribute('data-placeholder', 'Buscar...');
searchInput.setAttribute('role', 'searchbox');
searchInput.className = 'search-contenteditable';
searchInput.style.cssText = 'border:none;background:none;outline:none;font-size:14px;font-family:Nunito,sans-serif;color:var(--text);flex:1;width:100%;min-height:20px;';
// Helper para leer el texto de búsqueda
searchInput.getValue = function() { return this.innerText.trim(); };
searchInput.addEventListener('input', onSearch);
document.getElementById('searchInputWrap').appendChild(searchInput);

initChips(RECIPE_CATEGORIES, recipeFilter, setRecipeFilter);
const _vEl = document.getElementById('appVersion');
if (_vEl) _vEl.textContent = APP_VERSION;
loadData();

// Service Worker desactivado temporalmente
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/rubencecheff/sw.js').catch(() => {});
//   });
// }

// Botón atrás de Android
history.pushState({ view: 'home' }, '');

// Avisar al cerrar/recargar la app si hay cambios sin guardar en un editor
window.addEventListener('beforeunload', (e) => {
  const editingRecipe = document.getElementById('editorPage').classList.contains('active') && isRecipeEditorDirty();
  const editingProd   = document.getElementById('productionEditorPage').classList.contains('active') && isProdEditorDirty();
  if (editingRecipe || editingProd) {
    e.preventDefault();
    e.returnValue = '';
  }
});

window.addEventListener('popstate', (e) => {
  const state = e.state;

  // Cerrar modales abiertos primero
  const openModal = document.querySelector('.modal-overlay[style*="flex"]');
  if (openModal) {
    if (openModal.id === 'loginModal') closeLoginModal();
    else if (openModal.id === 'confirmModal' && _confirmResolve) _confirmResolve(); // cancela el diálogo
    else openModal.style.display = 'none';
    history.pushState({ view: 'modal' }, '');
    return;
  }

  if (!state || state.view === 'home') {
    // Volver a la página principal
    if (document.getElementById('editorPage').classList.contains('active')) {
      requestExitRecipeEditor().then(exited => history.pushState({ view: exited ? 'home' : 'editor' }, ''));
      return;
    }
    if (document.getElementById('productionEditorPage').classList.contains('active')) {
      requestExitProdEditor().then(exited => history.pushState({ view: exited ? 'home' : 'editor' }, ''));
      return;
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
    const isRecipe = document.getElementById('editorPage').classList.contains('active');
    const fn = isRecipe ? requestExitRecipeEditor : requestExitProdEditor;
    fn().then(exited => { if (!exited) history.pushState({ view: 'editor' }, ''); });
    return;
  }

  if (state.view === 'recipeDetail') {
    if (document.getElementById('detailPage').classList.contains('active')) backTo(state.fromPage || 'recipes');
    return;
  }

  if (state.view === 'prodDetail') {
    if (document.getElementById('productionDetailPage').classList.contains('active')) backTo(state.fromPage || 'productions');
    return;
  }
});
