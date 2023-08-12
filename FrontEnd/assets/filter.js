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

// Déclarez la variable buttonsContainer en dehors de la fonction categoryDisplay
let buttonsContainer;

// Fonction pour afficher les catégories dans l'interface utilisateur
const categoryDisplay = async () => {
  const categories = await fetchCategories();
  const portfolio = document.querySelector('#portfolio');
  const allButton = document.createElement('button');
  allButton.textContent = 'Tous';
  allButton.dataset.categoryId = 'all';
  allButton.addEventListener('click', () => {
    showAllImages();
    showAllCaptions();
    setActiveButton(allButton); // Ajout de la mise en forme pour le bouton "Tous"
  });

  const title = portfolio.querySelector('h2');

  buttonsContainer = document.createElement('div'); // Affectez buttonsContainer ici
  buttonsContainer.classList.add('buttons-container');
  buttonsContainer.style.display = 'flex';
  buttonsContainer.style.gap = '15px'

  if (isUserLoggedIn()) {
    buttonsContainer.style.visibility = 'hidden';
  }

  buttonsContainer.appendChild(allButton);

  // Création des Boutons de Catégorie
  categories.forEach(catData => {
    const button = document.createElement('button');
    button.textContent = catData.name;
    button.dataset.categoryId = catData.id;
    button.addEventListener('click', () => {
      const categoryId = button.dataset.categoryId;
      showImagesByCategory(categoryId);
      setActiveButton(button); // Ajout de la mise en forme pour le bouton de catégorie
    });
    buttonsContainer.appendChild(button);
  });

  portfolio.insertBefore(buttonsContainer, title.nextElementSibling);
};
// Ajout de la classe active au bouton cliqué et mise à jour des styles
const setActiveButton = (button) => {
  buttonsContainer.querySelectorAll('button').forEach(btn => {
    btn.classList.remove('active');
    btn.style.backgroundColor = '';
    btn.style.color = '';
  });
  button.classList.add('active');
  button.style.backgroundColor = '#1D6154'; // Vert foncé
  button.style.color = 'white'; // Texte en blanc
};

categoryDisplay();