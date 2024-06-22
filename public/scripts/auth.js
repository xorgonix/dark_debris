document.addEventListener('DOMContentLoaded', function() {
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const data = {
                identity: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            try {
                const response = await fetch('http://127.0.0.1:8090/api/collections/users/auth-with-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const notification = document.getElementById('notification');

                if (response.ok && response.headers.get('Content-Type').includes('application/json')) {
                    const result = await response.json();

                    notification.className = 'alert alert-success';
                    notification.textContent = 'Login successful. Redirecting to complete your profile...';
                    notification.style.display = 'block';

                    console.log(result);
                    // Store the auth token
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('pb_avatar', result.record.avatar);
                    localStorage.setItem('pb_username', result.record.username);
                    localStorage.setItem('pb_email', result.record.email);
                    localStorage.setItem('pb_userId', result.record.id);
                    localStorage.setItem('pb_type', result.record.type);
                    localStorage.setItem('pb_verified', result.record.verified);
                } else {
                    const result = await response.json();
                    notification.className = 'alert alert-danger';
                    notification.textContent = `Error: ${result.message}`;
                    notification.style.display = 'block';
                }
            } catch (error) {
                console.error('Error:', error);
                const notification = document.getElementById('notification');
                notification.className = 'alert alert-danger';
                notification.textContent = 'An error occurred. Please try again.';
                notification.style.display = 'block';
            }
        });
    }

    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const data = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                passwordConfirm: document.getElementById('passwordConfirm').value
            };

            if (data.password !== data.passwordConfirm) {
                showNotification('Passwords do not match.', 'danger');
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8090/api/collections/users/records', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: data.email,
                        password: data.password,
                        passwordConfirm: data.passwordConfirm,
                        username: data.username
                    })
                });

                if (response.ok) {
                    showNotification('Registration successful. You can now log in.', 'success');
                } else {
                    const result = await response.json();
                    showNotification(`Error: ${result.message}`, 'danger');
                }
            } catch (error) {
                showNotification('An error occurred. Please try again.', 'danger');
                console.error('Error:', error);
            }
        });
    }

    // Helper function to show notifications
    function showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.className = `alert alert-${type}`;
        notification.textContent = message;
        notification.style.display = 'block';
    }
});
