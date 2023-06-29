
const modalContainer = document.querySelector('.modal-container');
const overlay = document.querySelector('.overlay');
const closeModal = document.querySelector('.close-modal');
const modalTrigger = document.querySelectorAll('.modal-trigger');

// Fonction pour ouvrir la modal
function openModal() {
  modalContainer.classList.add('show');
}

// Fonction pour fermer la modal
function closeModalFunc() {
  modalContainer.classList.remove('show');
}

// Ajouter les écouteurs d'événements pour ouvrir/fermer la modal
modalTrigger.forEach(function(element) {
  element.addEventListener('click', openModal);
});

closeModal.addEventListener('click', closeModalFunc);
overlay.addEventListener('click', closeModalFunc);

