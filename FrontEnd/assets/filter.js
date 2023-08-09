// Fonction pour récupérer les catégories à partir du serveur
const fetchCategories = async () => {
  const response = await fetch('http://localhost:5678/api/categories')
  if (response.ok === true) {
    return response.json()
  }
  throw new Error('Impossible de contacter le serveur')
}
// Fonction pour afficher toutes les images en réinitialisant l'affichage
const showAllImages = () => {
  const figures = document.querySelectorAll('.gallery article')
  figures.forEach(figure => {
    figure.style.display = 'block' // Afficher l'image et son conteneur
  })
}
// Fonction pour afficher toutes les légendes
const showAllCaptions = () => {
  const captions = document.querySelectorAll('.gallery figcaption')
  captions.forEach(caption => {
    caption.style.display = 'block' // Afficher la légende
  })
}
// Fonction pour afficher les catégories dans l'interface utilisateur
const categoryDisplay = async () => {
  const categories = await fetchCategories()
  const portfolio = document.querySelector('#portfolio')

  const allButton = document.createElement('button')
  allButton.textContent = 'Tous'
  allButton.dataset.categoryId = 'all'
  allButton.addEventListener('click', () => {
    showAllImages()
    showAllCaptions() 
  })

  const title = portfolio.querySelector('h2')

  const buttonsContainer = document.createElement('div')
  buttonsContainer.classList.add('buttons-container') // Ajout d'une classe pour le style CSS
  buttonsContainer.style.display = 'flex' // Utilisation de flexbox
  buttonsContainer.style.justifyContent = 'center' // Centrer les éléments horizontalement

  if (isUserLoggedIn()) {
    buttonsContainer.style.visibility = 'hidden' // Masquer les boutons si connecté(e)
  }

  buttonsContainer.appendChild(allButton) // Ajouter le bouton "Tout" au début du conteneur des boutons

  // Création des Boutons de Catégorie
  categories.forEach(catData => {
    const button = document.createElement('button')
    button.textContent = catData.name
    button.dataset.categoryId = catData.id
    button.addEventListener('click', () => {
      const categoryId = button.dataset.categoryId
      //  Filtrage des Images par Catégorie
      showImagesByCategory(categoryId) 
    })
    buttonsContainer.appendChild(button)
  })

  portfolio.insertBefore(buttonsContainer, title.nextElementSibling) // Insérer le conteneur des boutons juste après le titre h2
}
categoryDisplay();
