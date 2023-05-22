import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherAvis, afficherGraphiqueAvis} from "./avis.js";

// Récupération des pièces éventuellement stockées dans le localStorage
let pieces = window.localStorage.getItem("pieces");

if(pieces === null) {
    // Récuperation des pieces depuis une API-HTTP
    const reponse =  await fetch("http://localhost:8081/pieces");
    pieces = await reponse.json();

    // Transformation des pieces en JSON
    const valeurPieces = JSON.stringify(pieces);

    // Stockage des informations dans le local storage
    window.localStorage.setItem("pieces",valeurPieces);
}else{
   pieces = JSON.parse(pieces);
}

// on appel la fonction pour ajouter le Listener au formulaire.
ajoutListenerEnvoyerAvis();

function genererPieces(pieces){
    for (let i = 0; i < pieces.length; i++) {
        
        const article = pieces[i];

    // Récupération de l'element du DOM qui acceuillera les fiches.
        const sectionFiches = document.querySelector(".fiches");
    // Création d'une balise dédiée à une pièce automobile.
        const pieceElement = document.createElement("article");

    //Création des balises
        const imageElement = document.createElement("img");
        imageElement.src = pieces[i].image;

        const nomElement = document.createElement("h2");
        nomElement.innerText = article.nom;

        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;
        document.body.appendChild(prixElement);

        const categorieElement = document.createElement("p");
        categorieElement.innerText = article.categorie ?? "(aucune catégorie)";

        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = article.description ?? "Pas de description pour le moment.";

        const stockElement = document.createElement("p");
        stockElement.innerText = article.disponibilite ? "En stock" : "Rupture de stock";

        const avisBouton = document.createElement("button");
        avisBouton.dataset.id = article.id;
        avisBouton.textContent = "Afficher les avis";

    // Affichage des balises dans le Parent html .fiches
        sectionFiches.appendChild(pieceElement);

        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(stockElement);
        pieceElement.appendChild(avisBouton);

    }
    ajoutListenersAvis();
   
}
// Efface le contenu de la balise body et donc l’écran
genererPieces(pieces);

for(let i = 0; i <pieces.length; i++) {
    const id = pieces[i].id;
    const avisJSON = window.localStorage.getItem(`avis-piece-${id}`);
    const avis = JSON.parse(avisJSON);

    if(avis !== null) {
        const pieceElement = document.querySelector(`aritcle[data-id="${id}"]`);
        afficherAvis(piecesElement, avis)
    }
}



//gestion des boutons
// bouton de tri des prix par ordre croissant.
const boutonTrier = document.querySelector(".btn-trier");

    boutonTrier.addEventListener("click",function() {
        const piecesOrdonnees = Array.from(pieces);
        piecesOrdonnees.sort(function(a, b){
            return a.prix - b.prix;
        });
    // Efface le contenu de la page pour le regenerer avec les nouveaux parametres.    
        document.querySelector(".fiches").innerHTML = "";
        genererPieces(piecesOrdonnees);
});

// bouton filtrage prix abordables au en dessous de 35 euros.
const boutonFiltrer = document.querySelector(".btn-filtrer");

    boutonFiltrer.addEventListener("click", function() {
        const piecesFiltrees = pieces.filter(function(piece) {
            return piece.prix <= 35;
        });
        document.querySelector(".fiches").innerHTML = "";
        genererPieces(piecesFiltrees);
});

// bouton tri des prix par ordre decroissant.  
const boutonDecroissant = document.querySelector(".btn-trierReverse");

    boutonDecroissant.addEventListener("click", function() {
        const piecesDesordonnees = Array.from(pieces);
        piecesDesordonnees.sort(function(a, b) {
            return b.prix - a.prix;
        });
        document.querySelector(".fiches").innerHTML = "";
        genererPieces(piecesDesordonnees);
});

// bouton filtrage par description.
const boutonDisponibilite = document.querySelector(".btn-dispo");

    boutonDisponibilite.addEventListener("click", function() {
        const piecesFiltrees = pieces.filter(function(piece) {
            return piece.disponibilite === true;
        });
        document.querySelector(".fiches").innerHTML = "";
        genererPieces(piecesFiltrees);
});

// supprimer les elements qui sont au dessus de 35 euros.
const noms = pieces.map(piece => piece.nom);
    for(let i = pieces.length -1 ; i >= 0; i--) {
        if(pieces[i].prix > 35){
            noms.splice(i,1);
        }
}
console.log(noms);

// creation de l'en-tete.
const pElement = document.createElement('p');
pElement.innerText = "Pièces abordables :";
    //creation de la liste des pieces abordables.
    const abordablesElements = document.createElement('ul');
    // Ajout de chaque nom a la liste.
    for(let i=0; i < noms.length ; i++){
        const nomElement = document.createElement('li');
        nomElement.innerText = noms[i];
        abordablesElements.appendChild(nomElement)
}

//Ajout de l'en-tete puis de la liste au bloc résultats filtres.
document.querySelector('.abordables')
.appendChild(pElement)
.appendChild(abordablesElements);

// Récupération du nom et du prix grace à Map.
const nomsDisponibles = pieces.map(piece => piece.nom)
const prixDisponibles = pieces.map(piece => piece.prix) 

for(let i = pieces.length -1; i >= 0; i--) {
    if(pieces[i].disponibilite === false) {
        nomsDisponibles.splice(i,1)
        prixDisponibles.splice(i,1)
    }
}
console.log(nomsDisponibles, prixDisponibles);
// Création de la liste dans le html pour chaques éléments.
const disponibleElements = document.createElement('ul');

for(let i=0; i < nomsDisponibles.length; i++){
    const dispoElements = document.createElement('li');
    dispoElements.innerText = `${nomsDisponibles[i]} - ${prixDisponibles[i]} €`;
    disponibleElements.appendChild(dispoElements)
}
const pElementDisponible = document.createElement('p');
pElementDisponible.innerText = "Pièces disponibles:";

document.querySelector('.disponibles')
.appendChild(pElementDisponible)
.appendChild(disponibleElements);

// Trier par prix avec le selecteur input type range.
const inputPrixMax = document.querySelector('#prix-max')
inputPrixMax.addEventListener('input', function(){
    const piecesFiltrees = pieces.filter(function(piece){
        return piece.prix <= inputPrixMax.value;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
})

// Ajout du Listener pour mettre à jour des données du localStorage
const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function() {
    window.localStorage.removeItem("pieces");

});
await afficherGraphiqueAvis();

