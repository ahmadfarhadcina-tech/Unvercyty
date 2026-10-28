const slides = Array.from(document.querySelectorAll(".hero-slide"));
let activeSlide = 0;

if (slides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.setInterval(() => {
    slides[activeSlide].classList.remove("active");
    activeSlide = (activeSlide + 1) % slides.length;
    slides[activeSlide].classList.add("active");
  }, 6500);
}

const form = document.getElementById("result-form");
const idInput = document.getElementById("candidate-id");
const message = document.getElementById("form-message");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const candidateId = idInput.value.trim();
  message.hidden = false;

  if (!candidateId) {
    message.textContent = "لطفاً شماره ID را وارد کنید. این نمونه هنوز به دیتابیس وصل نیست و نتیجه‌ای نمایش نمی‌دهد.";
    idInput.focus();
    return;
  }

  message.textContent = "این نسخه نمایشی است؛ دیتابیس رسمی هنوز وصل نشده است، بنابراین نتیجه‌ای برای این ID جستجو یا ساخته نشد. پس از دریافت اطلاعات معتبر و راه‌اندازی Backend، جستجوی واقعی فعال می‌شود.";
});
