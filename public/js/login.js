document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const pwdInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePwd');
    const eyeIcon = document.getElementById('eyeIcon');
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const spinner = document.getElementById('spinner');
    const btnText = document.getElementById('btnText');
    const usernameInput = document.getElementById('username');

    // Guard against missing elements (in case of page changes)
    if (!pwdInput || !toggleBtn || !eyeIcon || !loginForm) return;

    // 1️⃣ Password visibility toggle
    toggleBtn.addEventListener('click', () => {
        const type = pwdInput.type === 'password' ? 'text' : 'password';
        pwdInput.type = type;
        eyeIcon.className = type === 'password' ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
    });

    // 2️⃣ Simple client‑side validation
    const validate = () => {
        let valid = true;
        // Username: at least 3 characters
        if (usernameInput.value.trim().length < 3) {
            usernameInput.classList.add('is-invalid');
            valid = false;
        } else {
            usernameInput.classList.remove('is-invalid');
        }
        // Password: at least 6 characters
        if (pwdInput.value.length < 6) {
            pwdInput.classList.add('is-invalid');
            valid = false;
        } else {
            pwdInput.classList.remove('is-invalid');
        }
        return valid;
    };

    // 3️⃣ Show spinner & disable button on submit
    loginForm.addEventListener('submit', (e) => {
        if (!validate()) {
            e.preventDefault(); // stop submission if validation fails
            return;
        }
        // Show loading state
        spinner.classList.remove('d-none');
        btnText.textContent = 'Logging in…';
        loginBtn.disabled = true;
    });
});
