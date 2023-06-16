// Récupérer les éléments HTML
const loginForm = document.getElementById('login-form')
const loginLink = document.getElementById('login-link')
const logoutLink = document.getElementById('logout-link')

// Fonction pour vérifier l'état de connexion
const isLogged = () => {
  const token = localStorage.getItem('token')
  return token ? true : false
}

// Fonction pour mettre à jour l'état du bouton de connexion
function updateLoginButton () {
  const loginButton = document.getElementById('login-link')

  if (isLogged()) {
    loginButton.innerText = 'Logout'
  } else {
    loginButton.innerText = 'Login'
  }

  console.log('updateLoginButton called') // Vérifiez si la fonction est appelée
}

// Vérifier l'état de connexion lors du chargement de la page
document.addEventListener('DOMContentLoaded', function () {
  updateLoginButton() // Appeler la fonction pour mettre à jour l'état du bouton de connexion lors du chargement de la page
})

// Ajouter un événement de soumission du formulaire de connexion
loginForm.addEventListener('submit', function (event) {
  event.preventDefault() // Empêcher le rechargement de la page
  // Récupérer les valeurs des champs d'identification
  const email = document.getElementById('Email').value
  const password = document.getElementById('password').value

  // Appeler la fonction de connexion avec les valeurs des champs d'identification
  login(email, password)
})

// Ajouter un événement de clic sur le lien de déconnexion
logoutLink.addEventListener('click', function (event) {
  event.preventDefault() // Empêcher le rechargement de la page

  // Appeler la fonction de déconnexion
  logout()
})

// Fonction pour effectuer une requête de connexion
function login (email, password) {
  // Ajouter le compte de test
  if (email === 'sophie.bluel@test.tld' && password === 'S0phie') {
    // Si les identifiants sont corrects, effectuer les actions suivantes :

    // Afficher le lien de déconnexion et masquer le lien de connexion
    loginLink.style.display = 'none'
    logoutLink.style.display = 'inline'

    // Réinitialiser les valeurs des champs d'identification
    loginForm.reset()

    // Redirection vers index.html
    window.location.href = 'index.html'

    // Sortir de la fonction pour éviter d'effectuer la requête POST à votre API
    return
  }

  // Effectuer ici la requête POST à votre API pour la connexion
  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
    .then(function (response) {
      // Vérifier la réponse de l'API
      if (response.ok) {
        // Si la connexion réussit (réponse avec statut 200 OK), effectuer les actions suivantes :

        // Afficher le lien de déconnexion et masquer le lien de connexion
        loginLink.style.display = 'none'
        logoutLink.style.display = 'inline'

        // Réinitialiser les valeurs des champs d'identification
        loginForm.reset()

        // Redirection vers index.html
        window.location.href = 'index.html'
      } else {
        // Si la connexion échoue (statut d'erreur), effectuer les actions suivantes :

        // Afficher un message d'erreur à l'utilisateur ou prendre d'autres mesures appropriées
        console.error('Échec de la connexion')
      }
    })
    .catch(function (error) {
      // Si une erreur se produit lors de la requête, effectuer les actions suivantes :

      // Afficher un message d'erreur à l'utilisateur ou prendre d'autres mesures appropriées
      console.error(error)
    })
}

// Fonction pour effectuer une requête de déconnexion
function logout () {
  // Effectuer ici la requête POST à votre API pour la déconnexion
  fetch('http://localhost:5678/api/users/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function (response) {
      // Vérifier la réponse de l'API
      if (response.ok) {
        // Si la déconnexion réussit (réponse avec statut 200 OK), effectuer les actions suivantes :

        // Afficher le lien de connexion et masquer le lien de déconnexion
        loginLink.style.display = 'inline'
        logoutLink.style.display = 'none'

        // Redirection vers login.html
        window.location.href = 'login.html'
      } else {
        // Si la déconnexion échoue (statut d'erreur), effectuer les actions suivantes :

        // Afficher un message d'erreur à l'utilisateur ou prendre d'autres mesures appropriées
        console.error('Échec de la déconnexion')
      }
    })
    .catch(function (error) {
      // Si une erreur se produit lors de la requête, effectuer les actions suivantes :

      // Afficher un message d'erreur à l'utilisateur ou prendre d'autres mesures appropriées
      console.error(error)
    })
}
