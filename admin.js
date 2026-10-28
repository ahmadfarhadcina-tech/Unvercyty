// پنل آزمایشی مدیریت پرونده‌ها - ذخیره در LocalStorage
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeLabel = document.getElementById('theme-label');
function setTheme(theme) {
  root.dataset.theme = theme;
  const light = theme === 'light';
  if (themeIcon) themeIcon.textContent = light ? '☾' : '☀';
  if (themeLabel) themeLabel.textContent = light ? 'حالت تاریک' : 'حالت روشن';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = light ? '#eaf5fc' : '#0b2340';
  try { localStorage.setItem('kanqorTheme', theme); } catch (_) {}
}
let savedTheme = 'dark';
try { savedTheme = localStorage.getItem('kanqorTheme') || 'dark'; } catch (_) {}
setTheme(savedTheme === 'light' ? 'light' : 'dark');
if (themeToggle) themeToggle.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

const STORAGE_KEY = 'kanqorResults';
const form = document.getElementById('candidate-form');
const list = document.getElementById('candidate-list');
const count = document.getElementById('candidate-count');
const message = document.getElementById('admin-message');
const title = document.getElementById('admin-form-title');
const saveButton = document.getElementById('save-candidate');
let editingId = null;

function loadResults() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch (_) { return []; }
}
function saveResults(results) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
    return true;
  } catch (error) {
    showMessage('ذخیره انجام نشد. ممکن است فضای مرورگر کافی نباشد.', true);
    return false;
  }
}
function showMessage(text, error = false) {
  message.hidden = false;
  message.textContent = text;
  message.style.borderColor = error ? 'rgba(216,77,77,.6)' : 'rgba(151,215,255,.45)';
}
function field(name) { return form.elements.namedItem(name); }
function resetForm() {
  form.reset();
  editingId = null;
  field('id').readOnly = false;
  title.textContent = 'ثبت داوطلب جدید';
  saveButton.textContent = 'ذخیرهٔ داوطلب';
}
function readForm() {
  const result = {};
  ['id','name','fatherName','grandfatherName','province','district','school','graduationYear','field','score','university','admittedProgram','status','notes'].forEach(key => {
    result[key] = String(field(key).value || '').trim();
  });
  return result;
}
function fillForm(candidate) {
  Object.keys(candidate).forEach(key => {
    const element = form.elements.namedItem(key);
    if (element) element.value = candidate[key] ?? '';
  });
  editingId = String(candidate.id);
  field('id').readOnly = true;
  title.textContent = 'ویرایش پروندهٔ داوطلب';
  saveButton.textContent = 'ذخیرهٔ تغییرات';
  message.hidden = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function renderList() {
  const results = loadResults();
  count.textContent = `(${new Intl.NumberFormat('fa-AF').format(results.length)})`;
  list.replaceChildren();
  if (!results.length) {
    const empty = document.createElement('p');
    empty.className = 'subcopy';
    empty.textContent = 'هنوز پرونده‌ای ثبت نشده است. از فرم سمت راست/بالا یک داوطلب بساز.';
    list.appendChild(empty);
    return;
  }
  results.slice().sort((a,b) => String(a.name || '').localeCompare(String(b.name || ''), 'fa')).forEach(candidate => {
    const row = document.createElement('div');
    row.className = 'admin-list-item';
    const summary = document.createElement('div');
    summary.className = 'candidate-summary';
    const name = document.createElement('strong');
    name.textContent = candidate.name || 'بدون نام';
    const id = document.createElement('small');
    id.textContent = `آیدی: ${candidate.id}`;
    summary.append(name, id);
    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.flexWrap = 'wrap';
    actions.style.gap = '6px';
    const edit = document.createElement('button');
    edit.type = 'button'; edit.className = 'edit-button'; edit.textContent = 'ویرایش';
    edit.addEventListener('click', () => fillForm(candidate));
    const del = document.createElement('button');
    del.type = 'button'; del.className = 'delete-button'; del.textContent = 'حذف';
    del.addEventListener('click', () => {
      if (!window.confirm(`پروندهٔ «${candidate.name || candidate.id}» حذف شود؟`)) return;
      const updated = loadResults().filter(item => String(item.id) !== String(candidate.id));
      if (saveResults(updated)) {
        if (editingId === String(candidate.id)) resetForm();
        showMessage('پرونده حذف شد.');
        renderList();
      }
    });
    actions.append(edit, del);
    row.append(summary, actions);
    list.appendChild(row);
  });
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const candidate = readForm();
  if (!candidate.id || !candidate.name) {
    showMessage('آیدی داوطلب و نام کامل الزامی است.', true);
    return;
  }
  const results = loadResults();
  if (editingId !== null) {
    const index = results.findIndex(item => String(item.id) === editingId);
    if (index < 0) { showMessage('این پرونده پیدا نشد؛ فهرست را تازه کن.', true); return; }
    results[index] = candidate;
  } else {
    if (results.some(item => String(item.id).trim() === candidate.id)) {
      showMessage('این آیدی قبلاً ثبت شده است. آیدی دیگری وارد کن یا پرونده را ویرایش کن.', true);
      return;
    }
    results.push(candidate);
  }
  if (saveResults(results)) {
    showMessage(editingId !== null ? 'تغییرات پرونده ذخیره شد.' : 'پروندهٔ داوطلب ذخیره شد. حالا از صفحهٔ جستجو آیدی را امتحان کن.');
    resetForm();
    renderList();
  }
});
document.getElementById('reset-form').addEventListener('click', () => { resetForm(); message.hidden = true; });
document.getElementById('export-data').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(loadResults(), null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'kanqor-results-backup.json';
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  URL.revokeObjectURL(url);
  showMessage('فایل پشتیبان JSON ساخته شد. آن را در جای امن نگه‌دار.');
});
renderList();
