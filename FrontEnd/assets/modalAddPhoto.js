const fileInput = document.querySelector('#file');
const previewImgContainer = document.querySelector(".preview-img-container");
const previewImg = document.querySelector(".preview-img");
const addPhotoButton = document.querySelector('.addBtn-photo');


fileInput.addEventListener('change', function(event) {
  previewImgContainer.style.visibility = "visible";
  previewImg.style.visibility = "visible";
  const file = fileInput.files[0];
  const imageUrl = URL.createObjectURL(file);
  previewImg.src = imageUrl;
  console.log(imageUrl);
});

// Ajoutez le nouvel écouteur d'événement "click" sur addPhotoButton
addPhotoButton.addEventListener('click', async function(event) {
  event.preventDefault();
  try {
    const imageUrl = await loadImageFromApi(); // Appel de la fonction pour charger l'image depuis l'API
    previewImgContainer.style.visibility = "visible";
    previewImg.style.visibility = "visible";
    previewImg.src = imageUrl;
    console.log(imageUrl);
  } catch (error) {
    console.error(error);
  }
});

// Ajout de la fonction loadImageFromApi
async function loadImageFromApi() {
  try {
    const response = await fetch(`http://localhost:5678/api/works`, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      const imageUrl = await response.text();
      return imageUrl;
    } else {
      throw new Error("Échec du chargement de l'image depuis l'API");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function addProjectToApi(project) {
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(project),
    });

    if (response.ok) {
      // Projet ajouté avec succès dans l'API
      const newProject = await response.json();
      return newProject;
    } else {
      throw new Error("Échec de l'ajout du projet");
    }
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

const validateUpload = document.querySelector('#add-photo-button');
validateUpload.addEventListener("click", async function() {
  const titleInput = document.querySelector('#add-photo-title');
  const categorySelect = document.querySelector('#add-photo-category');

  if (titleInput.value === "" || categorySelect.value === "" || previewImg.src === "") {
    validateUpload.classList.add("shake");
    setTimeout(() => {
      validateUpload.classList.remove("shake");
    }, 500);
  } else {
    const newProject = {
      title: titleInput.value,
      category: categorySelect.value,
      imageUrl: previewImg.src
    };
    try {
      const addedProject = await addProjectToApi(newProject);
      console.log("Projet ajouté :", addedProject);
      // Réinitialiser les champs du formulaire
      titleInput.value = "";
      categorySelect.value = "";
      previewImgContainer.style.visibility = "hidden";
      previewImg.style.visibility = "hidden";
    } catch (error) {
      console.error(error);
    }
  }
});

// Récupérer la référence du menu déroulant des catégories
const categorySelect = document.querySelector('#add-photo-category');

// Fonction pour générer les options du menu déroulant des catégories
function generateCategoryOptions(categories) {
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}
async function fetchCategoriesphoto() {
  try {
    const response = await fetch("http://localhost:5678/api/categories", {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      const categories = await response.json();
      return categories;
    } else {
      throw new Error("Échec de la récupération des catégories");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Appel de la fonction pour récupérer les catégories et générer les options
fetchCategoriesphoto()
  .then((categories) => {
    generateCategoryOptions(categories);
  })
  .catch((error) => {
    console.error(error);
  });

