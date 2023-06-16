function fetchImages() {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:5678/api/works')
      .then(response => {
        if (response.ok) {
          resolve(response.json());
        } else {
          reject(new Error('Impossible de contacter le serveur'));
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

const imageDisplay = async () => {
  try {
    const images = await fetchImages();
    const galleryDiv = document.querySelector('.gallery');

    images.forEach(imageData => {
      const figure = document.createElement('article');
      const img = document.createElement('img');
      img.src = imageData.imageUrl;
      img.alt = '#';
      img.dataset.categoryId = imageData.categoryId; // Ajout de l'attribut data-category-id
      figure.appendChild(img);
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = imageData.title;
      figure.appendChild(figcaption);
      galleryDiv.appendChild(figure);
    });
  } catch (error) {
    console.error(error);
  }
};

const showImagesByCategory = (categoryId) => {
  const images = document.querySelectorAll('.gallery img');
  images.forEach(img => {
    const figure = img.parentElement;
    if (categoryId === 'all' || img.dataset.categoryId === categoryId) {
      figure.style.display = 'block'; // Afficher l'image et son conteneur
    } else {
      figure.style.display = 'none'; // Masquer l'image et son conteneur
    }
  });
};

imageDisplay();



           


