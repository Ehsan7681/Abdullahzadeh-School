// تنظیمات ورود به پنل مدیریت
const adminConfig = {
    username: 'admin',
    // رمز عبور با استفاده از bcrypt یا روش‌های مشابه هش شود
    passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // این یک نمونه هش است
    salt: 'your_random_salt_here'
};

// تابع بررسی اعتبار رمز عبور
function validatePassword(inputPassword) {
    // در اینجا باید از یک کتابخانه رمزنگاری مناسب استفاده شود
    const hash = sha256(inputPassword + adminConfig.salt);
    return hash === adminConfig.passwordHash;
}

// صادر کردن توابع و متغیرها
export { adminConfig, validatePassword }; 