document.addEventListener('DOMContentLoaded', function() {
    // Welcome Screen Animation
    const welcomeScreen = document.getElementById('welcomeScreen');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const authContainer = document.getElementById('authContainer');
    const appContainer = document.getElementById('appContainer');
    
    // Show welcome screen initially
    welcomeScreen.style.display = 'flex';
    
    // Get Started Button Click
    getStartedBtn.addEventListener('click', function() {
        welcomeScreen.style.opacity = '0';
        
        setTimeout(function() {
            welcomeScreen.style.display = 'none';
            authContainer.style.display = 'flex';
        }, 500);
    });
    
    // Auth Tabs
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    loginTab.addEventListener('click', function() {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    });
    
    signupTab.addEventListener('click', function() {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    });
    
    // Password Validation for Signup
    const signupPassword = document.getElementById('signupPassword');
    const signupConfirmPassword = document.getElementById('signupConfirmPassword');
    const signupSubmitBtn = signupForm.querySelector('button[type="submit"]');
    
    function validatePasswords() {
        if (signupPassword.value !== signupConfirmPassword.value) {
            signupConfirmPassword.setCustomValidity("Passwords don't match");
            signupSubmitBtn.disabled = true;
            signupSubmitBtn.style.opacity = '0.6';
            signupSubmitBtn.style.cursor = 'not-allowed';
            return false;
        } else {
            signupConfirmPassword.setCustomValidity('');
            signupSubmitBtn.disabled = false;
            signupSubmitBtn.style.opacity = '1';
            signupSubmitBtn.style.cursor = 'pointer';
            return true;
        }
    }
    
    signupPassword.addEventListener('input', validatePasswords);
    signupConfirmPassword.addEventListener('input', validatePasswords);
    
    // Password Strength Checker
    signupPassword.addEventListener('input', function() {
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength';
        
        if (!document.querySelector('.password-strength')) {
            signupPassword.insertAdjacentElement('afterend', strengthIndicator);
        } else {
            strengthIndicator = document.querySelector('.password-strength');
        }
        
        const strength = checkPasswordStrength(signupPassword.value);
        strengthIndicator.innerHTML = `Password Strength: <span class="strength-${strength.level}">${strength.level}</span>`;
        strengthIndicator.title = strength.message;
    });
    
    function checkPasswordStrength(password) {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        const mediumRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
        
        if (strongRegex.test(password)) {
            return { level: 'Strong', message: 'Your password is strong and secure' };
        } else if (mediumRegex.test(password)) {
            return { level: 'Medium', message: 'Your password could be stronger' };
        } else {
            return { level: 'Weak', message: 'Your password is too weak' };
        }
    }
    
    // Form Submissions with Validation
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            showAlert('Please fill in all fields', 'error');
            return;
        }
        
        // Simulate login process
        simulateLogin(email, password)
            .then(user => {
                authContainer.style.display = 'none';
                appContainer.style.display = 'block';
                
                // Update user profile in header
                document.querySelector('.username').textContent = user.name;
                document.querySelector('.profile-img').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${user.color}`;
                
                showAlert(`Welcome back, ${user.name}!`, 'success');
            })
            .catch(error => {
                showAlert(error.message, 'error');
            });
    });
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validatePasswords()) {
            showAlert("Passwords don't match", 'error');
            return;
        }
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = signupPassword.value;
        
        if (!name || !email || !password) {
            showAlert('Please fill in all fields', 'error');
            return;
        }
        
        // Check password strength
        const strength = checkPasswordStrength(password);
        if (strength.level === 'Weak') {
            showAlert('Your password is too weak. Please use a stronger password.', 'error');
            return;
        }
        
        // Simulate signup process
        simulateSignup(name, email, password)
            .then(user => {
                authContainer.style.display = 'none';
                appContainer.style.display = 'block';
                
                // Update user profile in header
                document.querySelector('.username').textContent = user.name;
                document.querySelector('.profile-img').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${user.color}`;
                
                showAlert(`Account created successfully! Welcome, ${user.name}!`, 'success');
            })
            .catch(error => {
                showAlert(error.message, 'error');
            });
    });
    
    // Simulate login/signup functions
    function simulateLogin(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check if user exists in localStorage
                const users = JSON.parse(localStorage.getItem('keywordPlannerUsers')) || [];
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    resolve({
                        name: user.name,
                        email: user.email,
                        color: stringToColor(user.name)
                    });
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 1000);
        });
    }
    
    function simulateSignup(name, email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check if email already exists
                const users = JSON.parse(localStorage.getItem('keywordPlannerUsers')) || [];
                const userExists = users.some(u => u.email === email);
                
                if (userExists) {
                    reject(new Error('Email already registered'));
                } else {
                    // Create new user
                    const newUser = {
                        name,
                        email,
                        password // Note: In a real app, you would hash the password
                    };
                    
                    users.push(newUser);
                    localStorage.setItem('keywordPlannerUsers', JSON.stringify(users));
                    
                    resolve({
                        name,
                        email,
                        color: stringToColor(name)
                    });
                }
            }, 1500);
        });
    }
    
    // Helper function to generate color from string
    function stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const color = Math.floor(Math.abs((Math.sin(hash) * 10000) % 1 * 16777216)).toString(16);
        return '#' + Array(6 - color.length + 1).join('0') + color;
    }
    
    // Alert System
    function showAlert(message, type) {
        // Remove existing alerts
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) existingAlert.remove();
        
        const alert = document.createElement('div');
        alert.className = `custom-alert ${type}`;
        alert.innerHTML = `
            <span>${message}</span>
            <button class="close-alert">&times;</button>
        `;
        
        document.body.appendChild(alert);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
        
        // Close button
        alert.querySelector('.close-alert').addEventListener('click', () => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        });
    }
    
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page') + 'Page';
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected page
            pages.forEach(page => {
                page.classList.remove('active');
                if(page.id === pageId) {
                    page.classList.add('active');
                }
            });
        });
    });
    
    // Keyword Search Functionality
    const searchBtn = document.getElementById('searchBtn');
    const keywordInput = document.getElementById('keywordInput');
    const countrySelect = document.getElementById('countrySelect');
    const languageSelect = document.getElementById('languageSelect');
    const resultsContainer = document.getElementById('resultsContainer');
    const keywordResults = document.getElementById('keywordResults').getElementsByTagName('tbody')[0];
    const exportBtn = document.querySelector('.action-btn.export');
    const saveBtn = document.querySelector('.action-btn.save');
    
    // Search history array
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
    searchBtn.addEventListener('click', function() {
        const keyword = keywordInput.value.trim();
        const country = countrySelect.value;
        const language = languageSelect.value;
        
        if(keyword) {
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
            searchBtn.disabled = true;
            
            // Add to search history
            addToSearchHistory(keyword, country, language);
            
            // Construct the Google keyword suggestions URL
            const googleKeywordUrl = `https://www.google.com/complete/search?output=toolbar&gl=${country}&hl=${language}&q=${encodeURIComponent(keyword)}`;
            
            // Open the Google keyword suggestions in a new tab
            window.open(googleKeywordUrl, '_blank');
            
            // Simulate getting results for our app display
            setTimeout(function() {
                // Simulate getting results
                const mockResults = generateMockResults(keyword);
                
                // Clear previous results
                keywordResults.innerHTML = '';
                
                // Add new results
                mockResults.forEach(result => {
                    const row = keywordResults.insertRow();
                    row.insertCell(0).textContent = result.keyword;
                    row.insertCell(1).textContent = result.volume.toLocaleString();
                    row.insertCell(2).textContent = result.competition;
                    row.insertCell(3).textContent = result.cpc;
                    
                    const trendCell = row.insertCell(4);
                    const trendIcon = document.createElement('i');
                    trendIcon.className = result.trend === 'up' ? 'fas fa-arrow-up trend-up' : 'fas fa-arrow-down trend-down';
                    trendCell.appendChild(trendIcon);
                });
                
                // Show results container
                resultsContainer.style.display = 'block';
                searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
                searchBtn.disabled = false;
                
                // Scroll to results
                resultsContainer.scrollIntoView({ behavior: 'smooth' });
                
                showAlert('Keyword search completed!', 'success');
            }, 1500);
        } else {
            showAlert('Please enter a keyword to search', 'error');
        }
    });
    
    // Add to search history
    function addToSearchHistory(keyword, country, language) {
        const searchEntry = {
            keyword,
            country,
            language,
            timestamp: new Date().toISOString()
        };
        
        // Add to beginning of array
        searchHistory.unshift(searchEntry);
        
        // Keep only last 10 searches
        if (searchHistory.length > 10) {
            searchHistory = searchHistory.slice(0, 10);
        }
        
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
    
    // Export results
    exportBtn.addEventListener('click', function() {
        if (keywordResults.rows.length === 0) {
            showAlert('No results to export', 'error');
            return;
        }
        
        let csv = 'Keyword,Volume,Competition,CPC,Trend\n';
        
        for (let i = 0; i < keywordResults.rows.length; i++) {
            const cells = keywordResults.rows[i].cells;
            const trend = cells[4].querySelector('i').className.includes('up') ? 'Up' : 'Down';
            
            csv += `"${cells[0].textContent}",${cells[1].textContent},${cells[2].textContent},${cells[3].textContent},${trend}\n`;
        }
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `keyword-results-${new Date().toISOString().slice(0,10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showAlert('Results exported successfully!', 'success');
    });
    
    // Save results
    saveBtn.addEventListener('click', function() {
        if (keywordResults.rows.length === 0) {
            showAlert('No results to save', 'error');
            return;
        }
        
        const savedSearches = JSON.parse(localStorage.getItem('savedSearches')) || [];
        const searchData = {
            keyword: keywordInput.value,
            country: countrySelect.value,
            language: languageSelect.value,
            date: new Date().toISOString(),
            results: []
        };
        
        for (let i = 0; i < keywordResults.rows.length; i++) {
            const cells = keywordResults.rows[i].cells;
            const trend = cells[4].querySelector('i').className.includes('up') ? 'up' : 'down';
            
            searchData.results.push({
                keyword: cells[0].textContent,
                volume: cells[1].textContent,
                competition: cells[2].textContent,
                cpc: cells[3].textContent,
                trend
            });
        }
        
        savedSearches.push(searchData);
        localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
        
        showAlert('Search results saved!', 'success');
    });
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value;
        
        if (!name || !email || !message) {
            showAlert('Please fill in all required fields', 'error');
            return;
        }
        
        // Validate email
        if (!validateEmail(email)) {
            showAlert('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate sending message
        setTimeout(() => {
            showAlert('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
        }, 1000);
    });
    
    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Function to generate mock keyword results
    function generateMockResults(baseKeyword) {
        const keywords = [
            `${baseKeyword} tips`,
            `best ${baseKeyword}`,
            `${baseKeyword} for beginners`,
            `how to ${baseKeyword}`,
            `${baseKeyword} tutorial`,
            `${baseKeyword} guide`,
            `${baseKeyword} examples`,
            `${baseKeyword} techniques`,
            `${baseKeyword} tools`,
            `${baseKeyword} software`
        ];
        
        return keywords.map(keyword => ({
            keyword: keyword,
            volume: Math.floor(Math.random() * 10000) + 1000,
            competition: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
            cpc: '$' + (Math.random() * 5).toFixed(2),
            trend: Math.random() > 0.5 ? 'up' : 'down'
        }));
    }
    
    // Add some CSS for new elements
    const style = document.createElement('style');
    style.textContent = `
        .password-strength {
            font-size: 0.8rem;
            margin-top: 0.5rem;
            color: var(--gray-color);
        }
        
        .password-strength span {
            font-weight: bold;
        }
        
        .strength-Weak {
            color: var(--danger-color);
        }
        
        .strength-Medium {
            color: var(--warning-color);
        }
        
        .strength-Strong {
            color: var(--success-color);
        }
        
        .custom-alert {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            box-shadow: var(--box-shadow);
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 1000;
            transition: opacity 0.3s ease;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        }
        
        .custom-alert.error {
            background-color: #f8d7da;
            color: #721c24;
            border-left: 4px solid #f5c6cb;
        }
        
        .custom-alert.success {
            background-color: #d4edda;
            color: #155724;
            border-left: 4px solid #c3e6cb;
        }
        
        .close-alert {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: 1rem;
            color: inherit;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .trend-up {
            color: var(--success-color);
        }
        
        .trend-down {
            color: var(--danger-color);
        }
    `;
    document.head.appendChild(style);
});