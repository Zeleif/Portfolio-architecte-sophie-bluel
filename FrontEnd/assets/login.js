// Récupérer le token d'authentification depuis le localStorage
const token = localStorage.getItem('token')
// Fonction qui vérifie si l'utilisateur est connecté en fonction de la présence du token
const isLogged = () => {
  if (token) {
    return true
  } else {
    return false
  }
}
// Fonction pour mettre à jour la page d'accueil en fonction de l'état de connexion de l'utilisateur
const updateHomepage = () => {
  const loginButton = document.querySelector('#login-link')
  if (isLogged()) {
    loginButton.href = '#'
    loginButton.innerHTML = 'logout'
    loginButton.addEventListener('click', () => {
      localStorage.removeItem('token') // Déconnexion de l'utilisateur en supprimant le token du localStorage
      loginButton.innerHTML = 'login'
    })
    updateStylesOnLogin() // Appeler la fonction pour mettre à jour les styles lorsque l'utilisateur est connecté
  } else {
    loginButton.href = './login.html'
  }
}
// Mettre à jour la page d'accueil lorsque la page est chargée
window.addEventListener('load', () => {
  updateHomepage()
})
// Fonction pour mettre à jour les styles lorsque l'utilisateur est connecté
const updateStylesOnLogin = () => {
  const modalHeader = document.querySelector('#modal__header')
  const faSolidIcons = document.querySelectorAll('.fa-solid')
  const dynamicButtonsContainer = document.querySelector('.buttons-container')

  // Rendre le modal__header visible
  modalHeader.style.display = 'block'

  // Afficher les icônes fa-solid
  faSolidIcons.forEach(icon => {
    icon.style.display = 'inline'
  })

  // Supprimer le conteneur des boutons créés dynamiquement
  dynamicButtonsContainer.style.display = 'none'
}

window.addEventListener('load', () => {
  updateHomepage()
})
// Gestionnaire d'événement lorsque le formulaire de connexion est soumis
const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', event => {
  event.preventDefault() // Empêche la soumission du formulaire de recharger la page

// Récupérer les champs d'entrée de l'e-mail et du mot de passe
  const emailInput = document.querySelector('#Email')
  const passwordInput = document.querySelector('#password')

  const email = emailInput.value
  const password = passwordInput.value

  // Appelez une fonction d'authentification avec l'e-mail et le mot de passe
  authenticate(email, password)
})
// Fonction pour envoyer une requête d'authentification avec l'e-mail et le mot de passe fournis
const authenticate = (email, password) => {
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
    .then(response => {
      if (response.ok) {
        // Authentification réussie
        return response.json()
      } else {
        // Gestion des erreurs d'authentification
        throw new Error("Échec de l'authentification")
      }
    })
    .then(data => {
      // Stockez le token dans le localStorage
      localStorage.setItem('token', data.token)

      // Redirigez vers la page d'accueil après l'authentification réussie
      window.location.href = './index.html'
    })
    .catch(error => {
      console.error("Erreur lors de l'authentification :", error)
      // Affichez un message d'erreur à l'utilisateur
    })
}
