// مدیریت پاپ‌آپ ثبت‌نام
const modal = document.getElementById('register-modal');
const openModalBtn = document.getElementById('open-register-modal');
const closeModalBtn = document.querySelector('.close-modal');

// باز کردن پاپ‌آپ
if (openModalBtn) {
    openModalBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
    });
}

// بستن پاپ‌آپ با کلیک روی دکمه بستن
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
}

// بستن پاپ‌آپ با کلیک خارج از آن
if (modal) {
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// فرم ثبت نام
const registrationForm = document.getElementById('registration-form');
if (registrationForm) {
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // جمع‌آوری اطلاعات فرم
        const formData = {
            name: document.getElementById('name').value,
            grade: document.getElementById('grade').value,
            phone: document.getElementById('phone').value,
            date: toPersianDate(new Date()), // تبدیل تاریخ به شمسی
            address: document.getElementById('address').value,
            fatherName: document.getElementById('father-name').value,
            motherName: document.getElementById('mother-name').value,
            fatherJob: document.getElementById('father-job').value,
            financialSupport: document.getElementById('financial-support').value
        };
        
        // ذخیره اطلاعات در localStorage
        let registrations = JSON.parse(localStorage.getItem('registrations')) || [];
        registrations.push(formData);
        localStorage.setItem('registrations', JSON.stringify(registrations));
        
        // نمایش پیام موفقیت
        showSuccessMessage('ثبت نام با موفقیت انجام شد!');
        
        // بستن پاپ‌آپ و ریست کردن فرم
        modal.style.display = 'none';
        this.reset();
    });
}

// اسکرول نرم برای لینک‌های منو
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// اسکرول به بخش تماس با ما
document.querySelector('.contact-link').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#contact').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// انیمیشن اسکرول
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        header.style.backgroundColor = '#fff';
    }
});

// اعتبارسنجی شماره تلفن
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        const phone = e.target.value;
        const phoneRegex = /^[0-9]{11}$/;
        
        if (!phoneRegex.test(phone)) {
            this.setCustomValidity('لطفاً یک شماره تلفن معتبر وارد کنید');
        } else {
            this.setCustomValidity('');
        }
    });
}

// بارگذاری و اعمال تنظیمات سایت
document.addEventListener('DOMContentLoaded', function() {
    const siteSettings = JSON.parse(localStorage.getItem('siteSettings'));
    
    if (siteSettings) {
        // به‌روزرسانی بخش اصلی
        document.querySelector('.hero h2').textContent = siteSettings.hero.title;
        document.querySelector('.hero p').textContent = siteSettings.hero.description;
        document.querySelector('.hero').style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${siteSettings.hero.image}')`;
        
        // به‌روزرسانی بخش درباره ما
        document.querySelector('.about h2').textContent = siteSettings.about.title;
        document.querySelector('.about-text p').textContent = siteSettings.about.description;
        
        // به‌روزرسانی اطلاعات تماس
        document.querySelector('.footer-section p:nth-child(2)').textContent = `تلفن: ${siteSettings.contact.phone}`;
        document.querySelector('.footer-section p:nth-child(3)').textContent = `ایمیل: ${siteSettings.contact.email}`;
        document.querySelector('.footer-section p:nth-child(4)').textContent = `آدرس: ${siteSettings.contact.address}`;
    }
});

// تابع تبدیل اعداد به فارسی
function toPersianNumber(number) {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return number.toString().replace(/\d/g, digit => persianNumbers[digit]);
}

// تابع تبدیل تاریخ میلادی به شمسی
function toPersianDate(date) {
    const g2p = new Date(date);
    const gy = g2p.getFullYear();
    const gm = g2p.getMonth() + 1;
    const gd = g2p.getDate();
    
    let g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let jy = (gy <= 1600) ? 0 : 979;
    gy -= (gy <= 1600) ? 621 : 1600;
    let gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = (365 * gy) + (parseInt((gy2 + 3) / 4)) - (parseInt((gy2 + 99) / 100)) + (parseInt((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1];
    jy += 33 * (parseInt(days / 12053));
    days %= 12053;
    jy += 4 * (parseInt(days / 1461));
    days %= 1461;
    jy += parseInt((days - 1) / 365);
    if (days > 365) days = (days - 1) % 365;
    let jm = (days < 186) ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
    let jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    
    const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    
    return `${toPersianNumber(jd)} ${persianMonths[jm - 1]} ${toPersianNumber(jy)}`;
}

// تابع نمایش پیام موفقیت
function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    // حذف خودکار پیام پس از 3 ثانیه
    setTimeout(() => {
        notification.remove();
    }, 3000);
} 