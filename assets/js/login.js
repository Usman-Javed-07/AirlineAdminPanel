document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      // Redirect to dashboard
      window.location.href = './dashboard.html';
    } else {
      document.getElementById('error').textContent = data.message;
    }
  } catch (err) {
    console.error(err);
    document.getElementById('error').textContent = 'Network error';
  }
});
