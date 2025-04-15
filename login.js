// دریافت اطلاعات ورود ذخیره شده
function getAdminCredentials() {
    return JSON.parse(localStorage.getItem('adminCredentials')) || {
        username: 'admin',
        password: '123456'
    };
}

// بررسی وضعیت ورود
function checkLoginStatus() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// ذخیره وضعیت ورود
function setLoginStatus(status) {
    localStorage.setItem('isLoggedIn', status);
}

// مدیریت فرم ورود
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const adminCredentials = getAdminCredentials();
    
    if (username === adminCredentials.username && password === adminCredentials.password) {
        setLoginStatus(true);
        window.location.href = 'admin.html';
    } else {
        alert('نام کاربری یا رمز عبور اشتباه است!');
    }
}); 