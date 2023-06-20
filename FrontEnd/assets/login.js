const token = localStorage.getItem("token");
console.log(token);

const isLogged = () => {
  if (token) {
    return true;
  } else {
    return false;
  }
};

const updateHomepage = () => {
  const loginButton = document.querySelector("#login-link");
  if (isLogged()) {
    console.log("connected");
    loginButton.href = "#";
    loginButton.innerHTML = "logout";
    loginButton.addEventListener("click", () => {
      localStorage.removeItem("token");
      console.log("disconnected");
      loginButton.innerHTML = "login";
      window.location.reload();
    });
  } else {
    loginButton.href = "./login.html";
  }
};

window.addEventListener("load", () => {
  updateHomepage();
});

const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Empêche la soumission du formulaire de recharger la page

  const emailInput = document.querySelector("#Email");
  const passwordInput = document.querySelector("#password");

  const email = emailInput.value;
  const password = passwordInput.value;

  // Appelez une fonction d'authentification avec l'e-mail et le mot de passe
  authenticate(email, password);
});

const authenticate = (email, password) => {
  fetch('http://localhost:5678/api/users/login', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
    .then(response => {
      if (response.ok) {
        // Authentification réussie
        return response.json();
      } else {
        // Gestion des erreurs d'authentification
        throw new Error("Échec de l'authentification");
      }
    })
    .then(data => {
      // Stockez le token dans le localStorage 
      localStorage.setItem("token", data.token);

      // Redirigez vers la page d'accueil après l'authentification réussie
      window.location.href = "./index.html";
    })
    .catch(error => {
      console.error("Erreur lors de l'authentification :", error);
      // Affichez un message d'erreur à l'utilisateur
    });
};












