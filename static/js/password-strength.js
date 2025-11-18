// Password Strength Indicator
document.addEventListener('DOMContentLoaded', function() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(function(passwordInput) {
        // Only add strength indicator to password creation fields (not confirm password)
        if (passwordInput.name === 'password' || passwordInput.name === 'password1') {
            passwordInput.addEventListener('input', function() {
                updatePasswordStrength(this.value);
            });
        }
    });
    
    function updatePasswordStrength(password) {
        const strengthBars = document.querySelectorAll('.strength-bars .bar');
        const strengthText = document.querySelector('.password-strength span');
        
        if (!strengthBars.length) return;
        
        // Calculate password strength
        const strength = calculatePasswordStrength(password);
        
        // Reset all bars
        strengthBars.forEach(bar => {
            bar.classList.remove('active', 'weak', 'medium', 'strong');
        });
        
        // Update bars based on strength
        let strengthLevel = '';
        let barClass = '';
        
        if (strength.score === 0) {
            strengthLevel = 'Very Weak';
            barClass = 'weak';
            strengthBars[0].classList.add('active', barClass);
        } else if (strength.score === 1) {
            strengthLevel = 'Weak';
            barClass = 'weak';
            for (let i = 0; i < 2; i++) {
                strengthBars[i].classList.add('active', barClass);
            }
        } else if (strength.score === 2) {
            strengthLevel = 'Medium';
            barClass = 'medium';
            for (let i = 0; i < 3; i++) {
                strengthBars[i].classList.add('active', barClass);
            }
        } else if (strength.score >= 3) {
            strengthLevel = 'Strong';
            barClass = 'strong';
            for (let i = 0; i < 4; i++) {
                strengthBars[i].classList.add('active', barClass);
            }
        }
        
        // Update text
        if (strengthText) {
            strengthText.textContent = password.length > 0 ? `Password strength: ${strengthLevel}` : 'Password strength';
        }
    }
    
    function calculatePasswordStrength(password) {
        let score = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            symbols: /[^A-Za-z0-9]/.test(password)
        };
        
        // Length check (most important)
        if (checks.length) score += 1;
        
        // Character variety checks
        if (checks.lowercase) score += 0.5;
        if (checks.uppercase) score += 0.5;
        if (checks.numbers) score += 0.5;
        if (checks.symbols) score += 0.5;
        
        // Bonus for longer passwords
        if (password.length >= 12) score += 0.5;
        if (password.length >= 16) score += 0.5;
        
        // Cap the score at 4
        score = Math.min(4, Math.floor(score));
        
        return {
            score: score,
            checks: checks
        };
    }
});
