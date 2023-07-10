const galleryContainerModal = document.querySelector('.gallery-container');
const fileInput = document.getElementById('file');
const previewImg = document.getElementById('previewImg');
const addPhotoButton = document.querySelector('.addBtn-photo');
const closeModalButtons = document.querySelectorAll('#close-modale');
const returnArrowButton = document.querySelector('.return-arrow');

fileInput.addEventListener('change', handleFileInputChange);

function handleFileInputChange() {
  const file = fileInput.files[0];

  previewImg.style.visibility = 'visible';
  const imageUrl = URL.createObjectURL(file);
  previewImg.src = imageUrl;

  const reader = new FileReader();
  reader.onload = handleFileLoad;
  reader.readAsArrayBuffer(file);

  if (file.size > 4 * 1024 * 1024) {
    alert('La taille de la photo est trop importante (limite : 4 Mo).');
    ajoutPhotoBouton.value = '';
    previewImg.style.display = 'none';
    addPhotoButton.disabled = true;
    return;
  }
}
function handleFileLoad() {
  const formData = new FormData();
  const image = fileInput.files[0];
  const title = document.getElementById('add-photo-title').value;
  const category = document.getElementById('add-photo-category').value;

  formData.append('image', image);
  formData.append('title', title);
  formData.append('category', category);

  const token = localStorage.getItem('token');

  fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then(handleImageUploadResponse)
    .then(data => {
      console.log('Image ajoutée avec succès:', data);
      // Ajouter la nouvelle photo à la galerie
     
      addPhotoToGallery(data, galleryContainerModal); // Utilisez la variable correcte pour le conteneur de la galerie
      closeModale(); // Fermer la modale
    })
    .catch(error => {
      console.error(error);
    });
}

function handleImageUploadResponse(response) {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Erreur lors de l'ajout de l'image");
  }
}

function addPhotoToGallery(photo, galleryContainer) {
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container');

  // Créer un nouvel élément img
  const imageElement = document.createElement('img');

  // Définir l'URL de l'image en utilisant l'attribut data-image-url
  const imageUrl = photo.imageUrl; // Utilisez l'URL de l'image fournie par la réponse de l'API
  imageElement.setAttribute('data-image-url', imageUrl);

  // Ajouter d'autres attributs et propriétés de l'image si nécessaire
  imageElement.alt = 'Image';
  imageElement.classList.add('gallery-item');

  // Ajouter l'image au conteneur de la galerie
  galleryContainer.appendChild(imageElement);

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
}

function closeModale() {
  const modalAddPhoto = document.querySelector('.modal-add-photo');
  modalAddPhoto.classList.remove('active');
}

closeModalButtons.forEach(button => {
  button.addEventListener('click', closeModale);
});

returnArrowButton.addEventListener('click', () => {
  const modalGallery = document.querySelector('.modal-container');
  const modalAddPhoto = document.querySelector('.modal-add-photo');

  modalGallery.classList.add('active');
  modalAddPhoto.classList.remove('active');
});

// Récupérer la référence du menu déroulant des catégories
const categorySelect = document.querySelector('#add-photo-category');

// Fonction pour générer les options du menu déroulant des catégories
function generateCategoryOptions(categories) {
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

async function fetchCategoriesPhoto() {
  try {
    const response = await fetch('http://localhost:5678/api/categories', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      const categories = await response.json();
      generateCategoryOptions(categories); // Appel de la fonction pour générer les options
    } else {
      throw new Error('Échec de la récupération des catégories');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Appel de la fonction pour récupérer les catégories et générer les options
fetchCategoriesPhoto();

