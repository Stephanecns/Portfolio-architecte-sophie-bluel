// Événement DOMContentLoaded pour s'assurer que le contenu de la page est chargé avant d'exécuter le code
window.addEventListener('DOMContentLoaded', () => {
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

// Variable pour stocker les données de la galerie
let arrayGallery = []
// Récupération des données de l'API au chargement de la page
fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
        // Stockage des données dans le tableau arrayGallery
        arrayGallery = data;
        // Appel de la fonction displayWork() pour afficher la galeri
        displayWork()
    });

// Fonction pour afficher les travaux dans la galerie
function displayWork(categoryId) {
    // Filtrage des travaux en fonction de la catégorie sélectionnée (si categoryId est défini)
    const filterarrayGallery = categoryId === undefined ? arrayGallery : arrayGallery.filter(gallery => gallery.categoryId === categoryId);

    // Parcours des travaux filtrés et affichage dans la galerie
    filterarrayGallery.forEach(item => {

        // Sélection de la DIV gallery
        const galleryContainer = document.querySelector('.gallery');

        /// Création d'une structure HTML avec les données des travaux
        const article = `
        <figure>
        <img src="${item.imageUrl}">
        <figcaption>${item.title}</figcaption>
        </figure>
        `

        // Ajout de l'article dans la DIV dédiée
        galleryContainer.innerHTML += article;
    }
    )
};

// Récupération des catégories depuis l'API 
fetch('http://localhost:5678/api/categories')
    //lorsque la requête HTTP est terminée), la réponse doit être convertie en JSON.
    .then(response => response.json())
    .then(data => {


        // Stockage des catégories dans un tableau
        const arrayCategories = data;


        // Parcours du tableau de catégories
        arrayCategories.forEach(item => {
            // Sélection de la DIV categories
            const categoriesContainer = document.querySelector('.categories');

            // Création d'un élément article pour chaque catégorie
            const article = document.createElement('article');
            article.className = "btn-all"
            article.innerHTML = item.name

            // Ajout d'un écouteur d'événements pour filtrer les travaux par catégorie
            article.addEventListener('click', function () {
                const gallery = document.getElementById('gallery');
                gallery.innerHTML = "";
                displayWork(item.id)
            })

            // Création d'un élément option pour le menu déroulant des catégories
            const option = document.createElement('option');
            option.innerHTML = item.name;
            option.value = item.id;

            // Ajout de l'option dans le menu déroulant
            document.getElementById('ctgy').appendChild(option);
            // Ajout de l'article dans la DIV categories
            categoriesContainer.appendChild(article);

        })


        // Événement click sur le bouton "Tout afficher" 
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

// Création de la modale
const project = document.querySelector('.edit3');
project.addEventListener('click', function () {
    //Je sélectionne et je stocke la DIV modal-container
    const modal = document.querySelector('.modalContainer');

    // Affichage de la modale
    modal.style.display = "block";
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';

    // Sélection de la DIV photo-gallery
    const galleryContainer = document.querySelector('.photo-gallery');

    // Réinitialisation du contenu de la galerie
    galleryContainer.innerHTML = '';

    // Génération du contenu de la galerie dans la modale
    arrayGallery.forEach(item => {

        const modalHtml = document.createElement('div');
        modalHtml.classList.add('photo-edit');
        modalHtml.innerHTML = '<img src="' + item.imageUrl + '"> <p>éditer</p>'
        const trashI = document.createElement('i');
        trashI.classList.add('blackIcon1', 'fa-solid', 'fa-trash-can');
        modalHtml.appendChild(trashI);

        galleryContainer.appendChild(modalHtml);

        // Événement click sur l'icône de suppression
        trashI.addEventListener('click', function (event) {
            const workId = item.id;
            const deletedElement = event.target.parentNode;
            // Requête pour supprimer le travail de la base de données
            fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
                .then(response => {
                    // Vérification de la réponse HTTP pour la confirmation de suppression
                    if (response.status === 204) {
                        deletedElement.remove();
                    }
                })
                .catch(error => console.error('Error:', error));
        });//Femerture listener
    });
})

// Sélection de la DIV modal-container
const modal = document.querySelector('.modalContainer');

// Sélection de l'icône de fermeture
const icone = document.querySelector('.close-Tab')


// Événement click sur le conteneur de la modale
modal.addEventListener('click', function (event) {
    // Je vérifie si le clic a été fait directement sur le conteneur ou sur l'icône de fermeture
    if (event.target.className.includes("modalContainer") || event.target.className.includes("close-Tab")) {

        // Fermeture de la modale
        modal.style.display = 'none';
    } else if (event.target.id.includes("btn-Add")) {

        modalImage.style.display = 'block';
    }
});



// Sélection du bouton d'ajout
const btnAdd = document.getElementById('btn-Add');
const modalImage = document.querySelector('.filterModal');
// Événement click pour fermer la modale d'ajout
modalImage.addEventListener('click', function (close) {
    // Vérification du clic sur le conteneur ou sur l'icône de fermeture
    if (close.target.className.includes("returnTab") || close.target.className.includes("close-Tab1 ") || close.target.className.includes("filterModal")) {

        // Je rends invisible la DIV modal-container
        modalImage.style.display = 'none';

    }
})


//Deuxième formulaire 
// Sélection des éléments du formulaire
const form = document.getElementById('formulaireAddWork');
const photoUploadElem = document.getElementById('photoUpload');
const titleElem = document.getElementById('title');
const categoryElem = document.getElementById('ctgy');
const msgError = document.querySelectorAll('.error');
const btnAccept = document.getElementById('btnSub')

// Événement click sur le bouton de soumission du formulaire
btnAccept.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    // Récupération des valeurs des champs du formulaire 
    const photoUpload = photoUploadElem.files;
    const title = titleElem.value.trim();
    const category = categoryElem.value.trim();

    // Masquage des messages d'erreur
    msgError.forEach(error => {
        error.classList.add('invisible');
    })
    // Vérification des informations saisies par l'utilisateur
    if (photoUpload.length == 0 || (photoUpload[0].type && !photoUpload[0].type.startsWith('image/'))) {

        photoUploadElem.nextElementSibling.classList.remove('invisible');
    } else if (title.length < 3 || title.length > 15) {

        titleElem.nextElementSibling.classList.remove('invisible');
    } /*else {
    console.log('succès');
    titre.innerText = "Votre formulaire est correctement envoyé !";
};
*/
    // Création de l'objet FormData pour envoyer les données du formulaire
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
        .then(data => {
            // Récupération de l'URL de l'image depuis la réponse
            const imageUrl = data.imageUrl;

            // Création d'une structure HTML pour afficher l'image
            const imageHtml = `
            <figure>
            <img src="${image.imageUrl}">
            <figcaption>${item.title}</figcaption>
            </figure>
            `;

            // Ajout de l'image à la galerie existante dans le DOM
            const galleryContainer = document.querySelector('.gallery');
            galleryContainer.innerHTML = imageHtml;
        })
        .catch(error => console.error('Error:', error)); // Gérez les erreurs
});

// Vérification de la complétion du formulaire
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

// Ajout d'écouteurs d'événements pour les champs du formulaire
photoUploadElem.addEventListener('input', checkFormCompletion);
titleElem.addEventListener('input', checkFormCompletion);
categoryElem.addEventListener('input', checkFormCompletion);

// Gestion du téléchargement de la photo
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
