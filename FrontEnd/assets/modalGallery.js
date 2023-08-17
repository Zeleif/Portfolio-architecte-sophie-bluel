// Fonction pour gérer l'affichage du contenu en fonction de la connexion de l'utilisateur
function toggleContentAuthentication() {
  const modalHeader = document.getElementById('modal__header');

  // Vérifier si l'utilisateur est authentifié
  const authToken = localStorage.getItem('token');
  if (authToken) {
    // Afficher l'élément modal__header
    if (modalHeader) {
      modalHeader.style.display = 'block';
    }
  } else {
    // Cacher l'élément modal__header
    if (modalHeader) {
      modalHeader.style.display = 'none';
    }
  }
}
document.addEventListener('DOMContentLoaded', () => {
  toggleContentAuthentication();
  fetchGallery();
  imageDisplay();
});


function fetchImages () {
  // Fonction pour effectuer une requête GET au serveur pour récupérer les images
  return new Promise((resolve, reject) => {
    fetch('http://localhost:5678/api/works', {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          resolve(response.json()) // Résoudre la promesse avec les données JSON renvoyées par le serveur
        } else {
          reject(new Error('Impossible de contacter le serveur')) // Rejeter la promesse en cas d'erreur de requête
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}

const imageDisplay = async () => {
  // Fonction asynchrone pour afficher les images
  try {
    const images = await fetchImages() // Récupérer les images à partir du serveur en utilisant await
    const galleryDiv = document.querySelector('.gallery')

    galleryDiv.innerHTML = '' // Réinitialiser la galerie principale

    images.forEach(imageData => {
      const figure = document.createElement('article')
      const img = document.createElement('img')
      img.src = imageData.imageUrl
      img.alt = '#'
      img.dataset.categoryId = imageData.categoryId // Ajout de l'attribut data-category-id
      figure.appendChild(img)
      const figcaption = document.createElement('figcaption')
      figcaption.textContent = imageData.title
      figure.appendChild(figcaption)
      galleryDiv.appendChild(figure)
    })
  } catch (error) {
    console.error(error)
  }
}

const showImagesByCategory = categoryId => {
  // Fonction pour filtrer et afficher les images en fonction de leur catégorie
  const images = document.querySelectorAll('.gallery img')
  images.forEach(img => {
    const figure = img.parentElement
    if (categoryId === 'all' || img.dataset.categoryId === categoryId) {
      figure.style.display = 'block' // Afficher l'image et son conteneur
    } else {
      figure.style.display = 'none' // Masquer l'image et son conteneur
    }
  })
}
imageDisplay()

const modalContainer = document.querySelector('.modal-container')
const overlay = document.querySelector('.overlay')
const modal = document.querySelector('.modal')
const closeModal = document.querySelector('.close-modal')
const modalFooter = document.querySelector('.modal-footer')
const modalText = document.querySelector('.modal-text')
const modalBtn = document.querySelector('#open-bouton')
const modalHeader = document.getElementById('modal__header')
const galleryContainer = document.querySelector('.gallery-container')

const imageIdsSet = new Set()

function displayGallery(images) {
  // Effacer le contenu actuel de la modale avant d'ajouter les images
  galleryContainer.innerHTML = '';
  images.forEach((image, i) => {
    const imageContainer = document.createElement('div')
    imageContainer.classList.add('image-container')

    const imageElement = document.createElement('img')
    imageElement.src = image.imageUrl
    imageElement.alt = image.title
    imageElement.classList.add('gallery-item')

    const deleteIconContainer = document.createElement('div')
    deleteIconContainer.classList.add('delete-icon')

    const deleteIcon = document.createElement('i')
    deleteIcon.classList.add('fa-regular', 'fa-trash-can')

    deleteIcon.addEventListener('click', () => {
      deleteImage(image.id, imageContainer) // Appeler une fonction pour supprimer l'image
    })

    deleteIconContainer.appendChild(deleteIcon)

    const editText = document.createElement('span')
    editText.textContent = 'Éditer'
    editText.classList.add('edit-text')

    imageContainer.appendChild(imageElement)
    imageContainer.appendChild(deleteIconContainer)
    imageContainer.appendChild(editText)

    galleryContainer.appendChild(imageContainer)

    imageIdsSet.add(image.id) // Ajouter l'ID de l'image à l'ensemble

    // Code pour faire apparaître l'icône en survol de chaque image individuellement
    const iconContainer = document.createElement('div')
    iconContainer.classList.add('icon-container')
    const upDownLeftRightIcon = document.createElement('i')
    upDownLeftRightIcon.classList.add(
      'fa',
      'fa-up-down-left-right',
      'custom-icon'
    )
    iconContainer.appendChild(upDownLeftRightIcon)

    imageContainer.appendChild(iconContainer)

    // Ajouter une classe pour cacher initialement l'icône
    iconContainer.classList.add('hidden')

    imageContainer.addEventListener('mouseover', () => {
      iconContainer.classList.remove('hidden') // Retirer la classe "hidden" lors du survol
    })

    imageContainer.addEventListener('mouseout', () => {
      iconContainer.classList.add('hidden') // Ajouter la classe "hidden" lorsque la souris quitte
    })
  })
}

// Fonction générique pour supprimer une image
function deleteImage(imageId) {
  const authToken = localStorage.getItem('token');

  if (!authToken) {
    console.error('Utilisateur non authentifié');
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`,
  };

  fetch(`http://localhost:5678/api/works/${imageId}`, {
    method: 'DELETE',
    headers: headers,
  })
  .then(response => {
    if (response.status === 204) {
      console.log(response.status);
      imageIdsSet.delete(imageId);
      
      // Supprimer le conteneur de l'image du DOM
      const imageContainer = document.querySelector(`.image-container[data-id="${imageId}"]`);
      if (imageContainer) {
        imageContainer.parentNode.removeChild(imageContainer);
      }
      
      // Mettre à jour l'affichage
      imageDisplay();
      fetchGallery();
    } else {
      throw new Error("Impossible de supprimer l'image");
    }
  })
  .catch(error => {
    console.error(error);
  });
}

// Fonction pour supprimer une image de la galerie principale
function deleteImageFromGallery (imageId) {
  deleteImage(imageId)
}

// Fonction pour supprimer une image de la modale
function deleteImageFromModal (imageId) {
  deleteImage(imageId)
}

function fetchGallery() {
  fetch('http://localhost:5678/api/works')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Impossible de récupérer les images de la galerie');
      }
    })
    .then(data => {
      const deletedImageIds = JSON.parse(localStorage.getItem('deletedImageIds')) || [];

      // Exclure les images supprimées pour l'affichage dans la modale
      const filteredGallery = data.filter(image => !deletedImageIds.includes(image.id));

      displayGallery(filteredGallery);
    })
    .catch(error => {
      console.error(error);
    });
}
let photoAddedListenerActive = false;

// Fonction pour gérer l'événement "photoAdded"
function handlePhotoAdded(event) {
  const photo = event.detail;
  addPhotoToGallery(photo);
}

// Ajout écouteur d'événement "photoAdded"
document.addEventListener('photoAdded', handlePhotoAdded)

function openModal () {
  modalContainer.classList.add('active')
  fetchGallery()

  // Vérifier si l'écouteur d'événement est déjà actif avant de l'ajouter
  if (!photoAddedListenerActive) {
    photoAddedListenerActive = true
  }
}

function closeModalFunc () {
  modalContainer.classList.remove('active')
  galleryContainer.innerHTML = ''
  photoAddedListenerActive = false // Désactiver l'écouteur d'événement photoAdded
}

modalBtn.addEventListener('click', openModal)
closeModal.addEventListener('click', closeModalFunc)
overlay.addEventListener('click', closeModalFunc)

const btnAddPhoto = document.querySelector('#btn-add-photo')

btnAddPhoto.addEventListener('click', function () {
  const modalAddPhoto = document.querySelector('.modal-add-photo')
  modalAddPhoto.classList.add('active')
})
// Ajouter une photo à la galerie d'images affichée sur la page
function addPhotoToGallery (photo) {
  const imageContainer = document.createElement('div')
  imageContainer.classList.add('image-container')

  const imageElement = document.createElement('img')
  imageElement.src = photo.imageUrl
  imageElement.alt = photo.title
  imageElement.classList.add('gallery-item')

  const deleteIconContainer = document.createElement('div')
  deleteIconContainer.classList.add('delete-icon')

  const deleteIcon = document.createElement('i')
  deleteIcon.classList.add('fa-regular', 'fa-trash-can')

  deleteIcon.addEventListener('click', () => {
    deleteImage(photo.id, imageContainer) // Appeler une fonction pour supprimer l'image
  })

  deleteIconContainer.appendChild(deleteIcon)

  const editText = document.createElement('span')
  editText.textContent = 'Éditer'
  editText.classList.add('edit-text')

  imageContainer.appendChild(imageElement)
  imageContainer.appendChild(deleteIconContainer)
  imageContainer.appendChild(editText)

  galleryContainer.appendChild(imageContainer)
  imageIdsSet.add(photo.id) // Ajouter l'ID de l'image à l'ensemble

  // Code pour faire apparaître l'icône en survol de chaque image individuellement
  const iconContainer = document.createElement('div')
  iconContainer.classList.add('icon-container')
  const upDownLeftRightIcon = document.createElement('i')
  upDownLeftRightIcon.classList.add(
    'fa',
    'fa-up-down-left-right',
    'custom-icon'
  )
  iconContainer.appendChild(upDownLeftRightIcon)

  imageContainer.appendChild(iconContainer)

  // Ajouter une classe pour cacher initialement l'icône
  iconContainer.classList.add('hidden')

  imageContainer.addEventListener('mouseover', () => {
    iconContainer.classList.remove('hidden') // Retirer la classe "hidden" lors du survol
  })

  imageContainer.addEventListener('mouseout', () => {
    iconContainer.classList.add('hidden') // Ajouter la classe "hidden" lorsque la souris quitte
  })
}
// Fonction pour supprimer une photo de la modale
function deletePhotoFromModal(imageId) {
  const imageContainer = document.querySelector(
    `.image-container[data-id="${imageId}"]`
  );
  if (imageContainer) {
    galleryContainer.removeChild(imageContainer);
    imageIdsSet.delete(imageId);
  }
}
