document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    if (!form) return;

    const fields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        facebook: document.getElementById('facebook'),
    };

    const nameRules = {
        length: document.getElementById('rule-length'),
        special: document.getElementById('rule-special')
    };

    const validators = {
        nameNoSpecial: (value) => /^[\p{L}\s]+$/u.test(value),
        email: (value) => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value),
        phone: (value) => /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(value),
        facebook: (value) => !value || /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/i.test(value)
    };

    const updateRuleStatus = (element, isValid) => {
        if (!element) return;
        if (isValid) {
            element.classList.remove('text-red-500', 'text-txt-tertiary');
            element.classList.add('text-green-600', 'font-medium');
        } else {
            element.classList.remove('text-green-600', 'text-txt-tertiary');
            element.classList.add('text-red-500');
        }
    };

    const validateName = (input) => {
        const value = input.value.trim();

        const isMinLength = value.length >= 6;
        const isNoSpecial = value.length > 0 && validators.nameNoSpecial(value);

        // Cập nhật trạng thái hiển thị dạng cột cho từng dòng báo lỗi
        if (value.length === 0) {
            Object.values(nameRules).forEach(element => {
                if (element) element.className = 'flex items-center gap-1.5 transition-colors text-txt-tertiary';
            });
            input.classList.remove('border-red-500', 'border-green-500');
            input.classList.add('border-bg-secondary');
            return false;
        }

        updateRuleStatus(nameRules.length, isMinLength);
        updateRuleStatus(nameRules.special, isNoSpecial);

        const isValid = isMinLength && isNoSpecial;

        if (isValid) {
            input.classList.remove('border-red-500');
            input.classList.add('border-green-500');
        } else {
            input.classList.remove('border-green-500');
            input.classList.add('border-red-500');
        }

        return isValid;
    };

    const showError = (input, message) => {
        const parent = input.parentElement;
        const errorTarget = parent.querySelector('.error-msg');

        input.classList.add('border-red-500');
        input.classList.remove('border-bg-secondary');

        if (errorTarget) {
            errorTarget.textContent = message;
            errorTarget.classList.remove('hidden');
        }
    };

    const clearError = (input) => {
        const parent = input.parentElement;
        const errorTarget = parent.querySelector('.error-msg');

        input.classList.remove('border-red-500');
        input.classList.add('border-bg-secondary');

        if (errorTarget) {
            errorTarget.textContent = '';
            errorTarget.classList.add('hidden');
        }
    };

    const validateField = (field) => {
        if (field.id === 'name') {
            return validateName(field);
        }

        const value = field.value.trim();

        if (field.id === 'email') {
            if (!value) return showError(field, 'Email is required');
            if (!validators.email(value)) return showError(field, 'Please enter a valid email address');
        }

        if (field.id === 'phone') {
            if (!value) return showError(field, 'Phone number is required');
            if (!validators.phone(value)) return showError(field, 'Please enter a valid VN phone number (e.g 0902451316)');
        }

        if (field.id === 'facebook' && value) {
            if (!validators.facebook(value)) return showError(field, 'Invalid Facebook profile link');
        }

        clearError(field);
        return true;
    };

    Object.values(fields).forEach(input => {
        if (!input) return;
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
    });

    // Submit Handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;
        Object.values(fields).forEach(input => {
            if (input && !validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            alert('Registered successfully!');
            form.reset();
            Object.values(fields).forEach(input => input && clearError(input));
            Object.values(nameRules).forEach(element => {
                if (element) element.className = 'flex items-center gap-1.5 transition-colors text-txt-tertiary';
            });
        }
    });
});