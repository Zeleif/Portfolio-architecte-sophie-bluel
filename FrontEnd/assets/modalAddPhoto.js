document.addEventListener('DOMContentLoaded', () => {
  // Récupérer les éléments du DOM et les stocker dans des variables
  const closeModale = document.getElementById('close-modale')
  const addPhotoButton = document.getElementById('add-photo-button')
  const addPhotoTitleInput = document.getElementById('add-photo-title')
  const addPhotoCategoryInput = document.getElementById('add-photo-category')
  const fileInput = document.getElementById('file')
  const previewImg = document.getElementById('previewImg')
  const modalAddPhoto = document.querySelector('.modal-add-photo')
  const galleryContainer = document.getElementById('gallery')

  // Au chargement de la page, vérifiez s'il y a des informations de photo stockées localement
  const storedPhoto = localStorage.getItem('newPhoto')
  if (storedPhoto) {
    const parsedPhoto = JSON.parse(storedPhoto)
    addPhotoToModal(parsedPhoto)
    localStorage.removeItem('newPhoto') // Supprimez les données après utilisation
  }

  // Fonction pour ajouter une nouvelle photo à la galerie modale
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
  // Fonction pour effectuer l'ajout de la photo en soumettant le formulaire
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
        localStorage.setItem('newPhoto', JSON.stringify(newPhoto)) // Stockez les informations de la nouvelle photo

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
  // Attacher le gestionnaire d'événements au clic du bouton "Valider" pour appeler la fonction addPhoto
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
  // Fonction pour fermer la modale d'ajout de photo
  function closeModaleFunc () {
    modalAddPhoto.classList.remove('active')
    fileInput.value = '' // Réinitialiser le champ de téléchargement
    previewImg.style.display = 'none'
  }
  // Attacher les gestionnaires d'événements pour fermer la modale lorsque l'utilisateur clique sur les éléments de fermeture
  closeModale.addEventListener('click', closeModaleFunc)
  overlay.addEventListener('click', closeModaleFunc)
  // Gestionnaire d'événements pour le champ de fichier pour effectuer des vérifications lorsqu'un fichier est sélectionné
  fileInput.addEventListener('change', handleFileInputChange)

  // Fonction pour vérifier si l'extension du fichier est autorisée
  function isFileAllowed (fileName) {
    const allowedExtensions = ['png', 'jpeg', 'jpg']
    const fileExtension = fileName.split('.').pop().toLowerCase()
    return allowedExtensions.includes(fileExtension)
  }
  // Fonction pour gérer le clic sur le bouton "Valider"
  function handleAddPhoto () {
    const title = document.getElementById('add-photo-title').value.trim()
    const category = document.getElementById('add-photo-category').value.trim()
    const fileInput = document.getElementById('file')

    // Vérifier si le titre et/ou la catégorie sont vides
    if (!title || !category) {
      alert('Veuillez remplir le titre et la catégorie avant de valider.')
      return
    }
    // Vérifier si un fichier a été sélectionné
    if (fileInput.files.length === 0) {
      alert('Veuillez sélectionner une photo.')
      return
    }
    // Vérifier si le fichier est autorisé
    if (!isFileAllowed(fileInput.files[0].name)) {
      alert(
        "Erreur : le fichier sélectionné n'est pas autorisé. Seuls les fichiers PNG et JPEG sont autorisés."
      )
      return
    }
  }
  // Attacher le gestionnaire d'événements au clic du bouton "Valider"
  addPhotoButton.addEventListener('click', handleAddPhoto)

  let fileSelected = false;
  let currentImageUrl = '';
  let previousImageUrl = '';
  
  function updateAddPhotoButton() {
    const title = document.getElementById('add-photo-title').value.trim();
    const category = document.getElementById('add-photo-category').value.trim();
  
    const isFieldsFilled =
      (fileSelected || currentImageUrl !== '' || previousImageUrl !== '') &&
      title !== '' &&
      category !== '';
    addPhotoButton.disabled = !isFieldsFilled;
    if (isFieldsFilled) {
      addBtnLabel.style.opacity = '0';
      addPhotoButton.classList.add('valid-btn');
    } else {
      addPhotoButton.classList.remove('valid-btn');
    }
  }
  // fonction pour gérer l'ajout de photo dans la preview
  function handleFileInputChange () {
    const file = fileInput.files[0]
  
    if (file) {
      currentImageUrl = URL.createObjectURL(file);
      previewImg.style.visibility = 'visible';
      previewImg.src = currentImageUrl;
      fileSelected = true;
  
      if (file.size > 4 * 1024 * 1024) {
        alert('La taille de la photo est trop importante (limite : 4 Mo).');
        return;
      }
  
      if (!isFileAllowed(file.name)) {
        alert(
          "Erreur : le fichier sélectionné n'est pas autorisé. Seuls les fichiers PNG et JPEG sont autorisés."
        );
        return;
      }
  
      addBtnLabel.style.opacity = '0';
    } else {
      // Réinitialiser la preview et faire réapparaître le addBtnLabel
      currentImageUrl = '';
      previewImg.style.visibility = 'hidden';
      addBtnLabel.style.opacity = '1';
      fileSelected = false;
    }
  
    updateAddPhotoButton();
  } 
  
  // Nouvelle gestion du clic sur l'image
previewImg.addEventListener('click', () => {
  // Cliquez sur le champ de fichier pour ouvrir à nouveau la boîte de dialogue de sélection de fichiers
  fileInput.click();
});
     
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
  // Fonction pour récupérer les catégories de photos depuis le serveur et générer les options du menu déroulant de catégories
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
  // Fonction pour vérifier si tous les champs du formulaire sont remplis pour activer le bouton "Valider"
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
