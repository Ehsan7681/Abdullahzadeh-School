// بررسی وضعیت ورود
function checkLoginStatus() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// اگر کاربر وارد نشده باشد، به صفحه ورود هدایت می‌شود
if (!checkLoginStatus()) {
    window.location.href = 'login.html';
}

// ذخیره اطلاعات در localStorage
let registrations = JSON.parse(localStorage.getItem('registrations')) || [];

// دریافت اطلاعات ورود ذخیره شده
function getAdminCredentials() {
    return JSON.parse(localStorage.getItem('adminCredentials')) || {
        username: 'admin',
        password: '123456'
    };
}

// ذخیره اطلاعات ورود جدید
function setAdminCredentials(credentials) {
    localStorage.setItem('adminCredentials', JSON.stringify(credentials));
}

// مدیریت فرم تنظیمات
document.getElementById('settings-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    const currentCredentials = getAdminCredentials();
    
    // بررسی رمز عبور فعلی
    if (currentPassword !== currentCredentials.password) {
        alert('رمز عبور فعلی اشتباه است!');
        return;
    }
    
    // بررسی تطابق رمز عبور جدید
    if (newPassword !== confirmPassword) {
        alert('رمز عبور جدید و تکرار آن مطابقت ندارند!');
        return;
    }
    
    // ذخیره اطلاعات جدید
    setAdminCredentials({
        username: newUsername,
        password: newPassword
    });
    
    alert('اطلاعات حساب کاربری با موفقیت بروزرسانی شد!');
    this.reset();
});

// تابع تبدیل اعداد به فارسی
function toPersianNumber(number) {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return number.toString().replace(/\d/g, digit => persianNumbers[digit]);
}

// متغیرهای مرتب‌سازی
let currentSortField = 'date';
let sortDirection = 'desc';

// تابع مرتب‌سازی
function sortRegistrations(field) {
    if (currentSortField === field) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortField = field;
        sortDirection = 'asc';
    }

    registrations.sort((a, b) => {
        let valueA = a[field];
        let valueB = b[field];

        // تبدیل اعداد به عدد برای مقایسه
        if (field === 'financialSupport') {
            valueA = parseInt(valueA) || 0;
            valueB = parseInt(valueB) || 0;
        }

        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    displayRegistrations();
}

let currentPage = 1;
let itemsPerPage = 10;

function updatePagination() {
    const totalPages = Math.ceil(registrations.length / itemsPerPage);
    
    document.getElementById('page-info').textContent = `صفحه ${currentPage} از ${totalPages || 1}`;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages || totalPages === 0;
}

function displayRegistrations() {
    const tbody = document.getElementById('registrations-list');
    tbody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageRegistrations = registrations.slice(startIndex, endIndex);
    
    pageRegistrations.forEach((registration, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${toPersianNumber(index + 1)}</td>
            <td>${registration.name}</td>
            <td>${registration.grade}</td>
            <td>${toPersianNumber(registration.phone)}</td>
            <td>${toPersianNumber(registration.date)}</td>
            <td>
                <div class="action-buttons">
                    <button class="view-btn" onclick="viewRegistration(${index})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="edit-btn" onclick="editRegistration(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteRegistration(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    updatePagination();
}

// مشاهده اطلاعات کامل ثبت‌نام
function viewRegistration(index) {
    const registration = registrations[index];
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>اطلاعات کامل دانش‌آموز</h2>
            <div class="student-info">
                <div class="info-row">
                    <span class="info-label">نام و نام خانوادگی:</span>
                    <span class="info-value">${registration.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">پایه تحصیلی:</span>
                    <span class="info-value">${registration.grade}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">شماره تماس:</span>
                    <span class="info-value">${toPersianNumber(registration.phone)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">تاریخ ثبت‌نام:</span>
                    <span class="info-value">${toPersianNumber(registration.date)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">آدرس:</span>
                    <span class="info-value">${registration.address || '-'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">نام پدر:</span>
                    <span class="info-value">${registration.fatherName || '-'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">نام مادر:</span>
                    <span class="info-value">${registration.motherName || '-'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">شغل پدر:</span>
                    <span class="info-value">${registration.fatherJob || '-'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">میزان کمک به مدرسه:</span>
                    <span class="info-value">${registration.financialSupport ? toPersianNumber(registration.financialSupport) + ' میلیون تومان' : '-'}</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // بستن مودال با کلیک روی ×
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    // بستن مودال با کلیک روی پس‌زمینه
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ویرایش ثبت‌نام
function editRegistration(index) {
    const registration = registrations[index];
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>ویرایش اطلاعات دانش‌آموز</h2>
            <form id="edit-form" class="edit-form">
                <div class="form-group">
                    <label for="edit-name">نام و نام خانوادگی</label>
                    <input type="text" id="edit-name" value="${registration.name}" required>
                </div>
                <div class="form-group">
                    <label for="edit-phone">شماره تماس</label>
                    <input type="tel" id="edit-phone" value="${registration.phone}" required>
                </div>
                <div class="form-group">
                    <label for="edit-grade">پایه تحصیلی</label>
                    <select id="edit-grade" required>
                        <option value="">انتخاب کنید</option>
                        <option value="first" ${registration.grade === 'first' ? 'selected' : ''}>اول</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-address">آدرس منزل</label>
                    <textarea id="edit-address">${registration.address || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="edit-father-name">نام پدر</label>
                    <input type="text" id="edit-father-name" value="${registration.fatherName || ''}">
                </div>
                <div class="form-group">
                    <label for="edit-mother-name">نام مادر</label>
                    <input type="text" id="edit-mother-name" value="${registration.motherName || ''}">
                </div>
                <div class="form-group">
                    <label for="edit-father-job">شغل پدر</label>
                    <input type="text" id="edit-father-job" value="${registration.fatherJob || ''}">
                </div>
                <div class="form-group">
                    <label for="edit-financial-support">میزان توانایی کمک به مدرسه (میلیون تومان)</label>
                    <select id="edit-financial-support">
                        <option value="">انتخاب کنید</option>
                        ${[1,2,3,4,5,6,7,8,9,10].map(num => 
                            `<option value="${num}" ${registration.financialSupport == num ? 'selected' : ''}>${num} میلیون</option>`
                        ).join('')}
                    </select>
                </div>
                <button type="submit" class="submit-btn">ذخیره تغییرات</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    // بستن مودال با کلیک روی ×
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    // بستن مودال با کلیک روی پس‌زمینه
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // ذخیره تغییرات
    modal.querySelector('#edit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        registrations[index] = {
            ...registration,
            name: document.getElementById('edit-name').value,
            phone: document.getElementById('edit-phone').value,
            grade: document.getElementById('edit-grade').value,
            address: document.getElementById('edit-address').value,
            fatherName: document.getElementById('edit-father-name').value,
            motherName: document.getElementById('edit-mother-name').value,
            fatherJob: document.getElementById('edit-father-job').value,
            financialSupport: document.getElementById('edit-financial-support').value
        };
        
        localStorage.setItem('registrations', JSON.stringify(registrations));
        displayRegistrations();
        modal.remove();
        alert('تغییرات با موفقیت ذخیره شد');
    });
}

// حذف ثبت‌نام
function deleteRegistration(index) {
    const registration = registrations[index];
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>حذف دانش‌آموز</h2>
            <div class="delete-confirmation">
                <p>آیا از حذف دانش‌آموز زیر اطمینان دارید؟</p>
                <div class="student-details">
                    <p><strong>نام و نام خانوادگی:</strong> ${registration.name}</p>
                    <p><strong>پایه تحصیلی:</strong> ${registration.grade}</p>
                    <p><strong>شماره تماس:</strong> ${registration.phone}</p>
                </div>
                <div class="delete-actions">
                    <button class="cancel-btn" onclick="this.closest('.modal').remove()">انصراف</button>
                    <button class="delete-btn" onclick="confirmDelete(${index})">حذف</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // بستن مودال با کلیک روی ×
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    // بستن مودال با کلیک روی پس‌زمینه
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// تابع تایید حذف
function confirmDelete(index) {
    registrations.splice(index, 1);
    localStorage.setItem('registrations', JSON.stringify(registrations));
    displayRegistrations();
    document.querySelector('.modal').remove();
    showSuccessMessage('دانش‌آموز با موفقیت حذف شد');
}

// نمایش پیام موفقیت
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

// تابع جستجو
function searchRegistrations() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase();
    const tbody = document.getElementById('registrations-list');
    const rows = tbody.getElementsByTagName('tr');
    
    // حذف کلاس highlight از همه ردیف‌ها
    Array.from(rows).forEach(row => {
        row.classList.remove('search-highlight');
    });
    
    // اگر فیلد جستجو خالی است، همه ردیف‌ها را نمایش بده
    if (!searchTerm.trim()) {
        Array.from(rows).forEach(row => {
            row.style.display = '';
        });
        return;
    }
    
    // جستجو در ردیف‌ها
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        let found = false;
        
        for (let j = 0; j < cells.length - 1; j++) { // -1 برای حذف ستون عملیات
            const cell = cells[j];
            if (cell.textContent.toLowerCase().includes(searchTerm)) {
                found = true;
                break;
            }
        }
        
        if (found) {
            row.style.display = '';
            row.classList.add('search-highlight');
        } else {
            row.style.display = 'none';
        }
    }
}

// اتصال تابع جستجو به دکمه جستجو و فیلد جستجو
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        // جستجوی زنده با تاخیر 300 میلی‌ثانیه برای جلوگیری از بار زیاد
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(searchRegistrations, 300);
        });
        
        // جستجو با فشردن Enter
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                clearTimeout(searchTimeout);
                searchRegistrations();
            }
        });
    }
});

// اضافه کردن event listener برای تغییر تعداد آیتم‌ها در هر صفحه
document.getElementById('items-per-page').addEventListener('change', function(e) {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1;
    displayRegistrations();
});

// اضافه کردن event listener برای دکمه‌های صفحه‌بندی
document.getElementById('prev-page').addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        displayRegistrations();
    }
});

document.getElementById('next-page').addEventListener('click', function() {
    const totalPages = Math.ceil(registrations.length / itemsPerPage);
    
    if (currentPage < totalPages) {
        currentPage++;
        displayRegistrations();
    }
});

// فراخوانی تابع نمایش در ابتدای بارگذاری صفحه
document.addEventListener('DOMContentLoaded', function() {
    displayRegistrations();
});

// مدیریت تنظیمات سایت
document.addEventListener('DOMContentLoaded', function() {
    // بارگذاری تنظیمات ذخیره شده
    loadSiteSettings();
    
    // مدیریت فرم تنظیمات سایت
    const siteSettingsForm = document.getElementById('site-settings-form');
    if (siteSettingsForm) {
        siteSettingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // جمع‌آوری اطلاعات فرم
        const siteSettings = {
            hero: {
                title: document.getElementById('hero-title').value,
                description: document.getElementById('hero-description').value,
                image: document.getElementById('hero-image').value
            },
            about: {
                title: document.getElementById('about-title').value,
                description: document.getElementById('about-description').value
            },
            contact: {
                phone: document.getElementById('contact-phone').value,
                email: document.getElementById('contact-email').value,
                address: document.getElementById('contact-address').value
            }
        };
        
        // ذخیره تنظیمات در localStorage
        localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
        
        // نمایش پیام موفقیت
        alert('تنظیمات سایت با موفقیت ذخیره شد!');
    });

    // به‌روزرسانی پیش‌نمایش در زمان واقعی
        siteSettingsForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function() {
            updatePreview();
        });
    });
    }

    // مدیریت باز و بسته شدن بخش‌ها
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.add('collapsed');
    });

    // اضافه کردن رویداد کلیک به عنوان‌های بخش‌ها
    document.querySelectorAll('.admin-section h2').forEach(header => {
        header.addEventListener('click', function() {
            const section = this.parentElement;
            section.classList.toggle('collapsed');
        });
    });

    // اضافه کردن event listener برای مرتب‌سازی
    const tableHeaders = document.querySelectorAll('.registrations-table th');
    tableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const field = this.getAttribute('data-sort');
            if (field) {
                sortRegistrations(field);
                // به‌روزرسانی آیکون مرتب‌سازی
                tableHeaders.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
                this.classList.add(sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
            }
        });
    });
});

// تابع بارگذاری تنظیمات سایت
function loadSiteSettings() {
    const siteSettings = JSON.parse(localStorage.getItem('siteSettings')) || {
        hero: {
            title: 'مدرسه عبدالله زاده',
            description: 'مدرسه‌ای با بیش از ۲۰ سال سابقه درخشان در آموزش و پرورش',
            image: 'images/school-building.jpg'
        },
        about: {
            title: 'درباره ما',
            description: 'مدرسه عبدالله زاده با هدف ارائه آموزش با کیفیت و پرورش استعدادهای دانش‌آموزان در سال ۱۳۸۰ تأسیس شد.'
        },
        contact: {
            phone: '۰۲۱-۱۲۳۴۵۶۷۸',
            email: 'info@abdollahzadeh.com',
            address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳'
        }
    };
    
    // ذخیره تنظیمات پیش‌فرض در localStorage
    localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
    
    // پر کردن فیلدهای فرم
    const heroTitle = document.getElementById('hero-title');
    const heroDescription = document.getElementById('hero-description');
    const heroImage = document.getElementById('hero-image');
    const aboutTitle = document.getElementById('about-title');
    const aboutDescription = document.getElementById('about-description');
    const contactPhone = document.getElementById('contact-phone');
    const contactEmail = document.getElementById('contact-email');
    const contactAddress = document.getElementById('contact-address');

    if (heroTitle) heroTitle.value = siteSettings.hero.title;
    if (heroDescription) heroDescription.value = siteSettings.hero.description;
    if (heroImage) heroImage.value = siteSettings.hero.image;
    if (aboutTitle) aboutTitle.value = siteSettings.about.title;
    if (aboutDescription) aboutDescription.value = siteSettings.about.description;
    if (contactPhone) contactPhone.value = siteSettings.contact.phone;
    if (contactEmail) contactEmail.value = siteSettings.contact.email;
    if (contactAddress) contactAddress.value = siteSettings.contact.address;
    
    // به‌روزرسانی پیش‌نمایش
    updatePreview();
}

// تابع به‌روزرسانی پیش‌نمایش
function updatePreview() {
    const heroTitle = document.getElementById('hero-title');
    const heroDescription = document.getElementById('hero-description');
    const heroImage = document.getElementById('hero-image');
    const aboutTitle = document.getElementById('about-title');
    const aboutDescription = document.getElementById('about-description');
    const contactPhone = document.getElementById('contact-phone');
    const contactEmail = document.getElementById('contact-email');
    const contactAddress = document.getElementById('contact-address');

    if (heroTitle) document.getElementById('preview-hero-title').textContent = heroTitle.value;
    if (heroDescription) document.getElementById('preview-hero-description').textContent = heroDescription.value;
    if (aboutTitle) document.getElementById('preview-about-title').textContent = aboutTitle.value;
    if (aboutDescription) document.getElementById('preview-about-description').textContent = aboutDescription.value;
    if (contactPhone) document.getElementById('preview-contact-phone').textContent = `تلفن: ${contactPhone.value}`;
    if (contactEmail) document.getElementById('preview-contact-email').textContent = `ایمیل: ${contactEmail.value}`;
    if (contactAddress) document.getElementById('preview-contact-address').textContent = `آدرس: ${contactAddress.value}`;
}

// مدیریت آپلود تصویر
document.getElementById('image-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // نمایش پیش‌نمایش تصویر
            const preview = document.getElementById('image-preview');
            preview.innerHTML = `<img src="${e.target.result}" alt="پیش‌نمایش تصویر">`;
            preview.classList.remove('empty');
            
            // ذخیره آدرس تصویر در فیلد متن
            document.getElementById('hero-image').value = e.target.result;
            
            // به‌روزرسانی پیش‌نمایش
            updatePreview();
        };
        
        reader.readAsDataURL(file);
    }
});

// مدیریت اخبار
let news = JSON.parse(localStorage.getItem('news')) || [];
let currentNewsIndex = -1;

// نمایش لیست اخبار
function displayNews() {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = '';

    news.forEach((item, index) => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
            <div class="news-item-content">
                <div class="news-item-title">${item.title}</div>
                <div class="news-item-date">${item.date}</div>
            </div>
            <div class="news-item-actions">
                <button class="edit-btn" onclick="editNews(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteNews(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        newsList.appendChild(newsItem);
    });

    updateNewsPreview();
}

// مدیریت مودال خبر
let newsModal;
let closeModalBtn;
let addNewsBtn;

// مقداردهی اولیه متغیرها پس از بارگذاری DOM
document.addEventListener('DOMContentLoaded', function() {
    newsModal = document.getElementById('news-modal');
    closeModalBtn = document.querySelector('#news-modal .close-modal');
    addNewsBtn = document.getElementById('add-news-btn');

    // رویداد کلیک برای دکمه بستن
    closeModalBtn.addEventListener('click', closeNewsModal);

    // رویداد کلیک برای بستن مودال با کلیک خارج از آن
    newsModal.addEventListener('click', function(e) {
        if (e.target === newsModal) {
            closeNewsModal();
        }
    });

    // رویداد کلیک برای دکمه افزودن خبر جدید
    addNewsBtn.addEventListener('click', function() {
        currentNewsIndex = -1;
        document.getElementById('news-form').reset();
        document.getElementById('news-image-preview').innerHTML = '';
        document.getElementById('news-image-preview').classList.add('empty');
        openNewsModal();
    });

    // نمایش اولیه اخبار
    displayNews();
});

// باز کردن مودال
function openNewsModal() {
    if (newsModal) {
        newsModal.style.display = 'flex';
    }
}

// بستن مودال
function closeNewsModal() {
    if (newsModal) {
        newsModal.style.display = 'none';
    }
}

// ویرایش خبر
function editNews(index) {
    currentNewsIndex = index;
    const newsItem = news[index];
    
    document.getElementById('news-title').value = newsItem.title;
    document.getElementById('news-date').value = newsItem.date;
    document.getElementById('news-content').value = newsItem.content;
    
    if (newsItem.image) {
        const preview = document.getElementById('news-image-preview');
        preview.innerHTML = `<img src="${newsItem.image}" alt="پیش‌نمایش تصویر">`;
        preview.classList.remove('empty');
    }
    
    openNewsModal();
}

// حذف خبر
function deleteNews(index) {
    if (confirm('آیا از حذف این خبر اطمینان دارید؟')) {
        news.splice(index, 1);
        localStorage.setItem('news', JSON.stringify(news));
        displayNews();
    }
}

// مدیریت فرم خبر
document.getElementById('news-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newsItem = {
        title: document.getElementById('news-title').value,
        date: document.getElementById('news-date').value,
        content: document.getElementById('news-content').value,
        image: document.getElementById('news-image-preview').querySelector('img')?.src || ''
    };
    
    if (currentNewsIndex === -1) {
        news.push(newsItem);
    } else {
        news[currentNewsIndex] = newsItem;
    }
    
    localStorage.setItem('news', JSON.stringify(news));
    document.getElementById('news-modal').style.display = 'none';
    displayNews();
});

// مدیریت آپلود تصویر خبر
document.getElementById('news-image-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const preview = document.getElementById('news-image-preview');
            preview.innerHTML = `<img src="${e.target.result}" alt="پیش‌نمایش تصویر">`;
            preview.classList.remove('empty');
            
            // ذخیره آدرس تصویر در فیلد متن
            document.getElementById('news-image').value = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }
});

// به‌روزرسانی پیش‌نمایش اخبار
function updateNewsPreview() {
    const preview = document.getElementById('preview-news');
    preview.innerHTML = '';

    news.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.className = 'preview-news-item';
        newsItem.innerHTML = `
            <h3>${item.title}</h3>
            <div class="date">${item.date}</div>
            <p>${item.content}</p>
            ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
        `;
        preview.appendChild(newsItem);
    });
}

// بارگذاری اولیه اخبار
document.addEventListener('DOMContentLoaded', function() {
    displayNews();
});

// تابع پر کردن فیلدهای تنظیمات سایت
function fillSiteSettings() {
    const siteSettings = JSON.parse(localStorage.getItem('siteSettings')) || {
        hero: {
            title: 'مدرسه عبدالله زاده',
            description: 'مدرسه‌ای با بیش از ۲۰ سال سابقه درخشان در آموزش و پرورش',
            image: 'images/school-building.jpg'
        },
        about: {
            title: 'درباره ما',
            description: 'مدرسه عبدالله زاده با هدف ارائه آموزش با کیفیت و پرورش استعدادهای دانش‌آموزان در سال ۱۳۸۰ تأسیس شد.'
        },
        contact: {
            phone: '۰۲۱-۱۲۳۴۵۶۷۸',
            email: 'info@abdollahzadeh.com',
            address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳'
        }
    };

    // پر کردن فیلدهای بخش اصلی
    document.getElementById('hero-title').value = siteSettings.hero.title;
    document.getElementById('hero-description').value = siteSettings.hero.description;
    document.getElementById('hero-image').value = siteSettings.hero.image;

    // پر کردن فیلدهای بخش درباره ما
    document.getElementById('about-title').value = siteSettings.about.title;
    document.getElementById('about-description').value = siteSettings.about.description;

    // پر کردن فیلدهای اطلاعات تماس
    document.getElementById('contact-phone').value = siteSettings.contact.phone;
    document.getElementById('contact-email').value = siteSettings.contact.email;
    document.getElementById('contact-address').value = siteSettings.contact.address;
}

// مدیریت تنظیمات سایت
document.addEventListener('DOMContentLoaded', function() {
    // بارگذاری تنظیمات ذخیره شده
    loadSiteSettings();
    
    // مدیریت فرم تنظیمات سایت
    const siteSettingsForm = document.getElementById('site-settings-form');
    if (siteSettingsForm) {
        siteSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // جمع‌آوری اطلاعات فرم
            const siteSettings = {
                hero: {
                    title: document.getElementById('hero-title').value,
                    description: document.getElementById('hero-description').value,
                    image: document.getElementById('hero-image').value
                },
                about: {
                    title: document.getElementById('about-title').value,
                    description: document.getElementById('about-description').value
                },
                contact: {
                    phone: document.getElementById('contact-phone').value,
                    email: document.getElementById('contact-email').value,
                    address: document.getElementById('contact-address').value
                }
            };
            
            // ذخیره تنظیمات در localStorage
            localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
            
            // نمایش پیام موفقیت
            alert('تنظیمات سایت با موفقیت ذخیره شد!');
        });

        // به‌روزرسانی پیش‌نمایش در زمان واقعی
        siteSettingsForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', function() {
                updatePreview();
            });
        });
    }
}); 