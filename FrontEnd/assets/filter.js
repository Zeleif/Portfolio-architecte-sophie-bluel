const fetchCategories = async () => {
  const response = await fetch('http://localhost:5678/api/categories')
  if (response.ok === true) {
    return response.json()
  }
  throw new Error('Impossible de contacter le serveur')
}

const showAllImages = () => {
  const figures = document.querySelectorAll('.gallery article')
  figures.forEach(figure => {
    figure.style.display = 'block' // Afficher l'image et son conteneur
  })
}

const showAllCaptions = () => {
  const captions = document.querySelectorAll('.gallery figcaption')
  captions.forEach(caption => {
    caption.style.display = 'block' // Afficher la légende
  })
}

const categoryDisplay = async () => {
  const categories = await fetchCategories()
  const portfolio = document.querySelector('#portfolio')

  const allButton = document.createElement('button')
  allButton.textContent = 'Tout'
  allButton.dataset.categoryId = 'all'
  allButton.addEventListener('click', () => {
    showAllImages()
    showAllCaptions() // Ajout de cette fonction pour afficher toutes les légendes
  })

  const title = portfolio.querySelector('h2')

  const buttonsContainer = document.createElement('div')
  buttonsContainer.classList.add('buttons-container') // Ajout d'une classe pour le style CSS
  buttonsContainer.style.display = 'flex' // Utilisation de flexbox
  buttonsContainer.style.justifyContent = 'center' // Centrer les éléments horizontalement

  buttonsContainer.appendChild(allButton) // Ajouter le bouton "Tout" au début du conteneur des boutons

  categories.forEach(catData => {
    const button = document.createElement('button')
    button.textContent = catData.name
    button.dataset.categoryId = catData.id
    button.addEventListener('click', () => {
      const categoryId = button.dataset.categoryId
      showImagesByCategory(categoryId)
    })

    buttonsContainer.appendChild(button)
  })

  portfolio.insertBefore(buttonsContainer, title.nextElementSibling) // Insérer le conteneur des boutons juste après le titre h2
}

categoryDisplay()
