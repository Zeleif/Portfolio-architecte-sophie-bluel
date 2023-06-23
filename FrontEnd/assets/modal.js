const modalContainer = document.querySelector('.modal-container');
const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.close-modal');
const modalFooter = document.querySelector('.modal-footer');
const modalText = document.querySelector('.modal-text');
const modalBtn = document.querySelector('.modal-btn');
const modalHeader = document.getElementById('modal__header');
const galleryContainer = document.querySelector('.gallery-container');

function displayGallery(images) {
    galleryContainer.innerHTML = '';
  
    images.forEach(image => {
      const imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');
  
      const imageElement = document.createElement('img');
      imageElement.src = image.imageUrl;
      imageElement.alt = image.title;
      imageElement.classList.add('gallery-item');
  
      const deleteIconContainer = document.createElement('div');
      deleteIconContainer.classList.add('delete-icon');
  
      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fa-solid', 'fa-trash-can');
  
      deleteIconContainer.appendChild(deleteIcon);
  
      const editText = document.createElement('span');
      editText.textContent = 'Éditer';
      editText.classList.add('edit-text');
  
      imageContainer.appendChild(imageElement);
      imageContainer.appendChild(deleteIconContainer);
      imageContainer.appendChild(editText);
  
      galleryContainer.appendChild(imageContainer);
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
