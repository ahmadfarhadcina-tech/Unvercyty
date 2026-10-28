
const slides = [...document.querySelectorAll('.hero-slide')];
let activeSlide = Math.max(
  0,
  slides.findIndex(slide => slide.classList.contains('active'))
);

if (
  slides.length > 1 &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  window.setInterval(() => {
    slides[activeSlide].classList.remove('active');
    activeSlide = (activeSlide + 1) % slides.length;
    slides[activeSlide].classList.add('active');
  }, 7000);
}

// حالت روشن و تاریک
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeLabel = document.getElementById('theme-label');

function setTheme(theme) {
  root.dataset.theme = theme;

  const light = theme === 'light';

  if (themeIcon) {
    themeIcon.textContent = light ? '☾' : '☀';
  }

  if (themeLabel) {
    themeLabel.textContent = light ? 'حالت تاریک' : 'حالت روشن';
  }

  const themeColor = document.querySelector('meta[name="theme-color"]');

  if (themeColor) {
    themeColor.content = light ? '#eaf5fc' : '#0b2340';
  }

  localStorage.setItem('kanqorTheme', theme);
}

const savedTheme = localStorage.getItem('kanqorTheme');
setTheme(savedTheme === 'light' ? 'light' : 'dark');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });
}

// خواندن نتایج از LocalStorage
function loadResults() {
  try {
    const data = JSON.parse(
      localStorage.getItem('kanqorResults') || '[]'
    );

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('خطا در خواندن نتایج:', error);
    return [];
  }
}

// ذخیره نتایج در LocalStorage
function saveResults(results) {
  try {
    localStorage.setItem('kanqorResults', JSON.stringify(results));
    return true;
  } catch (error) {
    console.error('خطا در ذخیره نتایج:', error);
    return false;
  }
}

// فرم جستجوی نتیجه
const form = document.getElementById('result-form');
const idInput = document.getElementById('candidate-id');
const message = document.getElementById('form-message');

if (form && idInput && message) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const candidateId = idInput.value.trim();
    message.hidden = false;

    if (!candidateId) {
      message.textContent = 'لطفاً شمارهٔ داوطلبی را وارد کنید.';
      idInput.focus();
      return;
    }

    const results = loadResults();

    const result = results.find(
      item => String(item.id).trim() === candidateId
    );

    if (!result) {
      message.textContent =
        'برای این شماره نتیجه‌ای ثبت نشده است. این سامانه آزمایشی است.';
      return;
    }

    message.textContent =
      `نام: ${result.name} | نمره: ${result.score}`;
  });
}

// افزودن یک نتیجه آزمایشی فقط در صورت خالی بودن دیتابیس
// شماره آزمایشی: 12345
if (localStorage.getItem('kanqorResults') === null) {
  saveResults([
    {
      id: '12345',
      name: 'داوطلب آزمایشی',
      score: 280
    }
  ]);
}
