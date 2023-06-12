/////////////////// Authentification de l’utilisateur/////////////////////////////////////////////////////////////////////////////////
// Récupération des éléments du DOM
const email = document.getElementById('email');
const password = document.getElementById('password');
const form = document.getElementById('formulaire');

// Ajout d'un écouteur d'événement au formulaire
form.addEventListener('submit', function(e){
    //empecher le raffraichissement de la page
    e.preventDefault();
    console.log('formulaire validé');

 // Envoi d'une requête POST à l'API d'authentification
fetch('http://localhost:5678/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': ' application/json'
  },
  body: JSON.stringify({
    email: email.value,
    password: password.value,
})//Fermeture body
})//Fermeture fetch
.then(response => response.json())
.then(data => {
    // Vérifie si la requête a réussi
    if(data.token) {
      // Stocke le token d'authentification dans le stockage local
      sessionStorage.setItem('authToken', data.token);

      
      // Redirige vers la page d'accueil
      window.location.href = './index.html';
    } else {
      // Affiche un message d'erreur
      email.nextElementSibling.classList.remove('invisible');
    }
    console.log(data)
  })
})//Fermeture addEventListener
