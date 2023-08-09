const token = localStorage.getItem('token');

const isLogged = () => !!token;

const updateStyles = (loggedIn) => {
  const faSolidIcons = document.querySelectorAll('.fa-solid');
  faSolidIcons.forEach(icon => icon.style.display = loggedIn ? 'inline' : 'none');
};

const handleLogin = () => {
  const loginForm = document.querySelector('#login-form');
  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    
    const email = document.querySelector('#Email').value;
    const password = document.querySelector('#password').value;

    try {
      const response = await authenticate(email, password);
      localStorage.setItem('token', response.token);
      window.location.href = './index.html';
    } catch (error) {
      console.error("Erreur lors de l'authentification :", error);
      // Affichez un message d'erreur à l'utilisateur
    }
  });
};

const authenticate = async (email, password) => {
  const response = await fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error("Échec de l'authentification");
  }

  return response.json();
};

window.addEventListener('load', () => {
  const loginButton = document.querySelector('#login-link');
  
  if (isLogged()) {
    loginButton.innerHTML = 'logout';
    loginButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      loginButton.innerHTML = 'login';
      updateStyles(false);
      window.location.href = './index.html'; // Rediriger vers index.html après la déconnexion
    });
    updateStyles(true);
  } else {
    loginButton.href = './login.html';
    updateStyles(false);
  }

  handleLogin();
});

