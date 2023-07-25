document.addEventListener('DOMContentLoaded', () => {
  const closeModale = document.getElementById('close-modale')
  const addPhotoButton = document.getElementById('add-photo-button')
  const addPhotoTitleInput = document.getElementById('add-photo-title')
  const addPhotoCategoryInput = document.getElementById('add-photo-category')
  const fileInput = document.getElementById('file')
  const previewImg = document.getElementById('previewImg')
  const modalAddPhoto = document.querySelector('.modal-add-photo')
  const galleryContainer = document.getElementById('gallery')

  function addPhotoToModal (photo) {
    const imageContainer = document.createElement('div')
    imageContainer.classList.add('image-container')
    imageContainer.dataset.id = photo.id // Ajouter un attribut data-id avec l'ID de la photo

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
  }

  async function addPhoto () {
    const photoTitle = addPhotoTitleInput.value
    const photoCategory = addPhotoCategoryInput.value
    const photoFile = fileInput.files[0]

    const formData = new FormData()
    formData.append('title', photoTitle)
    formData.append('category', photoCategory)
    formData.append('image', photoFile)

    try {
      const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      if (response.ok) {
        const newPhoto = await response.json()

        // Cacher les éléments d'ajout de photo
        const addBtnLabel = document.getElementById('addBtnLabel')
        const addStyleParagraph = document.getElementById('addStyleParagraph')
        addBtnLabel.classList.add('hidden')
        addStyleParagraph.classList.add('hidden')

        // Ajouter la nouvelle photo à la galerie modale
        addPhotoToModal(newPhoto)

        // Déclencher l'événement personnalisé "photoAdded" avec les détails de la nouvelle photo
        const event = new CustomEvent('photoAdded', { detail: newPhoto })
        document.dispatchEvent(event)

        // Vider les champs de la modale et fermer la modale
        addPhotoTitleInput.value = ''
        addPhotoCategoryInput.value = ''
        fileInput.value = ''
        previewImg.style.visibility = 'hidden'
        previewImg.src = '#'
        closeModaleFunc()

        // Mettre à jour la galerie principale
        imageDisplay()
      } else {
        throw new Error("Impossible d'ajouter la photo")
      }
    } catch (error) {
      console.error(error)
    }
  }

  addPhotoButton.addEventListener('click', async event => {
    event.preventDefault()
    addPhoto()
  })

  // Ajoutez un événement au bouton de retour pour revenir à la galerie modale
  const backButton = document.querySelector('.return-arrow')
  if (backButton) {
    backButton.addEventListener('click', () => {
      closeModaleFunc() // Fermez simplement la modale d'ajout de photo
    })
  }

  function closeModaleFunc () {
    modalAddPhoto.classList.remove('active')
    fileInput.value = '' // Réinitialiser le champ de téléchargement
    previewImg.style.display = 'none'
  }

  closeModale.addEventListener('click', closeModaleFunc)
  overlay.addEventListener('click', closeModaleFunc)

  fileInput.addEventListener('change', handleFileInputChange)

  function handleFileInputChange () {
    const file = fileInput.files[0]

    previewImg.style.visibility = 'visible'
    const imageUrl = URL.createObjectURL(file)
    previewImg.src = imageUrl

    if (file.size > 4 * 1024 * 1024) {
      alert('La taille de la photo est trop importante (limite : 4 Mo).')
      fileInput.value = '' // Réinitialiser le champ de téléchargement
      previewImg.style.display = 'none'
      addPhotoButton.disabled = true
      return
    }

    addPhotoButton.disabled = false
  }

  // Récupérer la référence du menu déroulant des catégories
  const categorySelect = document.querySelector('#add-photo-category')

  // Fonction pour générer les options du menu déroulant des catégories
  function generateCategoryOptions (categories) {
    categories.forEach(category => {
      const option = document.createElement('option')
      option.value = category.id
      option.textContent = category.name
      categorySelect.appendChild(option)
    })
  }

  async function fetchCategoriesPhoto () {
    try {
      const response = await fetch('http://localhost:5678/api/categories', {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const categories = await response.json()
        generateCategoryOptions(categories) // Appel de la fonction pour générer les options
        addPhotoTitleInput.addEventListener('input', checkFields)
        addPhotoCategoryInput.addEventListener('change', checkFields)
      } else {
        throw new Error('Échec de la récupération des catégories')
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // Appel de la fonction pour récupérer les catégories et générer les options
  fetchCategoriesPhoto()

  let isPhotoFilled = false
  let isTitleFilled = false
  let isCategoryFilled = false
  let isCategoryChanged = false

  // Fonction pour vérifier si le champ de la catégorie est rempli manuellement
  function checkCategoryChange () {
    isCategoryChanged = true
    checkFields()
  }

  function checkFields () {
    const photoFile = fileInput.files[0]
    const title = addPhotoTitleInput.value.trim()
    const category = addPhotoCategoryInput.value
    isPhotoFilled = photoFile ? true : false
    isTitleFilled = title !== '' ? true : false
    isCategoryFilled = isCategoryChanged && category !== '' ? true : false
    const isFieldsFilled = isPhotoFilled && isTitleFilled && isCategoryFilled
    if (isFieldsFilled) {
      addPhotoButton.classList.add('valid-btn') // Ajouter la classe pour rendre le bouton vert
    } else {
      addPhotoButton.classList.remove('valid-btn') // Supprimer la classe pour revenir à la couleur par défaut
    }
  }

  // Écoutez les événements input sur le champ du titre
  addPhotoTitleInput.addEventListener('input', checkFields)

  // Écoutez les événements change sur le champ de la catégorie
  addPhotoCategoryInput.addEventListener('change', checkCategoryChange)

  // Écoutez les événements change sur le champ de la photo
  fileInput.addEventListener('change', checkFields)
})
