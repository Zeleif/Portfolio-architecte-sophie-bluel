const closeModalButton = document.querySelector('.close-modal')

function closeModalAddPhoto() {
  const modalAddPhoto = document.querySelector('.modal-add-photo')
  modalAddPhoto.style.display = 'none'
}

// Événement pour le bouton "close" dans modalAddPhoto
const closeModalAddPhotoButton = document.querySelector(
  '.modal-add-photo .close-modal'
)
closeModalAddPhotoButton.addEventListener('click', closeModalAddPhoto)

// Fonction pour revenir à la modalGallery
function returnToGallery() {
  const modalAddPhoto = document.querySelector('.modal-add-photo')
  const modalGallery = document.querySelector('.modal')
  modalAddPhoto.style.display = 'none'
  modalGallery.style.display = 'flex'
}

// Événement pour la flèche gauche dans modalAddPhoto
const returnArrowButton = document.querySelector(
  '.modal-container.modal-add-photo .return-arrow'
)
returnArrowButton.addEventListener('click', returnToGallery)

const fileInput = document.querySelector('#file')
const previewImg = document.querySelector('.preview-img')
const addPhotoButton = document.querySelector('.addBtn-photo')
const addStyle = document.querySelector('.add-style')

fileInput.addEventListener('change', function () {
  previewImg.style.visibility = 'visible'
  const file = fileInput.files[0]
  const imageUrl = URL.createObjectURL(file)
  previewImg.src = imageUrl
})

// Fonction pour vérifier si l'utilisateur est authentifié avant d'ajouter l'image
async function addImageIfAuthenticated(imageData) {
  const authToken = localStorage.getItem('token')

  if (authToken) {
    try {
      const formData = new FormData()
      formData.append('image', imageData)

      const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      })

      if (response.ok) {
        const addedProject = await response.json()
        console.log('Image ajoutée avec succès')
        return addedProject
      } else {
        throw new Error("Échec de l'ajout de l'image")
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  } else {
    throw new Error('Utilisateur non authentifié')
  }
}

function addPhotoToGallery(photo) {
  const galleryContainer = document.querySelector('.gallery-container')

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

  const figcaption = document.createElement('figcaption')
  figcaption.textContent = photo.title

  imageContainer.appendChild(imageElement)
  imageContainer.appendChild(deleteIconContainer)
  imageContainer.appendChild(editText)
  imageContainer.appendChild(figcaption)

  galleryContainer.appendChild(imageContainer)
}

const validateUploadButton = document.querySelector('#add-photo-button')

validateUploadButton.addEventListener('click', async function () {
  try {
    const titleInput = document.querySelector('#add-photo-title')
    const categorySelect = document.querySelector('#add-photo-category')
    const fileInput = document.querySelector('#file')

    if (
      titleInput.value === '' ||
      categorySelect.value === '' ||
      fileInput.files.length === 0
    ) {
      // Utilisation d'un autre sélecteur pour l'effet de secousse
      validateUploadButton.classList.add('shake')
      setTimeout(() => {
        validateUploadButton.classList.remove('shake')
      }, 500)
    } else {
      const file = fileInput.files[0]
      const blob = new Blob([file], { type: file.type })
      try {
        const addedProject = await addImageIfAuthenticated(blob)
        console.log('Projet ajouté :', addedProject)

        // Réinitialiser les champs du formulaire
        titleInput.value = ''
        categorySelect.value = ''
        fileInput.value = ''
        previewImg.style.visibility = 'hidden'

        // Masquer la modalAddPhoto
        const modalAddPhoto = document.querySelector('.modal-add-photo')
        modalAddPhoto.style.display = 'none'

        // Ajouter la photo à la galerie
        addPhotoToGallery(addedProject)
      } catch (error) {
        console.error(error)
      }
    }
  } catch (error) {
    console.error(error)
  }
})

// Récupérer la référence du menu déroulant des catégories
const categorySelect = document.querySelector('#add-photo-category')

// Fonction pour générer les options du menu déroulant des catégories
function generateCategoryOptions(categories) {
  categories.forEach(category => {
    const option = document.createElement('option')
    option.value = category.id
    option.textContent = category.name
    categorySelect.appendChild(option)
  })
}

async function fetchCategoriesphoto() {
  try {
    const response = await fetch('http://localhost:5678/api/categories', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (response.ok) {
      const categories = await response.json()
      return categories
    } else {
      throw new Error('Échec de la récupération des catégories')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// Appel de la fonction pour récupérer les catégories et générer les options
fetchCategoriesphoto()
  .then(categories => {
    generateCategoryOptions(categories)
  })
  .catch(error => {
    console.error(error)
  })

