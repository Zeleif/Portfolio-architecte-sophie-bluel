function fetchImages() {
   // Fonction pour effectuer une requête GET au serveur pour récupérer les images
  return new Promise((resolve, reject) => {
    fetch('http://localhost:5678/api/works', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          resolve(response.json()); // Résoudre la promesse avec les données JSON renvoyées par le serveur
        } else {
          reject(new Error('Impossible de contacter le serveur'));// Rejeter la promesse en cas d'erreur de requête
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

const imageDisplay = async () => {
   // Fonction asynchrone pour afficher les images
  try {
    const images = await fetchImages();// Récupérer les images à partir du serveur en utilisant await
    const galleryDiv = document.querySelector('.gallery');

    galleryDiv.innerHTML = ''; // Réinitialiser la galerie principale

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

const showImagesByCategory = categoryId => {
  // Fonction pour filtrer et afficher les images en fonction de leur catégorie
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

document.addEventListener('DOMContentLoaded', () => {
  // Appeler la fonction imageDisplay lors du chargement du DOM pour afficher les images
  imageDisplay();
});

const modalContainer = document.querySelector('.modal-container');
const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.close-modal');
const modalFooter = document.querySelector('.modal-footer');
const modalText = document.querySelector('.modal-text');
const modalBtn = document.querySelector('#open-bouton');
const modalHeader = document.getElementById('modal__header');
const galleryContainer = document.querySelector('.gallery-container');

const imageIdsSet = new Set();

function displayGallery(images) {
  galleryContainer.innerHTML = '';

  images.forEach((image, i) => {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');

    const imageElement = document.createElement('img');
    imageElement.src = image.imageUrl;
    imageElement.alt = image.title;
    imageElement.classList.add('gallery-item');

    const deleteIconContainer = document.createElement('div');
    deleteIconContainer.classList.add('delete-icon');

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-regular', 'fa-trash-can');

    deleteIcon.addEventListener('click', () => {
      deleteImage(image.id, imageContainer); // Appeler une fonction pour supprimer l'image
    });

    deleteIconContainer.appendChild(deleteIcon);

    const editText = document.createElement('span');
    editText.textContent = 'Éditer';
    editText.classList.add('edit-text');

    imageContainer.appendChild(imageElement);
    imageContainer.appendChild(deleteIconContainer);
    imageContainer.appendChild(editText);

    galleryContainer.appendChild(imageContainer);

    imageIdsSet.add(image.id); // Ajouter l'ID de l'image à l'ensemble

    // Code pour faire apparaître l'icône en survol de chaque image individuellement
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('icon-container');
    const upDownLeftRightIcon = document.createElement('i');
    upDownLeftRightIcon.classList.add('fa', 'fa-up-down-left-right', 'custom-icon');
    iconContainer.appendChild(upDownLeftRightIcon);

    imageContainer.appendChild(iconContainer);

    // Ajouter une classe pour cacher initialement l'icône
    iconContainer.classList.add('hidden');

    imageContainer.addEventListener('mouseover', () => {
      iconContainer.classList.remove('hidden'); // Retirer la classe "hidden" lors du survol
    });

    imageContainer.addEventListener('mouseout', () => {
      iconContainer.classList.add('hidden'); // Ajouter la classe "hidden" lorsque la souris quitte
    });
  });
}
// fonction pour supprimer l'image
function deleteImage(imageId, imageContainer) {
  // Récupérer les informations d'identification de l'utilisateur authentifié
  const authToken = localStorage.getItem('token');

  // Vérifier si l'utilisateur est authentifié
  if (!authToken) {
    console.error('Utilisateur non authentifié');
    return;
  }

  // Configurer les en-têtes de la requête avec les informations d'identification
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`,
  };

  // Envoyer une requête HTTP DELETE pour supprimer l'image avec les en-têtes personnalisés
  fetch(`http://localhost:5678/api/works/${imageId}`, {
    method: 'DELETE',
    headers: headers,
  })
  .then(response => {
    if (response.status === 204) {
      // Suppression réussie, mettre à jour la galerie principale
      imageIdsSet.delete(imageId); // Supprimer l'ID de l'image de l'ensemble
      galleryContainer.removeChild(imageContainer); // Supprimer le conteneur de l'image du DOM

      // Mettre à jour la galerie principale après la suppression
      imageDisplay();
    } else {
      throw new Error("Impossible de supprimer l'image");
    }
  })
  .catch(error => {
    console.error(error);
  });
}
// fonction pour supprimer l'image de la modale
function deletePhotoFromModal(imageId) {
  const imageContainer = document.querySelector(`.image-container[data-id="${imageId}"]`);
  if (imageContainer) {
    galleryContainer.removeChild(imageContainer); // Supprimer le conteneur de l'image du DOM
    imageIdsSet.delete(imageId); // Supprimer l'ID de l'image de l'ensemble
  }
}
function deletePhotoFromModal(imageId) {
  // Récupérer les informations d'identification de l'utilisateur authentifié
  const authToken = localStorage.getItem('token');

  // Vérifier si l'utilisateur est authentifié
  if (!authToken) {
    console.error('Utilisateur non authentifié');
    return;
  }

  // Configurer les en-têtes de la requête avec les informations d'identification
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`,
  };

  // Envoyer une requête HTTP DELETE pour supprimer l'image avec les en-têtes personnalisés
  fetch(`http://localhost:5678/api/works/${imageId}`, {
    method: 'DELETE',
    headers: headers,
  })
  .then(response => {
    if (response.status === 204) {
      // Suppression réussie, mettre à jour la galerie principale
      imageIdsSet.delete(imageId); // Supprimer l'ID de l'image de l'ensemble

      // Notez que vous devez également supprimer l'image de la galerie principale si elle est affichée
      const imageContainer = document.querySelector(`.image-container[data-id="${imageId}"]`);
      if (imageContainer) {
        galleryContainer.removeChild(imageContainer); // Supprimer le conteneur de l'image du DOM
      }
    } else {
      throw new Error("Impossible de supprimer l'image");
    }
  })
  .catch(error => {
    console.error(error);
  });
}


function fetchGallery() {
  // Fonction pour récupérer les images de la galerie à partir du serveur
  fetch('http://localhost:5678/api/works')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Impossible de récupérer les images de la galerie');
      }
    })
    .then(data => {
      displayGallery(data);// Appeler la fonction displayGallery() pour afficher les images de la galerie à partir des données JSON
    })
    .catch(error => {
      console.error(error);
    });
}
let photoAddedListenerActive = false;

// Fonction pour gérer l'événement "photoAdded"
function handlePhotoAdded(event) {
  const photo = event.detail;
  addPhotoToGallery(photo, imageDisplay);
}

// Ajout écouteur d'événement "photoAdded"
document.addEventListener('photoAdded', handlePhotoAdded);

function openModal() {
  modalContainer.classList.add('active');
  fetchGallery();

  // Vérifier si l'écouteur d'événement est déjà actif avant de l'ajouter
  if (!photoAddedListenerActive) {
    photoAddedListenerActive = true;
  }
}

function closeModalFunc() {
  modalContainer.classList.remove('active');
  galleryContainer.innerHTML = '';
  photoAddedListenerActive = false; // Désactiver l'écouteur d'événement photoAdded
}

modalBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalFunc);
overlay.addEventListener('click', closeModalFunc);

const btnAddPhoto = document.querySelector('#btn-add-photo');

btnAddPhoto.addEventListener('click', function() {
  const modalAddPhoto = document.querySelector('.modal-add-photo');
  modalAddPhoto.classList.add('active');
});
// Ajouter une photo à la galerie d'images affichée sur la page
function addPhotoToGallery(photo, callback) {
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container');

  const imageElement = document.createElement('img');
  imageElement.src = photo.imageUrl;
  imageElement.alt = photo.title;
  imageElement.classList.add('gallery-item');

  const deleteIconContainer = document.createElement('div');
  deleteIconContainer.classList.add('delete-icon');

  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('fa-regular', 'fa-trash-can');

  deleteIcon.addEventListener('click', () => {
    deleteImage(photo.id, imageContainer); // Appeler une fonction pour supprimer l'image
  });

  deleteIconContainer.appendChild(deleteIcon);

  const editText = document.createElement('span');
  editText.textContent = 'Éditer';
  editText.classList.add('edit-text');

  imageContainer.appendChild(imageElement);
  imageContainer.appendChild(deleteIconContainer);
  imageContainer.appendChild(editText);

  galleryContainer.appendChild(imageContainer);
  imageIdsSet.add(photo.id); // Ajouter l'ID de l'image à l'ensemble

  // Code pour faire apparaître l'icône en survol de chaque image individuellement
  const iconContainer = document.createElement('div');
  iconContainer.classList.add('icon-container');
  const upDownLeftRightIcon = document.createElement('i');
  upDownLeftRightIcon.classList.add('fa', 'fa-up-down-left-right', 'custom-icon');
  iconContainer.appendChild(upDownLeftRightIcon);

  imageContainer.appendChild(iconContainer);

  // Ajouter une classe pour cacher initialement l'icône
  iconContainer.classList.add('hidden');

  imageContainer.addEventListener('mouseover', () => {
    iconContainer.classList.remove('hidden'); // Retirer la classe "hidden" lors du survol
  });

  imageContainer.addEventListener('mouseout', () => {
    iconContainer.classList.add('hidden'); // Ajouter la classe "hidden" lorsque la souris quitte
  });

  // Appeler le rappel pour mettre à jour la galerie principale
  if (typeof callback === 'function') {
    callback();
  }
}
function deletePhotoFromModal(imageId) {
  const imageContainer = document.querySelector(`.image-container[data-id="${imageId}"]`);
  if (imageContainer) {
    galleryContainer.removeChild(imageContainer); // Supprimer le conteneur de l'image du DOM
    imageIdsSet.delete(imageId); // Supprimer l'ID de l'image de l'ensemble
  }
}



