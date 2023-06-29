window.addEventListener('DOMContentLoaded', (event) => {
    // Récupère le token du sessionStorage
    const token = sessionStorage.getItem('authToken');

    // Si le token existe, supprime la classe 'appear' de tous les éléments qui l'ont
    if (token) {
        const elementsWithAppear = document.querySelectorAll('.appear');
        elementsWithAppear.forEach(element => {
            element.classList.remove('appear');
        });
    }
});



let arrayGallery = []
fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
        // Nommage du tableau
        arrayGallery = data;
        //Appel de la fonction
        displayWork()
    });



function displayWork(categoryId) {
    const filterarrayGallery = categoryId === undefined ? arrayGallery : arrayGallery.filter(gallery => gallery.categoryId === categoryId);


    filterarrayGallery.forEach(item => {

        //Je sélectionne et je stocke la DIV gallery
        const galleryContainer = document.querySelector('.gallery');

        //Création d'une DIV avec Template Strings
        const article = `
        <figure>
        <img src="${item.imageUrl}">
        <figcaption>${item.title}</figcaption>
        </figure>
        `

        // Ajout de article dans la DIV dédiée 
        galleryContainer.innerHTML += article;
    }
    )
};

///

//Cette ligne utilise la méthode fetch() pour effectuer une requête HTTP à l'API située à 
fetch('http://localhost:5678/api/categories')
    //lorsque la requête HTTP est terminée), la réponse doit être convertie en JSON.
    .then(response => response.json())
    .then(data => {


        // Nommage du tableau
        const arrayCategories = data;


        //Parcours ton tableau de catégories en utilisant une boucle forEach pour itérer sur chaque objet de ton tableau 
        // L'élément actuel est accessible via le paramètre item.
        arrayCategories.forEach(item => {


            //Je sélectionne et je stocke la DIV gallery
            const categoriesContainer = document.querySelector('.categories');


            const article = document.createElement('article');
            article.className = "btn-all"
            article.innerHTML = item.name

            article.addEventListener('click', function () {
                const gallery = document.getElementById('gallery');
                gallery.innerHTML = "";
                displayWork(item.id)
            })

            const option = document.createElement('option');
            option.innerHTML = item.name;
            option.value = item.id;

            document.getElementById('ctgy').appendChild(option);
            // Ajout de article dans la DIV dédiée 
            categoriesContainer.appendChild(article);

        })


        //Affiche tout dans le bouton tout 
        const displayAllButton = document.getElementById('filterAll-button');
        function displayAll() {
            const galleryContainer = document.querySelector('.gallery');
            galleryContainer.innerHTML = '';
            arrayGallery.forEach(item => {
                // Création d'une structure figure avec une image et une légende pour chaque élément
                const article = `
        <figure>
        <img src="${item.imageUrl}">
        <figcaption>${item.title}</figcaption>
        </figure>
        `;

                // Ajout de l'article à la galerie
                galleryContainer.innerHTML += article;
            });
        }

        displayAllButton.addEventListener('click', function () {
            displayAll();
        });

    })


//Création modal 
const project = document.querySelector('.edit3');
project.addEventListener('click', function () {
    //Je sélectionne et je stocke la DIV modal-container
    const modal = document.querySelector('.modalContainer');

    //Je rends visible la DIV modal-container
    modal.style.display = "block";
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';

    //Je sélectionne et je stocke la DIV gallery
    const galleryContainer = document.querySelector('.photo-gallery');

    //Je réinitialise le contenu de la galerie
    galleryContainer.innerHTML = '';

    //Je génère le nouveau contenu de la galerie
    arrayGallery.forEach(item => {

        const modalHtml = document.createElement('div');
        modalHtml.classList.add('photo-edit');
        modalHtml.innerHTML = '<img src="' + item.imageUrl + '"> <p>éditer</p>'
        const trashI = document.createElement('i');
        trashI.classList.add('blackIcon1', 'fa-solid', 'fa-trash-can');
        modalHtml.appendChild(trashI);


        galleryContainer.appendChild(modalHtml);
        trashI.addEventListener('click', function (event) {
            const workId = item.id;
            const deletedElement = event.target.parentNode;
            fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    deletedElement.remove();
                })
                .catch(error => console.error('Error:', error));
        });//Femerture listener
    });
})

// Je sélectionne et je stocke la DIV modal-container
const modal = document.querySelector('.modalContainer');

// Je sélectionne l'icone
const icone = document.querySelector('.close-Tab')


// J'ajoute un écouteur d'événements pour les clics sur le conteneur de la modale
modal.addEventListener('click', function (event) {
    // Je vérifie si le clic a été fait directement sur le conteneur ou sur l'icône de fermeture
    if (event.target.className.includes("modalContainer") || event.target.className.includes("close-Tab")) {

        // Je rends invisible la DIV modal-container
        modal.style.display = 'none';
    } else if (event.target.id.includes("btn-Add")) {

        modalImage.style.display = 'block';
    }
});



//Je sélectionne et je stocke le bouton 
const btnAdd = document.getElementById('btn-Add');
const modalImage = document.querySelector('.filterModal');

modalImage.addEventListener('click', function (close) {
    // Je vérifie si le clic a été fait directement sur le conteneur ou sur l'icône de fermeture
    if (close.target.className.includes("returnTab") || close.target.className.includes("close-Tab1 ") || close.target.className.includes("filterModal")) {

        // Je rends invisible la DIV modal-container
        modalImage.style.display = 'none';

    }
})


//Deuxième formulaire 
// 1 - Je sélectionne et stocke tous les éléments nécessaires
const form = document.getElementById('formulaireAddWork');
const photoUploadElem = document.getElementById('photoUpload');
const titleElem = document.getElementById('title');
const categoryElem = document.getElementById('ctgy');
const msgError = document.querySelectorAll('.error');
const btnAccept = document.getElementById('btnSub')

//Je détecte la validation du formulaire 
btnAccept.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    //Je récupère les valeurs de chacun des inputs 
    const photoUpload = photoUploadElem.files;
    const title = titleElem.value.trim();
    const category = categoryElem.value.trim();

    //Amélioration de l'ue
    //Tous les messages d'erreurs sont invisibles
    msgError.forEach(error => {
        error.classList.add('invisible');
    })
    //Je vérifie les informations de l'utilisateur
    if (photoUpload.length == 0 || (photoUpload[0].type && !photoUpload[0].type.startsWith('image/'))) {

        photoUploadElem.nextElementSibling.classList.remove('invisible');
    } else if (title.length < 3 || title.length > 15) {

        titleElem.nextElementSibling.classList.remove('invisible');
    } /*else {
    console.log('succès');
    titre.innerText = "Votre formulaire est correctement envoyé !";
};
*/
    //Création de l'objet FormData
    var formData = new FormData(form);
    formData.append("image", photoUpload[0]);
    formData.append("title", title);
    formData.append("category", category); // Assurez-vous que 'category' est un entier

    // Utilisation de Fetch pour envoyer les données
    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: formData
    })
        .then(response => response.json()) // Si vous vous attendez à une réponse JSON
        .then(data => console.log(data)) // Affichez la réponse dans la console
        .catch(error => console.error('Error:', error)); // Gérez les erreurs
});
function checkFormCompletion() {
    const photoUpload = photoUploadElem.files;
    const title = titleElem.value.trim();
    const category = categoryElem.value.trim();
  
    if (photoUpload.length > 0 && title.length >= 3 && title.length <= 15 && category.length > 0) {
      btnAccept.style.backgroundColor = '#1D6154'; // Changer la couleur du bouton
    } else {
      btnAccept.style.backgroundColor = ''; // Réinitialiser la couleur du bouton
    }
  }
  
  // Ajouter des écouteurs d'événements sur les champs du formulaire
  photoUploadElem.addEventListener('input', checkFormCompletion);
  titleElem.addEventListener('input', checkFormCompletion);
  categoryElem.addEventListener('input', checkFormCompletion);


//Upload de la photo //
// Écouteur d'événements pour le changement de fichier dans le téléchargement de la photo
// Sélectionner l'élément d'upload de la photo
const photoUp = document.getElementById('photoUpload');

// Écouteur d'événements pour le changement de fichier dans le téléchargement de la photo
photoUp.addEventListener('change', function () {
    // Vérifier s'il y a un fichier sélectionné
    if (photoUp.files.length > 0) {
        // Créer une URL d'objet pour le fichier sélectionné
        const imageURL = URL.createObjectURL(photoUploadElem.files[0]);

        // Sélectionner l'élément du rectangle bleu
        const rectangleBleu = document.querySelector('.photo-upload');

        // Effacer le contenu précédent du rectangle bleu
        rectangleBleu.innerHTML = '';

        // Créer un élément <img> avec l'URL de l'image et l'ajouter dans le rectangle bleu
        const imgElement = document.createElement('img');
        imgElement.src = imageURL;
        rectangleBleu.appendChild(imgElement);
    }
});
