console.log('connecté !');
let arrayGallery = []
fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {

        // Nommage du tableau
        arrayGallery = data;
        console.log(arrayGallery)

        //Appel de la fonction
        displayWork()

    });



function displayWork(categoryId) {
    const filterarrayGallery = categoryId === undefined ? arrayGallery : arrayGallery.filter(gallery => gallery.categoryId === categoryId);


    filterarrayGallery.forEach(item => {
        console.log(item);

        //Je sélectionne et je stocke la DIV gallery
        const galleryContainer = document.querySelector('.gallery');
        console.log(galleryContainer);

        //Création d'une DIV avec Template Strings
        const article = `
        <figure>
        <img src="${item.imageUrl}">
        <figcaption>${item.title}</figcaption>
        </figure>
        `
        console.log(article);

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
        console.log(data);

        // Nommage du tableau
        const arrayCategories = data;
        console.log(arrayCategories)

        //Parcours ton tableau de catégories en utilisant une boucle forEach pour itérer sur chaque objet de ton tableau 
        // L'élément actuel est accessible via le paramètre item.
        arrayCategories.forEach(item => {
            console.log(item);

            //Je sélectionne et je stocke la DIV gallery
            const categoriesContainer = document.querySelector('.categories');
            console.log(categoriesContainer);

            const article = document.createElement('article');
            article.className = "btn-all"
            article.innerHTML = item.name

            article.addEventListener('click', function () {
                const gallery = document.getElementById('gallery');
                gallery.innerHTML = "";
                displayWork(item.id)
            })
            
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



