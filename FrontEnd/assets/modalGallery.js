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
        // Suppression réussie, mettre à jour la galerie
        imageIdsSet.delete(imageId); // Supprimer l'ID de l'image de l'ensemble
        galleryContainer.removeChild(imageContainer); // Supprimer le conteneur de l'image du DOM
      } else {
        throw new Error("Impossible de supprimer l'image");
      }
    })
    .catch(error => {
      console.error(error);
    });
}


function fetchGallery() {
  fetch('http://localhost:5678/api/works')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Impossible de récupérer les images de la galerie");
      }
    })
    .then(data => {
      displayGallery(data);
    })
    .catch(error => {
      console.error(error);
    });
}

function openModal() {
  modalContainer.classList.add('active');
  fetchGallery();
}

function closeModalFunc() {
  modalContainer.classList.remove('active');
  galleryContainer.innerHTML = '';
}

modalBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalFunc);
overlay.addEventListener('click', closeModalFunc);

// Sélection du bouton "Ajouter une photo"
const btnAddPhoto = document.querySelector('#btn-add-photo');

// Ajout d'un gestionnaire d'événements au clic sur le bouton
btnAddPhoto.addEventListener('click', function() {
  // Afficher la deuxième modale
  const modalAddPhoto = document.querySelector('.modal-add-photo');
  modalAddPhoto.classList.add('active');
});

function addPhotoToGallery(photo) {
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
}

