// تغییر خودکار تصاویر پس‌زمینه
const slides = [...document.querySelectorAll('.hero-slide')];
let activeSlide = Math.max(0, slides.findIndex(slide => slide.classList.contains('active')));
if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.setInterval(() => {
    slides[activeSlide].classList.remove('active');
    activeSlide = (activeSlide + 1) % slides.length;
    slides[activeSlide].classList.add('active');
  }, 7000);
}

// حالت روشن و تاریک؛ در صفحه اصلی و پنل مدیریت یکسان است
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
if (themeToggle) {
  themeToggle.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
}

// داده‌های آزمایشی در LocalStorage
function loadResults() {
  try {
    const data = JSON.parse(localStorage.getItem('kanqorResults') || '[]');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('خواندن داده‌ها ناموفق بود:', error);
    return [];
  }
}

const form = document.getElementById('result-form');
const idInput = document.getElementById('candidate-id');
const message = document.getElementById('form-message');
const resultContainer = document.getElementById('search-result');
const detailsContainer = document.getElementById('candidate-details');

function showDetails(candidate) {
  if (!detailsContainer) return;
  const fields = [
    ['آیدی داوطلب', candidate.id],
    ['نام و نام خانوادگی', candidate.name],
    ['نام پدر', candidate.fatherName],
    ['نام پدرکلان', candidate.grandfatherName],
    ['ولایت', candidate.province],
    ['ولسوالی / ناحیه', candidate.district],
    ['مکتب', candidate.school],
    ['سال فراغت', candidate.graduationYear],
    ['رشته', candidate.field],
    ['نمره', candidate.score],
    ['دانشگاه / پوهنتون', candidate.university],
    ['رشتهٔ قبولی', candidate.admittedProgram],
    ['وضعیت', candidate.status],
    ['یادداشت', candidate.notes]
  ];
  detailsContainer.replaceChildren();
  const heading = document.createElement('h3');
  heading.textContent = 'جزئیات پروندهٔ داوطلب';
  detailsContainer.appendChild(heading);
  const grid = document.createElement('div');
  grid.className = 'details-grid';
  fields.forEach(([label, value]) => {
    if (value === undefined || value === null || String(value).trim() === '') return;
    const item = document.createElement('div');
    item.className = 'detail-item';
    const term = document.createElement('span');
    term.className = 'detail-label';
    term.textContent = label;
    const description = document.createElement('strong');
    description.textContent = String(value);
    item.append(term, description);
    grid.appendChild(item);
  });
  detailsContainer.appendChild(grid);
  detailsContainer.hidden = false;
  detailsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

if (form && idInput && message) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const candidateId = idInput.value.trim();
    message.hidden = false;
    if (resultContainer) { resultContainer.hidden = true; resultContainer.replaceChildren(); }
    if (detailsContainer) { detailsContainer.hidden = true; detailsContainer.replaceChildren(); }
    if (!candidateId) {
      message.textContent = 'لطفاً آیدی داوطلب را وارد کنید.';
      idInput.focus();
      return;
    }
    const candidate = loadResults().find(item => String(item.id).trim() === candidateId);
    if (!candidate) {
      message.textContent = 'برای این آیدی پرونده‌ای پیدا نشد. ابتدا آن را از پنل مدیریت ثبت کنید.';
      return;
    }
    message.textContent = 'پرونده پیدا شد. برای دیدن همهٔ معلومات روی آن کلیک کنید.';
    if (resultContainer) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'result-record';
      const name = document.createElement('strong');
      name.textContent = candidate.name || 'نام ثبت نشده';
      const meta = document.createElement('span');
      meta.textContent = `آیدی: ${candidate.id} · ولایت: ${candidate.province || 'ثبت نشده'}`;
      const arrow = document.createElement('span');
      arrow.className = 'record-arrow';
      arrow.textContent = 'مشاهدهٔ پرونده ←';
      button.append(name, meta, arrow);
      button.addEventListener('click', () => showDetails(candidate));
      resultContainer.appendChild(button);
      resultContainer.hidden = false;
    }
  });
}
