const slides = [...document.querySelectorAll('.hero-slide')];
let activeSlide = 0;
if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.setInterval(() => {
    slides[activeSlide].classList.remove('active');
    activeSlide = (activeSlide + 1) % slides.length;
    slides[activeSlide].classList.add('active');
  }, 7000);
}

const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeLabel = document.getElementById('theme-label');
function setTheme(theme) {
  root.dataset.theme = theme;
  const light = theme === 'light';
  themeIcon.textContent = light ? '☾' : '☀';
  themeLabel.textContent = light ? 'حالت تاریک' : 'حالت روشن';
  document.querySelector('meta[name="theme-color"]').content = light ? '#eaf5fc' : '#0b2340';
}
themeToggle.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

const form = document.getElementById('result-form');
const idInput = document.getElementById('candidate-id');
const message = document.getElementById('form-message');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const candidateId = idInput.value.trim();
  message.hidden = false;
  if (!candidateId) {
    message.textContent = 'لطفاً شمارهٔ داوطلبی را وارد کنید.';
    idInput.focus();
    return;
  }
  message.textContent = 'جستجوی واقعی هنوز فعال نیست؛ دیتابیس نتایج به سامانه وصل نشده است. پس از تنظیم Backend و اتصال منبع معتبر، این بخش نتیجهٔ ثبت‌شده را جستجو می‌کند.';
});
